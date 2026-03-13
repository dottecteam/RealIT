# Backlog da Sprint 1

| ID | User Story | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #1 | Como analista de dados, desejo ter definida uma metodologia de cálculo do **Índice de Oportunidade (Score)** para saber exatamente quais indicadores serão abordados na análise. | - Objetivo do Score definido pela equipe;</br> - Possíveis indicadores identificados (ex: crédito, inadimplência, atividade econômica);</br> - Critérios de cálculo discutidos com a equipe. | - Documento `.md` criado em `/docs` descrevendo metodologia do Score;</br> - Indicadores que compõem o Score definidos;</br> - Fórmula inicial ou lógica de cálculo documentada e revisada pela equipe. | 5 |
| #2 | Como cliente, desejo que o sistema colete dados reais do Banco Central para que minhas decisões sejam baseadas em informações oficiais. | - Endpoints do Banco Central a serem consumidos estão identificados;</br> - Indicadores necessários definidos com base na metodologia do Score;</br> - Frequência de coleta definida. | - Dados reais sendo coletados da API do Banco Central;</br> - Script Python executando requisições com sucesso;</br> - Dados retornados correspondem aos indicadores definidos. | 8 |
| #3 | Como gestor, desejo que os indicadores sejam processados e limpos automaticamente para que eu não perca tempo com dados inconsistentes. | - Tipos de inconsistências mapeados;</br> - Regras de limpeza definidas pela equipe;</br> - Script de coleta funcionando. | - Dados processados e padronizados automaticamente;</br> - Inconsistências tratadas sem intervenção manual;</br> - Resultado validado pela equipe. | 5 |
| #4 | Como usuário da plataforma, desejo que os dados estejam disponíveis via API para que possam ser consumidos por outros sistemas e ferramentas. | - Estrutura de dados definida;</br> - Schema do banco modelado;</br> - Contrato da API definido. | - Endpoint da API retornando os dados corretamente em JSON;</br> - Dados persistidos via Prisma no banco;</br> - Teste de requisição realizado com sucesso (Postman ou Insomnia). | 8 |

---

## Tasks

| ID | Descrição | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #1-1 | Pesquisar indicadores econômicos relevantes para compor o Score. | - Objetivo do Score definido pela equipe. | - Lista de indicadores criada e documentada em `/docs/score.md`. | 2 |
| #1-2 | Definir metodologia de cálculo do Score. | - Indicadores identificados. | - Fórmula ou lógica de cálculo documentada e revisada pela equipe. | 3 |
| #2-1 | Pesquisar e mapear os endpoints disponíveis na API do Banco Central relevantes para o projeto. | - Indicadores do Score definidos. | - Documento `.md` criado listando endpoints e parâmetros. | 2 |
| #2-2 | Implementar script Python para consumir os endpoints da API do Banco Central. | - Ao menos um endpoint identificado. | - Script realizando requisições e retornando dados corretamente. | 3 |
| #2-3 | Configurar envio automático dos dados coletados para a API Node.js. | - Script retornando dados corretamente. | - Dados sendo enviados automaticamente para a API Node.js. | 2 |
| #2-4 | Validar os dados recebidos na API Node.js. | - Envio automático configurado. | - Testes executados e dados validados. | 1 |
| #3-1 | Mapear inconsistências presentes nos dados retornados pela API. | - Exemplos de retorno disponíveis. | - Documento `.md` criado com inconsistências e regras de tratamento. | 1 |
| #3-2 | Implementar rotina de limpeza e padronização dos dados. | - Inconsistências mapeadas. | - Script aplicando regras de limpeza corretamente. | 2 |
| #3-3 | Implementar sinalização de dados inconsistentes antes do envio à API. | - Regras de tratamento definidas. | - Dados problemáticos identificados e registrados em log. | 1 |
| #3-4 | Validar indicadores processados no banco de dados. | - Schema Prisma criado. | - Dados persistidos e retornando corretamente. | 1 |
| #4-1 | Configurar projeto Node.js com TypeScript e Express. | - Stack definida e repositório criado. | - Projeto inicial configurado com estrutura de pastas e dependências. | 2 |
| #4-2 | Modelar banco de dados utilizando Prisma. | - Estrutura de indicadores definida. | - Schema criado e migration executada. | 3 |
| #4-3 | Implementar rotas da API REST para recebimento dos dados. | - Projeto configurado. | - Rotas recebendo e persistindo dados corretamente. | 3 |
| #4-4 | Documentar endpoints da API. | - Contrato das rotas definido. | - Documento `.md` criado com exemplos de requisição e resposta. | 2 |
| #4-5 | Testar integração completa entre script Python e API Node.js. | - Script enviando dados e API funcionando. | - Fluxo completo validado e documentado. | 3 |
