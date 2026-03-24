# Real IT - Inteligência de Mercado com Dados Reais

## Conceito do Nome

O nome **Real IT** foi pensado como um jogo de palavras com múltiplos significados que refletem o propósito da plataforma:

- **"Real"** faz referência à moeda brasileira, conectando o sistema ao contexto econômico e financeiro
- Também remete à palavra **"Reality"**, associada à ideia de acompanhamento em tempo real, como em programas de TV onde o público observa os acontecimentos ao vivo
- **"IT" (Information Technology)** representa a área de tecnologia, destacando o papel da engenharia de software na construção da solução

Assim, o **Real IT** representa a ideia de acompanhar dados econômicos reais **em tempo quase real**, transformando informações públicas em insights estratégicos para tomada de decisão — especialmente no contexto de análise de crédito e oportunidades de mercado.

---

## Descrição

Uma plataforma de análise de mercado baseada em dados públicos, que coleta, processa e transforma informações econômicas em insights estratégicos.

O sistema integra dados de fontes oficiais (como Banco Central e outras APIs públicas), aplica tratamento e gera visualizações interativas que ajudam empresas a identificar oportunidades de expansão e tomada de decisão.

---

## Objetivo

- Automatizar a coleta de dados econômicos públicos
- Processar e padronizar indicadores de mercado
- Gerar um Índice de Oportunidade (Score) para apoio à decisão
- Permitir análise visual por meio de dashboards interativos
- Facilitar o consumo dos dados por outras aplicações

---

## MVP

O desenvolvimento do **Real IT** está estruturado em **3 sprints**, focando na evolução progressiva desde a fundação técnica até a entrega final ao usuário:

| Sprint | Foco do MVP | Entregas Principais (Épicos) |
| :--- | :--- | :--- |
| **[Sprint 1](./docs/scrum/sprint-backlog/sprint-1.md)**<br>*(16/03 - 05/04)* | **Fundação e Score** | Estruturação da base técnica: Integração com APIs, Pipeline de dados, Backend e a primeira versão do Índice de Oportunidade (Score). |
| **[Sprint 2](./docs/scrum/sprint-backlog/sprint-2.md)**<br>*(06/04 - 03/05)* | **Visualização Avançada** | Dashboards interativos: Mapa de calor, ranking regional, sistemas de filtros e navegação entre macro e microrregiões. |
| **[Sprint 3](./docs/scrum/sprint-backlog/sprint-3.md)**<br>*(04/05 - 31/05)* | **Refinamento e Acesso** | Camada de segurança (Auth), comparação entre regiões, exportação de relatórios (PDF/CSV) e o site institucional do produto. |

> **MVP Detalhado:** [Consultar Backlog Completo](./docs/scrum/product-backlog.md)

---

## Backlog do Produto (Resumo)

Abaixo, as principais funcionalidades priorizadas para o sucesso do projeto:

| ID | User Story (Desejo do Usuário) | Prioridade | Sprint |
|:---|:---|:---:|:---:|
| #1 | Coleta de dados reais (APIs Públicas/BC) | Alta | 1 |
| #2 | Processamento e limpeza automática mensal | Alta | 1 |
| #3 | Disponibilização de dados via API Backend | Alta | 1 |
| #4 | Visualização do Índice de Oportunidade (Score) | Alta | 1 |
| #5 | Mapa interativo de potencial de mercado | Alta | 2 |
| #6 | Tabela de ranking regional para investimentos | Alta | 2 |
| #7 | Filtros de indicadores para cenários | Média | 2 |
| #8 | Filtro de granularidade (Macro/Micro) | Média | 2 |
| #9 | Restrição de acesso por Autenticação (Login) | Média | 3 |
| #10| Comparação detalhada entre duas regiões | Média | 3 |
| #11| Exportação de dados (PDF, CSV, XLSX, XML) | Baixa | 3 |
| #12| Website Institucional e Metodologia | Baixa | 3 |
| #13| Manuais de uso e documentação final | Baixa | 3 |

---

## Tecnologias Utilizadas

### Coleta e Processamento de Dados
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Colab](https://img.shields.io/badge/Google%20Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=black)

- Python para coleta e tratamento de dados
- Google Colab para execução dos pipelines

---

### Backend
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

- API REST com Express
- ORM Prisma para persistência de dados
- TypeScript para tipagem e escalabilidade

---

### Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

- React com Next.js para construção da interface
- Renderização otimizada
- Interface moderna e responsiva

---

## Colaboradores

Nome | Função | LinkedIn | GitHub
-|-|-|-
Davi Andrade | Scrum Master | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/daviandrade007) | <a href="https://github.com/aandrade007"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
João Paulo | Product Owner | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/joaosantos02) | <a href="https://github.com/jopaul0"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Kauan Domingues | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://linkedin.com/in/kauandomingues) | <a href="https://github.com/KauanDomingues"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Breno Reis | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/breno-reis-893009321) | <a href="https://github.com/brenoviske"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Cauã Mehiel | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/cau%C3%A3-cursino-748485235) | <a href="https://github.com/CauaCurisno1446"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Gabriel Borges | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/gabriel-borges-toledo) | <a href="https://github.com/Gabe-Borges"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Jessica Katayama | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/jessicakatayama) | <a href="https://github.com/JessicaKatayama"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
Nicolas Anderson | Developer | [![LinkedIn](https://img.shields.io/badge/linkedin-blue?style=for-the-badge)](https://www.linkedin.com/in/nicolas-anderson-34b082302) | <a href="https://github.com/Slot148"> <img src="https://img.shields.io/badge/github-black?style=for-the-badge&logo=github"/> </a>
