# Documento de Tratamento de Dados - SCR.data

## 1. Fonte dos Dados
* **Sistema:** Sistema de Informações de Crédito (SCR.data) - Versão 2
* **Link para download:** Os arquivos .ZIP com os dados mensais da Versão 2 do SCR.Data podem ser baixados a partir da seguinte URL, substituindo a expressão {ANO} pelo ano correspondente: https://www.bcb.gov.br/pda/desig/scrdata_{ANO}.zip
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
1. **data_base**
2. **uf**
3. **cliente**
4. **cnae_ocupacao**
5. **porte**

| Classe social | Definição (IBGE*) | Dado Disponível no SCR |
| :--- | :--- | :--- |
| **Classe A (PF)** | superior a 15 salários mínimos | - Mais de 10 a 20 salários-mínimos<br>- Acima de 20 salários-mínimos |
| **Classe B (PF)** | 5 e 15 salários mínimos | Mais de 5 a 10 salários-mínimos |
| **Classe C (PF)** | 3 e 5 salários mínimos | - Mais de 3 a 5 salários-mínimos |
| **Classe D (PF)** | 1 e 3 salários mínimos | - Mais de 1 a 2 salários-mínimos<br>- Mais de 2 a 3 salários-mínimos |
| **Classe E (PF)** | até 1 salário mínimo | Até 1 salário-mínimo |
| **PJ** | | Micro, pequeno, médio, grande, indisponível |

*\*IBGE – INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. Pesquisa Nacional por Amostra de Domicílios Contínua PNAD Contínua. Rio de Janeiro: IBGE, 2024.*

7. **carteira inadimplência**
* Dados numéricos variados
* Range sugerido: 
  * 0,00 : sem inadimplência
  * Maior que 0,00 : 
    * 100 – 1.000
    * 1.000 – 10.000
    * 10.000 – 100.000
    * \> 100.000

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

---

## 4. Mapeamento de Inconsistências Conhecidas
Ao analisar os arquivos `.csv` brutos do BCB, as seguintes inconsistências e padrões podem ser encontrados:
1. **Formatação de Valores Financeiros:** O CSV brasileiro utiliza vírgula (`,`) como separador decimal. 

---

## 5. Regras de Tratamento e Limpeza (ETL)
Antes de inserir os dados no banco, o script de processamento deve padronizar e equalizar a formatação dos dois bancos de dados (SCR.data e Estatisticas do Pix) para os seguintes parâmetros Data e UF.
