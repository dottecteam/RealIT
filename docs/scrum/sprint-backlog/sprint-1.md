# Backlog da Sprint 1

| ID | User Story | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #1 | Como cliente, desejo que o sistema colete dados reais do Banco Central para que minhas decisões sejam baseadas em informações oficiais. | - Indicadores do Score identificados;</br> - Endpoints do Banco Central mapeados;</br> - Frequência de coleta mensal definida. | - Dados coletados da API do Banco Central com sucesso;</br> - Indicadores definidos e documentados em `/docs`;</br> - Script Python executando e acessando os dados corretamente. | 5 |
| #2 | Como gestor, desejo que os indicadores sejam processados e limpos automaticamente de forma mensal para que eu não perca tempo com dados inconsistentes. | - Tipos de inconsistências mapeados;</br> - Regras de metodologia definidas pela equipe;</br> - Script de coleta funcionando. | - Dados processados e padronizados automaticamente de forma mensal;</br> - Inconsistências tratadas sem intervenção manual;</br> - Resultado validado pela equipe. | 8 |
| #3 | Como usuário da plataforma, desejo que os dados estejam disponíveis via API sem novo processamento para que as operações de análise tenham melhor performance. | - Estrutura de dados definida;</br> - Schema do banco modelado;</br> - Contrato da API definido. | - Endpoint da API retornando os dados corretamente em JSON;</br> - Dados persistidos via Prisma no banco;</br> - Teste de requisição realizado com sucesso (Postman ou Insomnia). | 8 |
| #4 | Como analista de negócios, desejo visualizar um **Índice de Oportunidade (Score)** para identificar rapidamente os melhores mercados para expansão. | - Pipeline de dados funcional;</br> - Metodologia de cálculo do Score definida e documentada;</br> - Dados segmentados por região disponíveis. | - Score calculado e gerado para todas as regiões;</br> - Resultado exibido em uma visualização simples no dashboard;</br> - Ranking inicial de regiões visível na interface. | 13 |

---

## Tasks

| ID | Descrição | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #1-1 | Pesquisar indicadores econômicos relevantes para compor o Score. | - Objetivo do Score definido pela equipe. | - Lista de indicadores criada e documentada em `/docs/score.md`. | 3 |
| #1-2 | Definir metodologia de cálculo do Score. | - Indicadores identificados. | - Fórmula ou lógica de cálculo documentada e revisada pela equipe. | 2 |
| #1-3 | Pesquisar e mapear os endpoints ou dados disponíveis do Banco Central relevantes para o projeto. | - Indicadores do Score definidos. | - Documento `.md` criado listando endpoints, parâmetros, etc. | 2 |
| #1-4 | Implementar script Python básico apenas para consumir os dados do Banco Central pelo Google Colab. | - Ao menos um endpoint ou base de dados identificado. | - Script realizando requisições, com o ambiente do Google Colab configurado corretamente. | 5 |
| #2-1 | Desenvolver rotina de tratamento de dados. | - Script de coleta de dados funcional. | - Código que padroniza tipos, trata valores nulos e corrige inconsistências. | 5 |
| #2-2 | Implementar lógica de filtragem por agrupamento regional. | - Dados higienizados e metodologia definida. | - Script capaz de segmentar os indicadores por regiões geográficas. | 3 |
| #2-3 | Implementar o motor de cálculo do Score em Python. | - Método de cálculo do Score planejado. | - Função que aplica a lógica sobre os dados e gera o ranking final. | 5 |
| #2-4 | Integrar as etapas em um pipeline de execução único. | - Módulos de extração e cálculo validados. | - Fluxo completo (Extração → Limpeza → Cálculo) automatizado. | 3 |
| #2-5 | Desenvolver módulo de integração com a API Node.js. | - API pronta para receber dados. | - Script Python transmitindo os resultados finais em JSON via requests. | 2 |
| #3-1 | Configurar ambiente Node.js com TypeScript e Express. | - Definição da stack tecnológica. | - Estrutura base do projeto configurada e pronta para desenvolvimento. | 2 |
| #3-2 | Realizar a modelagem do banco de dados com Prisma ORM. | - Estrutura de dados definida. | - Schema do banco criado e migrations aplicadas com sucesso. | 3 |
| #3-3 | Desenvolver rotas de consumo para persistência de dados. | - Modelagem do banco concluída. | - Endpoints operacionais, recebendo e salvando dados no banco. | 3 |
| #3-4 | Implementar camada de validação de dados (Schema Validation). | - Contrato de dados definido. | - Middleware garantindo a integridade dos dados recebidos pela API. | 2 |
| #3-5 | Realizar testes de integração de ponta a ponta. | - Python e API integrados. | - Fluxo completo validado, da coleta no BACEN ao armazenamento no banco. | 2 |
| #3-6 | Elaborar documentação técnica dos endpoints da API. | - Rotas e validações finalizadas. | - Documento `.md` criado com exemplos de requisição e resposta. | 1 |
| #4-1 | Configurar projeto frontend com React, TypeScript e Next.js. | - Stack tecnológica definida pela equipe. | - Projeto inicializado, dependências instaladas e estrutura de pastas organizada e pronta para desenvolvimento. | 2 |
| #4-2 | Desenvolver tela inicial do dashboard com exibição do Score por região. | - Projeto frontend configurado;</br> - Score calculado e disponível via API. | - Página renderizando o índice de oportunidade de cada região de forma legível. | 5 |