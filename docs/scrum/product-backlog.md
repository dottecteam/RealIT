# Backlog do Produto — Real IT

---

## Épicos

| ID | Épico |
|----|-------|
| **E0** | Preparação e Protótipo |
| **E1** | Integração com API do Banco Central |
| **E2** | Pipeline de Processamento de Dados |
| **E3** | API Backend (Node + Prisma) |
| **E4** | Dashboard — Visão Geral e Mapa |
| **E5** | Dashboard — Detalhamento e Comparação |
| **E6** | Autenticação e Controle de Acesso |
| **E7** | Qualidade, Documentação e Entrega |

---

## MVP

| Sprint | Épicos Alocados | Foco do MVP (O que entrega valor real) |
| :--- | :--- | :--- |
| **Sprint 0**<br>*(09/03 a 13/03)* | **E0:** Preparação e Protótipo | **Preparação:** Criação dos artefatos scrum, como o backlog e o burndown chart. Além das modelagens de diagramas de fluxo de trabalho, de banco de dados e o protótipo no figma. |
| **Sprint 1**<br>*(16/03 a 05/04)* | **E1:** Integração com API do Banco Central<br>**E2:** Pipeline de Processamento de Dados<br>**E3:** API Backend (Node + Prisma) | **Motor de Dados e Base:** O script de extração puxa e limpa os indicadores em nível **Estadual** (*NÃO DEFINIDO AINDA*). O backend recebe esses dados, salva no banco de dados e cria o primeiro endpoint que devolve o "Índice de Oportunidade DM" (*INSPIRADO NO SERASA SCORE*). |
| **Sprint 2**<br>*(13/04 a 03/05)* | **E4:** Dashboard — Visão Geral e Mapa | **Visualização Central:** O frontend consome o endpoint criado na Sprint 1 e renderiza a tela principal. A entrega de valor é uma tabela de ranking e um mapa de calor, evidenciando as regiões com melhor e pior "Score" para a expansão. |
| **Sprint 3**<br>*(11/05 a 31/05)* | **E5:** Dashboard — Detalhamento e Comparação<br>**E6:** Autenticação e Controle de Acesso<br>**E7:** Qualidade, Documentação e Entrega | **Refinamento e Entrega:** Criação de uma tela simples para comparar duas regiões. Implementação de um **login básico** (*NÃO DEFINIDO AINDA*) e a finalização obrigatória do Manual do Usuário, Manual de Instalação no Git e revisão final do código. |
