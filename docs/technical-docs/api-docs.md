# Documentação Técnica da API

## Visão Geral

API REST construída com **Express + TypeScript**, utilizando **Prisma ORM** com SQLite e autenticação via **JWT**. O servidor sobe na porta `3000` por padrão (configurável via variável de ambiente `PORT`).

**Base URL:** `http://localhost:3000`

---

## Autenticação

A API utiliza autenticação via **Bearer Token (JWT)**. Rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido na rota `POST /auth/login` e tem validade de **1 dia**.

---

## Health Check

### `GET /health`

Verifica se a API está no ar.

**Resposta de sucesso `200`:**
```json
{ "status": "ok" }
```

---

## Rotas de Autenticação — `/auth`

### `POST /auth/registrar`

Cria um novo usuário.

**Body (JSON):**

| Campo      | Tipo   | Obrigatório | Descrição                          |
|------------|--------|-------------|-------------------------------------|
| `name`     | string | Sim         | Nome do usuário                     |
| `email`    | string | Sim         | E-mail válido                       |
| `password` | string | Sim         | Senha (mínimo 6 caracteres)         |

**Exemplo de requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Usuario criado com sucesso",
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                        | Motivo                         |
|--------|---------------------------------|--------------------------------|
| `400`  | `Todos os campos são obrigatórios` | Campo ausente no body       |
| `409`  | `Email já cadastrado`           | E-mail duplicado               |

---

### `POST /auth/login`

Autentica um usuário e retorna o token JWT.

**Body (JSON):**

| Campo      | Tipo   | Obrigatório |
|------------|--------|-------------|
| `email`    | string | Sim         |
| `password` | string | Sim         |

**Exemplo de requisição:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso `200`:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                          | Motivo                               |
|--------|-----------------------------------|--------------------------------------|
| `400`  | `Todos os campos são obrigatórios` | Campo ausente no body               |
| `401`  | `Usuário não encontrado`          | E-mail não cadastrado ou senha errada |

---

### `GET /auth/me` 🔒

Retorna os dados do usuário autenticado. **Requer token.**

**Resposta de sucesso `200`:**
```json
{
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                      | Motivo                    |
|--------|-------------------------------|---------------------------|
| `401`  | `Token não fornecido`         | Header Authorization ausente |
| `401`  | `Token inválido ou expirado`  | Token inválido ou expirado |

---

### `GET /auth/listar-usuarios`

Lista todos os usuários cadastrados.

**Resposta de sucesso `200`:**
```json
[
  {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "..."
  }
]
```

---

## Rotas de Dados — `/dados`

Todas as rotas de `POST` possuem validação do body via Zod. Em caso de falha na validação, a resposta será:

**Resposta de erro de validação `400`:**
```json
{
  "error": "Campos obrigatórios faltando ou com formato inválido",
  "detalhes": [
    {
      "campo": "uf",
      "mensagem": "UF deve ter exatamente 2 caracteres"
    }
  ]
}
```

> **Nota sobre o contrato POST:** O pipeline Colab envia os dados usando a função `enviar()`, que itera o DataFrame registro a registro e dispara **um POST por linha**. Por isso, todos os endpoints de ingestão recebem um **objeto único** por requisição — não um array.

---

### `POST /dados/receber-risco-credito`

Recebe e persiste um registro do **Eixo I — Risco de Crédito**.

Os valores são razões financeiras brutas calculadas pelo Colab a partir dos dados SCR do Banco Central, agrupados por `(mesAno, regiao, uf)`. Os dados são séries temporais: um registro por período por UF.

**Body (JSON — objeto único):**

| Campo                  | Tipo   | Obrigatório | Descrição                                                          |
|------------------------|--------|-------------|--------------------------------------------------------------------|
| `mesAno`               | string | Sim         | Período de referência no formato `YYYYMM` (ex: `"202401"`)        |
| `uf`                   | string | Sim         | Sigla do estado — exatamente 2 caracteres                          |
| `regiao`               | string | Sim         | Macrorregião (ex: `"Sudeste"`)                                     |
| `inadiplenciaReal`     | number | Sim         | Razão: carteira_vencida / carteira_ativa                           |
| `fragilidadeRenda`     | number | Sim         | Razão: carteira_ativa (classes D e E) / carteira_ativa total       |
| `agingDivida`          | number | Sim         | Razão: vencido acima de 90 dias / carteira_vencida                 |
| `vulnerabilidadeSocial`| number | **Não**     | Derivado de taxa_escolarizacao (IBGE) — pendente no Colab. Omitir até conclusão. |

**Exemplo de requisição:**
```json
{
  "mesAno": "202401",
  "uf": "SP",
  "regiao": "Sudeste",
  "inadiplenciaReal": 0.045,
  "fragilidadeRenda": 0.312,
  "agingDivida": 0.621
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Registro de Risco de Crédito cadastrado com sucesso.",
  "id": 42
}
```

---

### `POST /dados/receber-inclusao-expansao`

Recebe e persiste um registro do **Eixo II — Inclusão e Expansão**.

Calculado pelo Colab a partir dos dados Pix (BCB) e censo demográfico (IBGE), agrupados por `(mesAno, regiao, uf)`.

> **Status:** `calcular_eixo_ii` está em desenvolvimento no Colab. Os campos abaixo refletem o contrato esperado baseado nos dados disponíveis em `df_ibge` e `df_scr_pix`.

**Body (JSON — objeto único):**

| Campo                    | Tipo   | Obrigatório | Descrição                                                      |
|--------------------------|--------|-------------|----------------------------------------------------------------|
| `mesAno`                 | string | Sim         | Período de referência no formato `YYYYMM` (ex: `"202401"`)    |
| `uf`                     | string | Sim         | Sigla do estado — exatamente 2 caracteres                      |
| `regiao`                 | string | Sim         | Macrorregião (ex: `"Sul"`)                                     |
| `maturidadePix`          | number | Sim         | Volume Pix per capita (volume_pix / populacao_residente)       |
| `crescimentoPopulacional`| number | Sim         | Taxa de crescimento geométrico do censo                        |
| `populacaoAbsoluta`      | number | Sim         | População residente absoluta                                   |
| `bonusDemografico`       | number | Sim         | Derivado da variação absoluta da população / estrutura etária  |

**Exemplo de requisição:**
```json
{
  "mesAno": "202401",
  "uf": "PR",
  "regiao": "Sul",
  "maturidadePix": 1823.45,
  "crescimentoPopulacional": 0.0087,
  "populacaoAbsoluta": 11597484,
  "bonusDemografico": 0.412
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Registro de Inclusão/Expansão cadastrado com sucesso.",
  "id": 17
}
```

---

## Rota de Listagem com Granularidade — `GET /dados/listar-dados`

Os dados no banco são **séries temporais** — cada registro representa um período (`mesAno`) para uma UF específica. A granularidade controla o agrupamento geográfico: a dimensão temporal é sempre colapsada pela média quando uma granularidade é aplicada.

### Parâmetros de query

Todos os parâmetros são opcionais e podem ser combinados livremente.

| Parâmetro       | Tipo   | Valores aceitos                                            | Descrição                                                                 |
|-----------------|--------|------------------------------------------------------------|---------------------------------------------------------------------------|
| `granularidade` | string | `macro` ou `micro`                                         | Define o nível de agrupamento geográfico                                  |
| `indicador`     | string | Um ou mais nomes de indicador, separados por vírgula       | Restringe a resposta aos indicadores selecionados (ver tabela abaixo)     |
| `regiao`        | string | Uma ou mais macrorregiões, separadas por vírgula           | Filtra por macrorregião (ex.: `Sul`, `Sudeste,Sul`)                       |
| `uf`            | string | Uma ou mais UFs (2 caracteres), separadas por vírgula      | Filtra por estado (ex.: `SP`, `SP,MG,RJ`). Case-insensitive na entrada     |

#### Valores aceitos para `indicador`

| Eixo                          | Valores                                                                                                  |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
| Risco de Crédito (Eixo I)     | `inadimplenciaReal`, `fragilidadeRenda`, `agingDivida`, `vulnerabilidadeSocial`                          |
| Inclusão e Expansão (Eixo II) | `maturidadePix`, `crescimentoPopulacional`, `populacaoAbsoluta`, `bonusDemografico`                      |

Quando `indicador` é informado contendo somente indicadores de um único eixo, o array do outro eixo virá vazio na resposta. Quando o parâmetro é omitido, todos os indicadores de ambos os eixos são retornados.

Exemplos:

- `GET /dados/listar-dados?indicador=inadimplenciaReal,agingDivida&regiao=Sudeste`
- `GET /dados/listar-dados?granularidade=micro&uf=SP,MG`
- `GET /dados/listar-dados?granularidade=macro&indicador=maturidadePix`

Toda resposta de sucesso passa a incluir o objeto `filtros`, refletindo exatamente os parâmetros aplicados (ou `null` quando não informados).

```json
"filtros": {
  "indicador": ["inadimplenciaReal", "agingDivida"],
  "regiao": ["Sudeste"],
  "uf": null
}
```

> **Observação:** o nome do indicador na resposta é sempre `inadimplenciaReal` (com `m`). Em versões anteriores o campo bruto era `inadiplenciaReal` (refletindo o nome interno da coluna no banco) — agora a API normaliza para `inadimplenciaReal` em todas as granularidades.

---

#### `GET /dados/listar-dados` _(sem parâmetro)_

Retorna a **série temporal completa** — todos os registros brutos de ambos os eixos, ordenados por região, UF e período cronologicamente. Ideal para análise de evolução temporal.

**Resposta de sucesso `200`:**
```json
{
  "granularidade": null,
  "descricao": "Série temporal completa — todos os registros brutos por UF e período",
  "filtros": { "indicador": null, "regiao": null, "uf": null },
  "riscoCredito": [
    {
      "id": 1,
      "mesAno": "202401",
      "uf": "SP",
      "regiao": "Sudeste",
      "inadimplenciaReal": 0.045,
      "fragilidadeRenda": 0.312,
      "agingDivida": 0.621,
      "vulnerabilidadeSocial": 0
    }
  ],
  "inclusaoExpansao": [
    {
      "id": 1,
      "mesAno": "202401",
      "uf": "SP",
      "regiao": "Sudeste",
      "maturidadePix": 1950.32,
      "crescimentoPopulacional": 0.0091,
      "populacaoAbsoluta": 45900000,
      "bonusDemografico": 0.389
    }
  ]
}
```

---

#### `GET /dados/listar-dados?granularidade=macro`

Retorna os valores **agregados por macrorregião** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul). Os campos numéricos são a **média** de todos os registros — de todos os estados e de todos os períodos — de cada região.

**Resposta de sucesso `200`:**
```json
{
  "granularidade": "macro",
  "descricao": "Médias agregadas por macrorregião (todos os estados e períodos)",
  "filtros": { "indicador": null, "regiao": null, "uf": null },
  "riscoCredito": [
    {
      "regiao": "Sudeste",
      "_avg": {
        "inadimplenciaReal": 0.041,
        "fragilidadeRenda": 0.298,
        "agingDivida": 0.589,
        "vulnerabilidadeSocial": 0
      }
    }
  ],
  "inclusaoExpansao": [
    {
      "regiao": "Sudeste",
      "_avg": {
        "maturidadePix": 1742.10,
        "crescimentoPopulacional": 0.0082,
        "populacaoAbsoluta": 22500000.00,
        "bonusDemografico": 0.401
      }
    }
  ]
}
```

---

#### `GET /dados/listar-dados?granularidade=micro`

Retorna os valores **agregados por UF** (estado), colapsando todos os períodos disponíveis na média. O campo `regiao` é incluído no agrupamento para que o cliente saiba a qual macrorregião cada UF pertence sem necessitar de join adicional.

**Resposta de sucesso `200`:**
```json
{
  "granularidade": "micro",
  "descricao": "Médias agregadas por UF (todos os períodos disponíveis), com macrorregião de contexto",
  "filtros": { "indicador": null, "regiao": null, "uf": null },
  "riscoCredito": [
    {
      "uf": "MG",
      "regiao": "Sudeste",
      "_avg": {
        "inadimplenciaReal": 0.038,
        "fragilidadeRenda": 0.271,
        "agingDivida": 0.554,
        "vulnerabilidadeSocial": 0
      }
    },
    {
      "uf": "SP",
      "regiao": "Sudeste",
      "_avg": {
        "inadimplenciaReal": 0.045,
        "fragilidadeRenda": 0.312,
        "agingDivida": 0.621,
        "vulnerabilidadeSocial": 0
      }
    }
  ],
  "inclusaoExpansao": [ "..." ]
}
```

---

### Respostas de erro

**Parâmetro `granularidade` inválido `400`:**
```json
{
  "error": "Parâmetro 'granularidade' inválido: \"estado\". Valores aceitos: macro, micro."
}
```

**Parâmetro `indicador` inválido `400`:**
```json
{
  "error": "Indicador(es) inválido(s): foo. Valores aceitos: inadimplenciaReal, fragilidadeRenda, agingDivida, vulnerabilidadeSocial, maturidadePix, crescimentoPopulacional, populacaoAbsoluta, bonusDemografico."
}
```

**Parâmetro `uf` inválido `400`:**
```json
{
  "error": "UF inválido(s): SAO. Cada UF deve ter exatamente 2 caracteres."
}
```

**Erro interno `500`:**
```json
{ "error": "Erro ao buscar dados" }
```

---

## Variáveis de Ambiente

| Variável       | Descrição                                  |
|----------------|--------------------------------------------|
| `PORT`         | Porta do servidor (padrão: `3000`)         |
| `DATABASE_URL` | URL de conexão com o banco SQLite          |
| `JWT_SECRET`   | Chave secreta para assinatura dos tokens JWT |

---

## Fluxo de Uso Típico

O fluxo padrão de integração com a API segue esta ordem:

1. **Registrar** um usuário em `POST /auth/registrar`
2. **Autenticar** em `POST /auth/login` e guardar o token retornado
3. Usar o token no header `Authorization: Bearer <token>` para acessar rotas protegidas
4. **Enviar dados** pelas rotas `POST /dados/receber-*` (normalmente feito pelo script Python `processadordedadosrealit.py`)
5. **Consultar** os dados armazenados pelas rotas `GET /dados/listar-*`

---