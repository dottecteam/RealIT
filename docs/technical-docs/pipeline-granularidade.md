# Pipeline RealIT — Como os dados fluem do Colab até os dashboards

## Visão Geral do Fluxo

```
BCB (SCR)  ─┐
BCB (Pix)  ─┼──► Colab Pipeline ──► API RealIT ──► Dashboards
IBGE       ─┘                        (4 POSTs)     (GET + granularidade)
```

O pipeline passa por **três fases**: extração, processamento e envio.

---

## Fase 1 — Extração e Armazenamento Local (Parquets)

O Colab baixa dados de três fontes e salva em arquivos `.parquet` locais em `/content/dados/`:

| Arquivo | Fonte | Conteúdo |
|---|---|---|
| `scr_data.parquet` | BCB — SCR | Carteiras de crédito por UF, porte e cliente (2021 até hoje) |
| `pix_transacoes.parquet` | BCB — Pix | Transações Pix por estado, desde Nov/2020 |
| `taxa_escolarizacao.parquet` | IBGE SIDRA 7138 | Taxa de escolarização por UF, últimos 3 anos |
| `censo_demografico.parquet` | IBGE SIDRA 4709 | População residente, crescimento e variação por UF |
| `populacao_por_idade.parquet` | IBGE SIDRA 9514 | Distribuição etária por UF |

---

## Fase 2 — Processamento e Consolidação

### 2.1 `construir_df_scr_pix()` → `scr_pix.parquet`

Transforma SCR e Pix em um formato longo unificado. Cada linha representa uma **métrica específica** para um período/UF:

| Campo | Valores possíveis |
|---|---|
| `ano_mes` | string YYYYMM (ex: `"202401"`) |
| `regiao` | Norte, Nordeste, Centro-Oeste, Sudeste, Sul |
| `uf` | Sigla do estado (ex: `"SP"`) |
| `tipo` | `"pf"` ou `"pj"` |
| `classe` | A/B/C/D/E (SCR) ou `null` (Pix) |
| `metrica` | `carteira_vencida`, `carteira_ativa`, `vencido_acima_de_90_dias` (SCR), `vl_pagador`, `qt_pagador`, `qt_pes_pagador` (Pix) |
| `origem` | `"scr"` ou `"pix"` |
| `valor` | float |

### 2.2 `construir_df_ibge()` → `ibge.parquet`

Consolida os três parquets IBGE em uma tabela por UF/ano com:

| Campo | Descrição |
|---|---|
| `ano` | Ano de referência |
| `regiao` | Macrorregião |
| `uf` | Sigla do estado |
| `taxa_escolarizacao` | Proporção (0–1), média das faixas etárias por UF/ano |
| `populacao_residente` | População absoluta do censo |
| `taxa_crescimento` | Taxa de crescimento geométrico (valor/100) |
| `variacao_populacao` | Variação absoluta da população |
| `bonusDemografico` | Diferença entre idade máxima e idade média ponderada da UF |

> **Nota:** `bonusDemografico` é calculado por `calculo_idade()` com base na distribuição etária. Quanto menor a idade média de uma UF em relação à máxima do país, maior o bônus — indica população mais jovem e economicamente ativa.

---

## Fase 3 — Scoring (Cálculo dos Eixos)

### 3.1 `calcular_eixo_i()` → Risco de Crédito

Faz um **merge entre `scr_pix` e `ibge`** pelo eixo temporal (ano) + geográfico (UF/região). Calcula 4 razões:

| Campo calculado | Fórmula |
|---|---|
| `inadimplenciaReal` | `carteira_vencida / carteira_ativa` |
| `fragilidadeRenda` | `carteira_ativa (classes D+E) / carteira_ativa total` |
| `agingDivida` | `vencido_acima_de_90_dias / carteira_vencida` |
| `vulnerabilidadeSocial` | `1 - taxa_escolarizacao` |

Todas as 4 razões passam pela função `normalizacao()` que as converte para a **escala 1.00–5.00**:

```
score = 1 + ((valor - min_do_periodo) / (max_do_periodo - min_do_periodo)) × 4
```

> O min e max são calculados **por período** (`groupby("ano_mes")`), garantindo que a normalização seja relativa ao momento em que os dados foram coletados.

**Output final por registro:**
```
ano_mes, regiao, uf, inadimplenciaReal, fragilidadeRenda, agingDivida, vulnerabilidadeSocial
```

### 3.2 `calcular_eixo_ii()` → Inclusão e Expansão

Merge entre `scr_pix` e `ibge`. Calcula 4 indicadores:

| Campo calculado | Fórmula |
|---|---|
| `maturidadePix` | `(qt_pagador / qt_pes_pagador) × 0.6 + (vl_pagador / qt_pes_pagador) × 0.4` |
| `crescimentoPopulacional` | `taxa_crescimento` (direto do IBGE) |
| `totalHabitantes` | `populacao_residente` (direto do IBGE) |
| `bonusDemografico` | `bonusDemografico` (calculado pelo IBGE — idade média vs máxima) |

Todos passam pela mesma `normalizacao()` para escala 1.00–5.00.

**Output final por registro:**
```
ano_mes, regiao, uf, maturidadePix, crescimentoPopulacional, totalHabitantes, bonusDemografico
```

---

## Fase 4 — Envio para a API

O Colab usa a função `enviar()`, que itera o DataFrame e dispara **um POST por linha**:

```python
def enviar(rota, dados):
    for item in dados:           # itera registro por registro
        SESSION.post(url, json=item, timeout=15)
```

São 4 chamadas ao final do pipeline:

```python
enviar("/data/credit-risk",        df_eixo_i.to_dict(orient='records'))
enviar("/data/inclusion-expansion", df_eixo_ii.to_dict(orient='records'))
enviar("/data/pix-structure",       df_scr_pix.to_dict(orient='records'))
enviar("/data/ibge-structure",      df_ibge.to_dict(orient='records'))
```

> `df_ibge` tem `bonusDemografico` removido antes do envio (é armazenado na tabela de scoring, não na estrutura bruta).

---

## Como o Query Param `?granularidade` Interage com os Dados

A granularidade **só se aplica ao endpoint GET `/data/listar-dados`**, que consulta as tabelas de scores (Eixo I e Eixo II). As tabelas brutas (`pix-structure` e `ibge-structure`) não fazem parte desse endpoint.

### O que está no banco

Os dados chegam como **série temporal**: um registro por `(ano_mes × UF)`. Para 27 UFs e 3 anos de histórico, são aproximadamente 27 × 36 = ~972 registros em cada tabela de score.

Estrutura armazenada:

```
mesAno  | uf | regiao    | inadimplenciaReal | fragilidadeRenda | agingDivida | vulnerabilidadeSocial
--------|----|-----------|--------------------|------------------|-------------|----------------------
202401  | SP | Sudeste   | 3.42               | 2.87             | 4.10        | 2.55
202401  | RJ | Sudeste   | 2.91               | 3.20             | 3.75        | 3.10
202401  | MG | Sudeste   | 3.05               | 2.60             | 3.90        | 2.80
202401  | PR | Sul       | 2.70               | 2.40             | 3.50        | 2.20
...
202402  | SP | Sudeste   | 3.50               | 2.90             | 4.15        | 2.58
...
```

### `?granularidade=macro` → 5 linhas por tabela

O banco executa `GROUP BY regiao` com `AVG()` em todos os campos de score. Colapsa **todos os estados e todos os períodos** de cada macrorregião em uma única média:

```json
{
  "granularidade": "macro",
  "riscoCredito": [
    {
      "regiao": "Centro-Oeste",
      "_avg": { "inadimplenciaReal": 2.84, "fragilidadeRenda": 2.71, ... }
    },
    {
      "regiao": "Nordeste",
      "_avg": { "inadimplenciaReal": 3.51, "fragilidadeRenda": 3.20, ... }
    },
    ...
  ]
}
```

**Caso de uso no dashboard:** mapas coropléticos por região, visão executiva, comparação entre grandes regiões do Brasil.

### `?granularidade=micro` → até 27 linhas por tabela

O banco executa `GROUP BY uf, regiao` com `AVG()`. Colapsa **todos os períodos** de cada UF em uma única média. O campo `regiao` entra no agrupamento para que o front-end saiba a qual macrorregião cada estado pertence — sem necessitar de join ou lookup externo:

```json
{
  "granularidade": "micro",
  "riscoCredito": [
    {
      "uf": "AL",
      "regiao": "Nordeste",
      "_avg": { "inadimplenciaReal": 3.80, "fragilidadeRenda": 3.50, ... }
    },
    {
      "uf": "AM",
      "regiao": "Norte",
      "_avg": { "inadimplenciaReal": 3.10, "fragilidadeRenda": 2.95, ... }
    },
    ...
  ]
}
```

**Caso de uso no dashboard:** rankings estaduais, heatmaps por estado, drill-down a partir da visão macro.

### Sem parâmetro → todos os registros brutos

Retorna a série temporal completa, ordenada por `regiao → uf → mesAno`. Útil para gráficos de linha mostrando evolução temporal de um estado ou região.

**Caso de uso no dashboard:** gráficos de série temporal, análise de tendência, comparação mês a mês.

---

## Mapeamentos Importantes (Colab → API → Banco)

### Eixo I

| Campo no Colab | Campo na API (schema) | Campo no Banco (DB) |
|---|---|---|
| `ano_mes` | `ano_mes` | `mesAno` |
| `inadimplenciaReal` | `inadimplenciaReal` | `inadiplenciaReal` ⚠️ |
| `fragilidadeRenda` | `fragilidadeRenda` | `fragilidadeRenda` |
| `agingDivida` | `agingDivida` | `agingDivida` |
| `vulnerabilidadeSocial` | `vulnerabilidadeSocial` | `vulnerabilidadeSocial` |

> ⚠️ O banco tem um typo histórico (`inadiplenciaReal` sem o "m"). O controller faz o mapeamento silenciosamente. A resposta do GET retorna o campo com a grafia correta (`inadimplenciaReal`).

### Eixo II

| Campo no Colab | Campo na API (schema) | Campo no Banco (DB) |
|---|---|---|
| `ano_mes` | `ano_mes` | `mesAno` |
| `totalHabitantes` | `totalHabitantes` | `populacaoAbsoluta` ⚠️ |
| `maturidadePix` | `maturidadePix` | `maturidadePix` |
| `crescimentoPopulacional` | `crescimentoPopulacional` | `crescimentoPopulacional` |
| `bonusDemografico` | `bonusDemografico` | `bonusDemografico` |

> ⚠️ O nome do campo mudou durante o desenvolvimento. O controller mapeia `totalHabitantes` → `populacaoAbsoluta` automaticamente.

---

## Divergências no Banco que Podem ser Corrigidas Futuramente

| Tabela | Campo no DB | Campo correto | O que fazer |
|---|---|---|---|
| `RiscoCredito` | `inadiplenciaReal` | `inadimplenciaReal` | Migration: renomear coluna |
| `inclusaoExpansao` | `populacaoAbsoluta` | `totalHabitantes` | Migration: renomear coluna |
| `EstruturaSrcPix` | `classe String` (não-nullable) | `classe String?` | Migration: tornar nullable |

Enquanto essas correções não forem feitas, o controller faz o mapeamento necessário para não interromper o pipeline.
