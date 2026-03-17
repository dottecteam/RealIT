# Backlog da Sprint 2

| ID | User Story | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #4 | Como cliente, desejo que o acesso à plataforma seja restrito por login para garantir a segurança das minhas análises estratégicas. | - Fluxo de autenticação definido pela equipe;</br> - Dependência da API (Sprint 1) disponível;</br> - Layout da tela de login aprovado. | - Login funcional com autenticação via JWT;</br> - Rotas protegidas funcionando corretamente;</br> - Usuários não autenticados bloqueados. | 8 |
| #5 | Como analista de negócios, desejo visualizar um **Índice de Oportunidade (Score)** para identificar rapidamente os melhores mercados para expansão. | - Metodologia do Score definida na Sprint 1;</br> - Dados necessários disponíveis na API;</br> - Layout da visualização aprovado. | - Score exibido corretamente no dashboard;</br> - Dados consumidos da API;</br> - Visualização clara para o analista. | 5 |
| #6 | Como visitante, desejo acessar um **site institucional com landing page, página sobre o produto e página de metodologia**, para entender o propósito da plataforma e como os dados são analisados. | - Estrutura das páginas definida;</br> - Conteúdo institucional aprovado pela equipe;</br> - Design inicial validado. | - Landing page implementada;</br> - Página sobre o produto criada;</br> - Página de metodologia documentando o Score e fontes de dados. | 5 |
| #7 | Como tomador de decisão, desejo visualizar um **mapa de calor interativo** para compreender a distribuição geográfica do potencial de mercado. | - Dados geográficos definidos;</br> - Biblioteca de mapa escolhida;</br> - Endpoint da API disponível. | - Mapa exibindo dados geográficos corretamente;</br> - Cores representando o Score por região;</br> - Interação com hover e zoom funcionando. | 8 |
| #8 | Como gestor de expansão, desejo acessar uma **tabela de ranking regional** para priorizar investimentos nos estados de melhor desempenho. | - Critérios de ranking definidos;</br> - Dados disponíveis na API;</br> - Layout da tabela aprovado. | - Tabela exibindo ranking ordenado por Score;</br> - Dados carregados da API;</br> - Informações corretas e compreensíveis. | 5 |

---

# Tasks

| ID | Descrição | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #4-1 | Modelar entidades de usuário no Prisma. | - Stack de autenticação definida (JWT). | - Entidade `User` criada;</br> - Migration executada. | 2 |
| #4-2 | Implementar rotas de autenticação (login). | - Entidade de usuário criada. | - Rota `/login` funcionando;</br> - Token JWT gerado. | 3 |
| #4-3 | Implementar middleware de autenticação nas rotas privadas. | - JWT implementado. | - Rotas protegidas validando token. | 2 |
| #4-4 | Implementar tela de login no frontend. | - Layout aprovado. | - Login funcionando com API. | 3 |
| #5-1 | Implementar serviço na API para retornar o Score calculado. | - Metodologia do Score definida. | - Endpoint `/score` retornando valores corretamente. | 2 |
| #5-2 | Implementar componente de visualização do Score no frontend. | - Endpoint disponível. | - Score exibido corretamente na interface. | 3 |
| #6-1 | Criar estrutura do site institucional (landing, sobre, metodologia). | - Estrutura definida pela equipe. | - Páginas criadas no projeto frontend. | 2 |
| #6-2 | Implementar layout da landing page. | - Estrutura criada. | - Landing page responsiva funcionando. | 2 |
| #6-3 | Implementar página de metodologia. | - Conteúdo definido pela equipe. | - Página exibindo metodologia e fontes de dados. | 2 |
| #7-1 | Definir biblioteca de mapas (Mapbox, Leaflet ou similar). | - Requisitos de mapa definidos. | - Biblioteca escolhida e documentada. | 1 |
| #7-2 | Criar endpoint para fornecer dados geográficos e Score. | - Score disponível na API. | - Endpoint retornando dados geográficos. | 2 |
| #7-3 | Implementar mapa de calor no frontend. | - Biblioteca definida;</br> - Endpoint disponível. | - Mapa exibindo regiões com cores proporcionais ao Score. | 5 |
| #8-1 | Criar endpoint para ranking regional. | - Score disponível no banco. | - Endpoint `/ranking` retornando estados ordenados. | 2 |
| #8-2 | Implementar tabela de ranking no frontend. | - Endpoint disponível. | - Ranking exibido corretamente na interface. | 3 |
