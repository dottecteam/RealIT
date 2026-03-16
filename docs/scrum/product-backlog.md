# Backlog do Produto — Real IT

| ID | User Story | Prioridade | Épico | Sprint |
|:---|:---|:---:|:---:|:---:|
| #1 | Como cliente, desejo que o sistema colete dados reais do Banco Central e de outras fontes públicas para que minhas decisões sejam baseadas em informações oficiais. | Alta | E1 | 1 |
| #2 | Como gestor, desejo que os indicadores sejam processados e limpos automaticamente para que eu não perca tempo com dados inconsistentes. | Alta | E2 | 1 |
| #3 | Como usuário da plataforma, desejo que os dados estejam disponíveis para serem consumidos por outros sistemas e ferramentas que minha empresa já utiliza, para que não precise inserir informações manualmente em diferentes lugares. | Alta | E3 | 1 |
| #4 | Como cliente, desejo que o acesso à plataforma seja restrito por login para garantir a segurança das minhas análises estratégicas. | Alta | E5 | 2 |
| #5 | Como analista de negócios, desejo visualizar um **Índice de Oportunidade (Score)** para identificar rapidamente os melhores mercados para expansão. | Alta | E6 | 2 |
| #6 | Como visitante, desejo acessar um **site institucional com landing page, página sobre o produto e página de metodologia**, para entender o propósito da plataforma, como ela funciona e quais dados são utilizados no cálculo do score. | Média | E4 | 2 |
| #7 | Como tomador de decisão, desejo visualizar um **mapa de calor interativo** para compreender a distribuição geográfica do potencial de mercado. | Média | E6 | 2 |
| #8 | Como gestor de expansão, desejo acessar uma **tabela de ranking regional** para priorizar investimentos nos estados de melhor desempenho. | Média | E6 | 2 |
| #9 | Como usuário do dashboard, desejo aplicar **filtros nos indicadores** para analisar diferentes cenários e regiões. | Alta | E7 | 3 |
| #10 | Como usuário do dashboard, desejo alternar entre **macro e microrregiões através de um filtro (checkbox)** para analisar o mercado em diferentes níveis de granularidade. | Alta | E7 | 3 |
| #11 | Como analista, desejo **exportar os dados do dashboard** para formatos como PDF, CSV, XLSX e XML para utilizar as análises em relatórios e apresentações. | Média | E8 | 3 |
| #12 | Como analista de mercado, desejo comparar detalhadamente duas regiões específicas para entender as vantagens competitivas de cada uma. | Baixa | E9 | 3 |
| #13 | Como líder de equipe, desejo ter acesso a manuais claros de uso para que meu time opere o sistema com autonomia. | Baixa | E10 | 3 |

---

## Épicos

| ID | Épico |
|:---|:---|
| **E1** | Integração com APIs de Dados Públicos |
| **E2** | Pipeline de Processamento de Dados |
| **E3** | API Backend (Node + Prisma) |
| **E4** | Website Institucional (Landing, Sobre e Metodologia) |
| **E5** | Autenticação e Controle de Acesso |
| **E6** | Dashboard — Visualização e Ranking |
| **E7** | Sistema de Filtros e Navegação Regional |
| **E8** | Exportação de Dados |
| **E9** | Comparação de Regiões |
| **E10** | Qualidade, Documentação e Entrega |

---

## MVP

| Sprint | Épicos Alocados | Foco do MVP |
| :--- | :--- | :--- |
| **Sprint 1**<br>*(16/03 a 05/04)* | **E1:** Integração com APIs de Dados Públicos<br>**E2:** Pipeline de Processamento de Dados<br>**E3:** API Backend (Node + Prisma) | **Fundação de Dados:** Nesta sprint o foco é estruturar a base técnica do sistema. A equipe identifica os indicadores necessários e realiza a integração com APIs de dados públicos. Os dados coletados passam por um pipeline de processamento e limpeza, sendo armazenados no banco de dados. O backend expõe endpoints que serão utilizados posteriormente pelo dashboard. |
| **Sprint 2**<br>*(06/04 a 03/05)* | **E4:** Website Institucional<br>**E5:** Autenticação e Controle de Acesso<br>**E6:** Dashboard — Visualização e Ranking | **Interface e Visualização:** Nesta sprint é desenvolvido o frontend da aplicação. O site institucional é criado com landing page, página sobre o produto e página de metodologia. O dashboard passa a consumir a API criada na sprint anterior e apresenta as primeiras visualizações: índice de oportunidade, mapa de calor e ranking regional. Também é implementado o sistema de autenticação para acesso à plataforma. |
| **Sprint 3**<br>*(04/05 a 31/05)* | **E7:** Sistema de Filtros e Navegação Regional<br>**E8:** Exportação de Dados<br>**E9:** Comparação de Regiões<br>**E10:** Qualidade, Documentação e Entrega | **Refinamento e Entrega:** Nesta sprint são adicionadas funcionalidades avançadas ao dashboard, incluindo filtros para análise de indicadores, navegação entre macro e microrregiões e exportação dos dados em múltiplos formatos (PDF, CSV, XLSX, XML). Também é implementada a comparação entre regiões e finalizada a documentação do sistema, garantindo qualidade e preparação para entrega. |
