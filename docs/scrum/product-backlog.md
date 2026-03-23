# Backlog do Produto — Real IT

| ID | User Story | Prioridade | Épico | Sprint |
|:---|:---|:---:|:---:|:---:|
| #1 | Como cliente, desejo que o sistema **colete dados reais** do Banco Central e de outras fontes públicas para que minhas decisões sejam baseadas em informações oficiais. | Alta | E1 | 1 |
| #2 | Como gestor, desejo que os **indicadores sejam processados e limpos** automaticamente de forma mensal para que eu não perca tempo com dados inconsistentes. | Alta | E2 | 1 |
| #3 | Como usuário da plataforma, desejo que os **dados estejam disponíveis para serem consumidos** por sistemas sem que haja um novo processamento de dados, para que as operações de análise tenha uma melhor performance. | Alta | E3 | 1 |
| #4 | Como analista de negócios, desejo visualizar um **Índice de Oportunidade (Score)** para identificar rapidamente os melhores mercados para expansão. | Alta | E4 | 1 |
| #5 | Como tomador de decisão, desejo visualizar um **mapa interativo** para compreender a distribuição geográfica do potencial de mercado. | Alta | E4 | 2 |
| #6 | Como gestor de expansão, desejo acessar uma **tabela de ranking regional** para priorizar investimentos nos estados de melhor desempenho. | Alta | E4 | 2 |
| #7 | Como usuário do dashboard, desejo aplicar **filtros nos indicadores** para analisar diferentes cenários e regiões. | Média | E5 | 2 |
| #8 | Como usuário do dashboard, desejo alternar entre **macro e micro através de um filtro** para analisar o mercado em diferentes níveis de granularidade. | Média | E5 | 2 |
| #9 | Como cliente, desejo que o acesso à plataforma seja restrito por login para garantir a segurança das minhas análises estratégicas. | Média | E6 | 3 |
| #10 | Como analista de mercado, desejo **comparar detalhadamente duas regiões específicas** para entender as vantagens competitivas de cada uma. | Média | E7 | 3 |
| #11 | Como analista, desejo **exportar os dados do dashboard** para formatos como PDF, CSV, XLSX e XML para utilizar as análises em relatórios e apresentações. | Baixa | E8 | 3 |
| #12 | Como visitante, desejo acessar um **site institucional** com landing page, página sobre o produto e página de metodologia, para entender o propósito da plataforma, como ela funciona e quais dados são utilizados no cálculo do score. | Baixa | E9 | 3 |
| #13 | Como líder de equipe, desejo ter acesso a **manuais claros de uso** para que meu time opere o sistema com autonomia. | Baixa | E10 | 3 |

---

## Épicos

| ID | Épico |
|:---|:---|
| **E1** | Integração com APIs de Dados Públicos |
| **E2** | Pipeline de Processamento de Dados |
| **E3** | API Backend |
| **E4** | Dashboard |
| **E5** | Sistema de Filtros e Navegação Regional |
| **E6** | Autenticação e Controle de Acesso |
| **E7** | Comparação de Regiões |
| **E8** | Exportação de Dados |
| **E9** | Website Institucional (Landing, Sobre e Metodologia) |
| **E10** | Qualidade, Documentação e Entrega |

---

## MVP

| Sprint | Épicos Alocados | Foco do MVP |
| :--- | :--- | :--- |
| **Sprint 1**<br>*(16/03 a 05/04)* | **E1:** Integração com APIs de Dados Públicos<br>**E2:** Pipeline de Processamento de Dados<br>**E3:** API Backend<br>**E4:** Dashboard *(parcial)* | **Fundação de Dados + Visualização Mínima:** Nesta sprint o foco é estruturar toda a base técnica do sistema. A equipe integra as APIs de dados públicos do Banco Central e outras fontes oficiais, implementa o pipeline de processamento mensal dos indicadores e armazena os dados tratados no banco. O backend expõe os endpoints necessários para consumo sem reprocessamento, garantindo performance nas análises. Como entrega visual tangível, o dashboard já apresenta a primeira versão do Índice de Oportunidade (Score). |
| **Sprint 2**<br>*(06/04 a 03/05)* | **E4:** Dashboard *(continuação)*<br>**E5:** Sistema de Filtros e Navegação Regional | **Dashboard Completo:** Nesta sprint o dashboard recebe todas as suas funcionalidades principais. São entregues o mapa interativo com distribuição geográfica do potencial de mercado, o ranking regional para priorização de investimentos, os filtros de indicadores para análise de cenários e a navegação entre macro e microrregiões. Ao final da sprint, o produto central já está funcional e utilizável. |
| **Sprint 3**<br>*(04/05 a 31/05)* | **E6:** Autenticação e Controle de Acesso<br>**E7:** Comparação de Regiões<br>**E8:** Exportação de Dados<br>**E9:** Website Institucional<br>**E10:** Qualidade, Documentação e Entrega | **Refinamento e Entrega:** Nesta sprint o sistema recebe as camadas de segurança e complemento. É implementado o login para controle de acesso à plataforma, a funcionalidade de comparação detalhada entre regiões e a exportação de dados em múltiplos formatos (PDF, CSV, XLSX, XML). O site institucional é desenvolvido para apresentação pública do produto. A sprint é encerrada com documentação de uso e validação final para entrega ao cliente. |