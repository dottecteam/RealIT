# Backlog do Produto — Real IT

| ID | User Story | Prioridade | Épico | Sprint |
|:---|:---|:---:|:---:|:---:|
| #1 | Como analista de dados, desejo ter definida uma metodologia de cálculo do **Índice de Oportunidade (Score)** para saber exatamente quais indicadores serão abordados na análise. | Alta | E1 | 1 |
| #2 | Como cliente, desejo que o sistema colete dados reais do Banco Central e de outras fontes públicas para que minhas decisões sejam baseadas em informações oficiais. | Alta | E2 | 1 |
| #3 | Como gestor, desejo que os indicadores sejam processados e limpos automaticamente para que eu não perca tempo com dados inconsistentes. | Alta | E3 | 1 |
| #4 | Como usuário da plataforma, desejo que os dados estejam disponíveis para serem consumidos por outros sistemas e ferramentas que minha empresa já utiliza, para que não precise inserir informações manualmente em diferentes lugares. | Alta | E4 | 1 |
| #5 | Como cliente, desejo que o acesso à plataforma seja restrito por login para garantir a segurança das minhas análises estratégicas. | Alta | E6 | 2 |
| #6 | Como analista de negócios, desejo visualizar um **Índice de Oportunidade (Score)** para identificar rapidamente os melhores mercados para expansão. | Alta | E7 | 2 |
| #7 | Como visitante, desejo acessar um **site institucional com landing page, página sobre o produto e página de metodologia**, para entender o propósito da plataforma, como ela funciona e quais dados são utilizados no cálculo do score. | Média | E5 | 2 |
| #8 | Como tomador de decisão, desejo visualizar um **mapa de calor interativo** para compreender a distribuição geográfica do potencial de mercado. | Média | E7 | 2 |
| #9 | Como gestor de expansão, desejo acessar uma **tabela de ranking regional** para priorizar investimentos nos estados de melhor desempenho. | Média | E7 | 2 |
| #10 | Como usuário do dashboard, desejo aplicar **filtros nos indicadores** para analisar diferentes cenários e regiões. | Alta | E8 | 3 |
| #11 | Como usuário do dashboard, desejo alternar entre **macro e microrregiões através de um filtro (checkbox)** para analisar o mercado em diferentes níveis de granularidade. | Alta | E8 | 3 |
| #12 | Como analista, desejo **exportar os dados do dashboard** para formatos como PDF, CSV, XLSX e XML para utilizar as análises em relatórios e apresentações. | Média | E9 | 3 |
| #13 | Como analista de mercado, desejo comparar detalhadamente duas regiões específicas para entender as vantagens competitivas de cada uma. | Baixa | E10 | 3 |
| #14 | Como líder de equipe, desejo ter acesso a manuais claros de uso para que meu time opere o sistema com autonomia. | Baixa | E11 | 3 |

---

# Épicos

| ID | Épico |
|:---|:---|
| **E1** | Definição da Metodologia do Score |
| **E2** | Integração com APIs de Dados Públicos |
| **E3** | Pipeline de Processamento de Dados |
| **E4** | API Backend (Node + Prisma) |
| **E5** | Website Institucional (Landing, Sobre e Metodologia) |
| **E6** | Autenticação e Controle de Acesso |
| **E7** | Dashboard — Visualização e Ranking |
| **E8** | Sistema de Filtros e Navegação Regional |
| **E9** | Exportação de Dados |
| **E10** | Comparação de Regiões |
| **E11** | Qualidade, Documentação e Entrega |

---

# MVP

| Sprint | Épicos Alocados | Foco do MVP |
| :--- | :--- | :--- |
| **Sprint 1**<br>*(16/03 a 05/04)* | **E1:** Definição da Metodologia do Score<br>**E2:** Integração com APIs de Dados Públicos<br>**E3:** Pipeline de Processamento de Dados<br>**E4:** API Backend (Node + Prisma) | **Fundação de Dados:** Nesta sprint o foco é estruturar a base técnica do sistema. A equipe define a metodologia de cálculo do Índice de Oportunidade (Score), identifica os indicadores necessários e realiza a integração com APIs de dados públicos. Os dados coletados passam por um pipeline de processamento e limpeza, sendo armazenados no banco de dados. O backend expõe endpoints que serão utilizados posteriormente pelo dashboard. |
| **Sprint 2**<br>*(06/04 a 03/05)* | **E5:** Website Institucional<br>**E6:** Autenticação e Controle de Acesso<br>**E7:** Dashboard — Visualização e Ranking | **Interface e Visualização:** Nesta sprint é desenvolvido o frontend da aplicação. O site institucional é criado com landing page, página sobre o produto e página de metodologia. O dashboard passa a consumir a API criada na sprint anterior e apresenta as primeiras visualizações: índice de oportunidade, mapa de calor e ranking regional. Também é implementado o sistema de autenticação para acesso à plataforma. |
| **Sprint 3**<br>*(04/05 a 31/05)* | **E8:** Sistema de Filtros e Navegação Regional<br>**E9:** Exportação de Dados<br>**E10:** Comparação de Regiões<br>**E11:** Qualidade, Documentação e Entrega | **Refinamento e Entrega:** Nesta sprint são adicionadas funcionalidades avançadas ao dashboard, incluindo filtros para análise de indicadores, navegação entre macro e microrregiões e exportação dos dados em múltiplos formatos (PDF, CSV, XLSX, XML). Também é implementada a comparação entre regiões e finalizada a documentação do sistema, garantindo qualidade e preparação para entrega. |

---
