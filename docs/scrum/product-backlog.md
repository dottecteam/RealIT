# Backlog do Produto — Real IT

| ID | User Story | Prioridade | Épico | Sprint |
|:---|:---|:---:|:---:|:---:|
| 1 | Como cliente, desejo que o sistema colete dados reais do Banco Central para que minhas decisões sejam baseadas em informações oficiais. | Alta | E1 | 1 |
| 2 | Como cliente, desejo que os indicadores sejam processados e limpos automaticamente para que eu não perca tempo com dados inconsistentes. | Alta | E2 | 1 |
| 3 | Como desenvolvedor, desejo uma API REST com endpoints documentados para que o frontend consuma os dados corretamente. | Alta | E3 | 1 |
| 4 | Como cliente, desejo que o acesso à plataforma seja restrito por login para garantir a segurança das minhas análises estratégicas. | Alta | E4 | 2 |
| 5 | Como cliente, desejo visualizar um "Índice de Oportunidade" (Score) para identificar rapidamente os melhores mercados para expansão. | Média | E3 | 2 |
| 6 | Como cliente, desejo visualizar um mapa de calor interativo para compreender a distribuição geográfica do potencial de mercado. | Média | E5 | 2 |
| 7 | Como cliente, desejo acessar uma tabela de ranking regional para priorizar investimentos nos estados de melhor desempenho. | Média | E5 | 2 |
| 8 | Como cliente, desejo comparar detalhadamente dois estados específicos para entender as vantagens competitivas de cada um. | Baixa | E6 | 3 |
| 9 | Como cliente, desejo ter acesso a manuais claros de uso e instalação para que minha equipe opere o sistema com autonomia. | Baixa | E7 | 3 |

---

## Épicos

| ID | Épico |
|:---|:---|
| **E1** | Integração com API do Banco Central |
| **E2** | Pipeline de Processamento de Dados |
| **E3** | API Backend (Node + Prisma) |
| **E4** | Autenticação e Controle de Acesso |
| **E5** | Dashboard — Visão Geral e Mapa |
| **E6** | Dashboard — Detalhamento e Comparação |
| **E7** | Qualidade, Documentação e Entrega |

---

## MVP

| Sprint | Épicos Alocados | Foco do MVP |
| :--- | :--- | :--- |
| **Sprint 1**<br>*(16/03 a 05/04)* | **E1:** Integração com API do Banco Central<br>**E2:** Pipeline de Processamento de Dados<br>**E3:** API Backend (Node + Prisma) | **Motor de Dados:** O script de extração puxa e limpa os indicadores em nível **Estadual** (*NÃO DEFINIDO AINDA*). O backend recebe esses dados, salva no banco e expõe o endpoint do "Índice de Oportunidade DM" (*INSPIRADO NO SERASA SCORE*). |
| **Sprint 2**<br>*(06/04 a 03/05)* | **E4:** Autenticação e Controle de Acesso<br>**E5:** Dashboard — Visão Geral e Mapa | **Visualização e Acesso:** O frontend consome a API e renderiza o mapa de calor e a tabela de ranking. A autenticação via login básico (*NÃO DEFINIDO AINDA*) é implementada junto, pois o acesso à plataforma passa a ser relevante quando há interface visível. |
| **Sprint 3**<br>*(04/05 a 31/05)* | **E6:** Dashboard — Detalhamento e Comparação<br>**E7:** Qualidade, Documentação e Entrega | **Refinamento e Entrega:** Tela de comparação entre dois estados. Finalização do Manual do Usuário, Manual de Instalação no Git e revisão final do código. |
