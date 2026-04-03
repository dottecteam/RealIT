# Documento de Tratamento de Dados - SCR.data

## 1. Fonte dos Dados
* **Sistema:** Sistema de Informações de Crédito (SCR.data) - Versão 2
* **Link para download:** Os arquivos .ZIP com os dados mensais da Versão 2 do SCR.Data podem ser baixados a partir da seguinte URL, substituindo a expressão `{ANO}` pelo ano correspondente: https://www.bcb.gov.br/pda/desig/scrdata_{ANO}.zip
* **Periodicidade:** Mensal (disponível 30 dias após o último dia útil do mês)
* **Formato de Origem:** `.csv` compactado em `.zip`

---

## 2. Dicionário de Dados (Schema)
Informação completa disponível no Capítulo 3 do metodologia_versao2.pdf (pág. 2) <br>
Link: https://www.bcb.gov.br/pda/desig/metodologia_versao2.pdf

* **data-base:** Data de referência da informação.
* **uf:** Unidade da Federação.
* **segmento:** Arrendamento, Banco, Cooperativa, Desenvolvimento/Fomento, Financeira, Fintech, Instituição de Pagamento, Outros
* **tipo_cliente:** PF ou PJ.
* **cnae_ocupacao / natureza_ocupacao:** Setor de atuação ou tipo de vínculo.
* **porte:** Faixa de renda (PF) ou faturamento (PJ).
* **modalidade / submodalidade:** Tipo de crédito (ex: Financiamento imobiliário).
* **indexador:** Taxa atrelada (Prefixado, Pós-fixado, etc.).
* **Métricas Financeiras:**
  * numero_de_operacoes
  * a_vencer_ate_90_dias (e demais faixas de vencimento)
  * carteira_a_vencer / carteira_vencida / carteira_ativa
  * carteira_inadimplida / ativo_problematico

---

## 3. Variáveis para considerar:
* **data_base**
* **uf**
* **cliente**
* **cnae_ocupacao**
* **porte**

| Classe social | Definição (IBGE*) | Dado Disponível no SCR |
| :--- | :--- | :--- |
| **Classe A (PF)** | superior a 15 salários mínimos | - Mais de 10 a 20 salários-mínimos<br>- Acima de 20 salários-mínimos |
| **Classe B (PF)** | 5 e 15 salários mínimos | - Mais de 5 a 10 salários-mínimos |
| **Classe C (PF)** | 3 e 5 salários mínimos | - Mais de 3 a 5 salários-mínimos |
| **Classe D (PF)** | 1 e 3 salários mínimos | - Mais de 1 a 2 salários-mínimos<br>- Mais de 2 a 3 salários-mínimos |
| **Classe E (PF)** | até 1 salário mínimo | - Até 1 salário-mínimo |
| **PJ** | | - Micro, pequeno, médio, grande, indisponível |

*\*IBGE – INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. Pesquisa Nacional por Amostra de Domicílios Contínua PNAD Contínua. Rio de Janeiro: IBGE, 2024.*

* **carteira inadimplência**
* Dados numéricos variados
* Range sugerido: 
  * 0,00 : sem inadimplência
  * Maior que 0,00 : 
    * 100 – 1.000
    * 1.000 – 10.000
    * 10.000 – 100.000
    * \> 100.000

* **carteira_vencida**
* <mark>**carteira_ativa**</mark>
* <mark>**vencido_acima_de_90_dias**</mark>

---

## 4. Mapeamento de Inconsistências Conhecidas
Ao analisar os arquivos `.csv` brutos do BCB, as seguintes inconsistências e padrões podem ser encontrados:
1. **Formatação de Valores Financeiros:** O CSV brasileiro utiliza vírgula (`,`) como separador decimal. 
2. **Valores Negativos:** Colunas K (numero_de_operacoes) trazem números de operações negativos em vez de um valor nulo.

---

## 5. Regras de Tratamento e Limpeza (ETL)
Antes de inserir os dados no banco, o script de processamento deve aplicar as seguintes regras matemáticas e de formatação:
* **Regra T01 - Padronização de Nulos:** Substituir as strings "Indisponível" (porte) e "Não Informados" (cnae_ocupação) por `NULL` no banco de dados, para facilitar consultas agrupadas.
* **Regra T02 - Tipagem Financeira:** Substituir a vírgula (`,`) decimal por ponto (`.`).
* **Regra T03 - Padronização de Strings:** Converter todas as colunas de texto MAIÚSCULAS, remover espaços em branco no início e no final das strings (`TRIM`) e remover a acentuação das palavras.
* **Regra T04 - Padronização da coluna porte:** Critério a ser discutido em grupo: Converter as informações de quantidade de salários mínimos (até 1, de 1 a 3 salários mínimos, etc) para classe social (A, B, C, D, E) com base nos critérios estabelecidos pelo IBGE? 

---

# Estatísticas do Pix 

## 1. Fonte dos Dados
https://dadosabertos.bcb.gov.br/dataset/pix
* **Formatos Disponíveis:** API e JSON
* **API-EndPoint:** https://dadosabertos.bcb.gov.br/dataset/pix/resource/ad02192b-67c7-47bf-b8c3-c90e2a54c5eb

## 2. Dicionário de Dados 
Os dados fornecidos estão divididos em quatro grupos, são eles: 1-Estoque de chaves Pix por Participante, 2-Transações Pix por Município, 3-Estatísticas de transações Pix e 4-Estatísticas de Fraude no Pix. 

Os parâmetros e resultados contidos em cada base de dados podem ser vistos na documentação disponível em: 
Link: https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/documentacao#ChavesPix

## 3. Variáveis para considerar 
Para o projeto em questão considera-se relevantes apenas os dados contidos na base de dados TransacoesPixPorMunicipio.

* **TransacoesPixPorMunicipio:** Nela é possível obter os dados de somatória das transações por município e por pessoas físicas (PF) e jurídicas (PJ), considerando a perspectiva do pagador e do recebedor.

Parâmetros relevantes são: 

| Nome | Tipo | Descrição |
| :--- | :--- | :--- |
| **AnoMes** | Int | Data-base no formato AAAAMM |
| **Municipio_Ibge** | Int | Código IBGE do município |
| **Municipio** | String | Nome do município |
| **Estado_Ibge** | Int | Código IBGE do estado |
| **Estado** | String | Nome do estado |
| **Sigla_Regiao** | String | Sigla_Regiao |
| **VL_PagadorPF** | Float | Volume financeiro em R$ das transações cujo Pagador é uma pessoa física (PF). |
| **QT_PagadorPF** | Float | Quantidade de transações cujo Pagador é uma pessoa física (PF). |
| **VL_RecebedorPF** | Float | Volume financeiro em R$ das transações cujo Recebedor é uma pessoa física (PF). |
| **QT_RecebedorPF** | Float | Quantidade de transações cujo Recebedor é uma pessoa física (PF). |
| **QT_PES_PagadorPF** | Float | Quantidade de pagadores pessoas físicas |
| **QT_PES_RecebedorPF** | Float | Quantidade de recebedores pessoas físicas |

**Endpoint dessa tabela específica:** `https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/TransacoesPixPorMunicipio(DataBase=@DataBase)?@DataBase='{AAAAMM}'&$top=10000&$filter=AnoMes%20eq%20{AAAAMM}&$orderby=AnoMes&$format=json&$select=AnoMes,Municipio_Ibge,Municipio,Estado_Ibge,Estado,Regiao,VL_PagadorPF,QT_PagadorPF,VL_RecebedorPF,QT_RecebedorPF,QT_PES_PagadorPF,QT_PES_RecebedorPF`
> **Obs:** trocar o que está indicado por `{AAAAMM}` pelo ano e mês que deseja buscar. Ex: `202501`

---

## 4. Mapeamento de Inconsistências Conhecidas
Ao analisar os arquivos `.csv` brutos do BCB, as seguintes inconsistências e padrões podem ser encontrados:
1. **Formatação de Valores Financeiros:** O CSV brasileiro utiliza vírgula (`,`) como separador decimal. 

---

## 5. Regras de Tratamento e Limpeza (ETL)
Antes de inserir os dados no banco, o script de processamento deve padronizar e equalizar a formatação dos dois bancos de dados (SCR.data e Estatisticas do Pix) para os seguintes parâmetros Data e UF. 

---

# IBGE – Dados abertos

## 1. Fonte dos Dados
https://dados.gov.br/dados/organizacoes/visualizar/instituto-brasileiro-de-geografia-e-estatistica-ibge
* **Formatos Disponíveis:** API, JSON e CSV

## 2. Dicionário de Dados 

* **Taxa de Escolarização**
  * Link: https://sidra.ibge.gov.br/tabela/7138
  * Endpoint: `https://apisidra.ibge.gov.br/values/t/7138/n3/all/v/10276/p/all/c2/6794/c58/95253,100052,108866?formato=json`

* **Crescimento populacional**
  * Link: https://sidra.ibge.gov.br/tabela/4709
  * Endpoint: `https://apisidra.ibge.gov.br/values/t/4709/n1/all/n2/all/v/all/p/all/d/v10605%202/l/p,v,t?formato=json`

* **População absoluta**
  * Link: https://sidra.ibge.gov.br/tabela/4709
  * Endpoint: `https://apisidra.ibge.gov.br/values/t/4709/n1/all/n2/all/n3/all/v/all/p/all/d/v10605%202/l/p,v,t`
  * *Obs: mesma tabela de crescimento populacional, apenas os objetos de interesse são diferentes.*

* **Bônus Demográfico**
  * Link: https://sidra.ibge.gov.br/tabela/9514/#resultado
  * *Obs: Endpoint não está funcionando. Como a tabela é pequena, uma alternativa é baixar como .csv.*

## 3. Variáveis para considerar 

* **Taxa de Escolarização**
Parâmetros relevantes são: 

| Objeto | Descrição |
| :--- | :--- |
| **NN** | "Unidade da Federação" |
| **V** | "Valor" |
| **D1N** | "Unidade da Federação" |
| **D3N** | "Ano" |
| **D5N** | "Grupo de idade" |

* **Crescimento Populacional**
Parâmetros relevantes são: 

| Objeto | Descrição |
| :--- | :--- |
| **D1N** | "Unidade da Federação" |
| **D2N** | "Taxa de crescimento geométrico" |
| **V** | "Valor" |

* **População Absoluta**
Parâmetros relevantes são: 

| Objeto | Descrição |
| :--- | :--- |
| **D1N** | "Unidade da Federação" |
| **D2N** | "População residente" |
| **V** | "Valor" |

* **Bônus Demográfico**
Como não temos o endpoint dessa tabela, as colunas relevantes são: 

| Coluna | Descrição |
| :--- | :--- |
| **Brasil, Grande Região e UF** | Localidade |
| **Total** | População total |
| **x a y anos** | População total da idade de x a y anos |

## 4. Mapeamento de Inconsistências Conhecidas
Ao analisar os arquivos `.csv` brutos do BCB, as seguintes inconsistências e padrões podem ser encontrados:
1. **Formatação de Valores Financeiros:** O CSV brasileiro utiliza vírgula (`,`) como separador decimal. 

---

## 5. Regras de Tratamento e Limpeza (ETL)
Antes de inserir os dados no banco, o script de processamento deve padronizar e equalizar a formatação dos três bancos de dados (SCR.data, Estatisticas do Pix e IBGE) para os seguintes parâmetros Data e UF. 

---

# SCORE 

Detalha a metodologia de cálculo para a identificação de mercados potenciais no Brasil. Essas são regiões com baixo risco de inadimplência, mas que ainda possuem baixa inclusão financeira e alto potencial de crescimento demográfico.

## 1. Eixo I – Risco de Crédito (RC)
* **Objetivo:** Medir a segurança da concessão. Escala progressiva (1.0 a 5.0). Escala geográfica: Estados<br>
  **Regra:** Quanto maior a nota, maior o risco/perigo da operação.

| Parâmetro (z) | Descrição técnica | Métrica* | Peso (W) |
| :--- | :--- | :--- | :--- |
| **Inadimplência Real** | Taxa de negativados (CPFs) ativos na UF. | X<sub>UF</sub> = Σ carteira_inadimplencia / Σ carteira_ativa | 35% |
| **Fragilidade de Renda** | Classe social | X<sub>UF</sub> = Σ carteira_ativa (PF até 3SM) / Σ carteira_ativa total (PF) | 35% |
| **Aging da Dívida** | Tempo médio de atraso das dívidas em aberto > 90 dias | X<sub>UF</sub> = Σ vencido_acima_de_90_dias / carteira_vencida | 20% |
| **Vulnerabilidade Social** | Escolaridade | X<sub>UF</sub> = 100 - Taxa da faixa etária "25 anos ou mais" | 10% |

*Deve ser aplicada a normalização (z) para todas as métricas, sendo o máx e min definido com base nas UFs

* Na base de dados os parâmetros z podem ser obtidos das seguintes fontes: 

| Parâmetro (z) | Variáveis a considerar | Database |
| :--- | :--- | :--- |
| **Inadimplência Real** | Carteira_inadimplencia, uf, <mark>carteira_ativa</mark> | SCR.data |
| **Fragilidade de Renda** | <mark>carteira_ativa</mark> | SCR.data |
| **Aging da Dívida** | Carteira_vencida, <mark>vencido_acima_de_90_dias</mark> | SCR.data |
| **Vulnerabilidade Social** | NN, V, D1N, D3N, D5N | IBGE |

## 2. Eixo II – Inclusão e Expansão Demográfica (IE)
* **Objetivo:** Medir saturação e potencial futuro. Escala progressiva (1.0 a 5.0). <br>
  **Regra:** Quanto maior a nota, mais saturado e populoso é o mercado.

| Parâmetro (z) | Descrição técnica | Métrica* | Peso (W) |
| :--- | :--- | :--- | :--- |
| **Maturidade Pix** | Volume e valores de transações per capita | X<sub>1</sub> = Σ QT_PagadorPF / Σ QT_PES_PagadorPF <br> X<sub>2</sub> = Σ VL_PagadorPF / Σ QT_PES_PagadorPF <br><br> Z<sub>UF</sub> = (z<sub>1</sub> * 0.6) + (z<sub>2</sub> * 0.4) | 35% |
| **Crescimento Populacional** | Taxa de variação anual da população na UF | X<sub>UF</sub> = Taxa de Crescimento Geométrico | 25% |
| **População Absoluta** | Total de habitantes (Mercado Endereçável) | X<sub>UF</sub> = População residente | 25% |
| **Bônus Demográfico** | Idade média: Regiões jovens indicam maior ciclo de vida | IdadeMedia<sub>UF</sub> = Σ (população de x a y anos) * ((x+y)/2) / Σ total <br><br> X<sub>UF</sub> = IdadeMedia<sub>máx</sub> - IdadeMedia<sub>UF</sub> | 15% |

*Deve ser aplicada a normalização (z) para todas as métricas, sendo o máx e min definido com base nas UFs

* Na base de dados os parâmetros z podem ser obtidos das seguintes fontes:

| Parâmetro (z) | Variáveis a considerar | Database |
| :--- | :--- | :--- |
| **Maturidade Pix** | AnoMes, Municipio_Ibge, Municipio, Estado_Ibge, Estado, Regiao, VL_PagadorPF, QT_PagadorPF, QT_PES_PagadorPF | Estatísticas Pix |
| **Crescimento populacional** | D1N, D2N "Taxa de crescimento geométrico", V | IBGE – Censo 2022 |
| **População Absoluta** | D1N, D2N "População residente", V | IBGE – Censo 2022 |
| **Bônus Demográfico** | Brasil, total, x a y anos | IBGE – Censo 2022 |

## 3. Motor de cálculo (normalização ponderada)
A precisão do modelo reside na Normalização Min-Max (z), que converte Reais, Idades e Porcentagens para a mesma base (1 a 5).

**A Fórmula de Normalização:**
$z = 1 + \left(\frac{x - \min(x)}{\max(x) - \min(x)}\right) \times 4$

**A Fórmula do Score Final:**
O Score de cada eixo é a soma dos parâmetros normalizados multiplicados pelos seus pesos: 
$\text{Score} = (z_1 \cdot W_1) + (z_2 \cdot W_2) + \dots + (z_n \cdot W_n)$

## 4. Matriz estratégica de tomada de decisão

| Risco (RC) | Inclusão (IE) | Diagnóstico | Estratégia recomendada |
| :--- | :--- | :--- | :--- |
| **Baixo (1-2)** | **Baixo (1-2)** | DIAMANTE BRUTO | Fomento Imediato. Público seguro com demanda |
| **Baixo (1-2)** | **Alto (4-5)** | MERCADO MADURO | Oceano Vermelho. Foco em fidelização e taxas baixas |
| **Alto (4-5)** | **Baixo (1-2)** | FOMENTO SOCIAL | Alto risco. Requer garantias governamentais |
| **Alto (4-5)** | **Alto (4-5)** | SATURAÇÃO | Risco de superendividamento. Recomenda-se cautela. |
