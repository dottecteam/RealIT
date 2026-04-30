# Documentação Técnica da API — Real IT
> **Versão:** Sprint 2

---

## Visão Geral

API REST escalável construída com **Express + TypeScript**, utilizando **Prisma ORM** (SQLite) e validação de esquemas com **Zod**. A inteligência de dados foi centralizada em serviços para garantir performance e precisão nos cálculos de mercado.

**Base URL:** `http://localhost:3000`

---

## Autenticação e Segurança

A API utiliza **JWT (JSON Web Token)**. O token deve ser enviado no header de todas as rotas protegidas:

```
Authorization: Bearer <token>
```

### Níveis de Permissão (Roles)

| Role | Descrição |
|------|-----------|
| `USER` | Acesso básico a perfil e consulta de análises/scores. |
| `ADMIN` | Gerenciamento de usuários e ingestão de dados via Google Colab. |
| `DEV` | Diagnósticos de sistema e reset de banco de dados. |

---

## Módulo de Autenticação — `/auth`

### `POST /auth/login`
Gera token JWT e registra log de acesso.

### `POST /auth/logout`
Invalida a sessão e encerra o token atual.

---

## Módulo de Ingestão e Dados — `/data`

Este módulo permite a alimentação do banco de dados (via Google Colab/Admin) e o consumo de análises para o Dashboard. Todas as rotas exigem `sessionMiddleware`.

---

### Ingestão de Dados — Apenas `ADMIN`

| Endpoint | Descrição |
|----------|-----------|
| `POST /data/import-monthly` | Ingestão em massa (Bulk) que processa simultaneamente Risco, Inclusão, PIX e IBGE em uma única transação. |
| `POST /data/credit-risk` | Ingestão específica de arrays de dados de Risco de Crédito. |
| `POST /data/inclusion-expansion` | Ingestão específica de dados de Inclusão e Expansão. |
| `POST /data/pix-structure` | Ingestão específica da estrutura de transações PIX. |
| `POST /data/ibge-structure` | Ingestão de indicadores demográficos e educacionais do IBGE. |

---

### Consulta de Análises

#### `GET /data/score`
Retorna os scores calculados (Eixo I e II) e a categoria estratégica por UF.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `uf` | query | Não | Filtra por Unidade Federativa. |

> **Diferencial:** Retorna a categoria estratégica (ex: `DIAMANTE BRUTO`) baseada na matriz de decisão.

---

#### `GET /data/summary`
Resumo consolidado de todos os indicadores filtrados por `uf` ou `regiao`.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `uf` | query | Sim* | Filtra por Unidade Federativa. |
| `regiao` | query | Sim* | Filtra por região. |
| `mesAno` | query | Não | Período de referência. |

> *Obrigatório informar `uf` **ou** `regiao`.

---

#### `GET /data/ranking`
Lista ordenada das melhores oportunidades de mercado baseada nos scores.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `orderBy` | query | Não | `'RC'` ou `'IE'` |

> **Lógica:** No eixo RC, menores notas aparecem no topo (menor risco = melhor oportunidade).

---

#### `GET /data/history`
Séries temporais para gráficos de evolução (Inadimplência vs. Renda).

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `limit` | query | Não | Número de meses (padrão: `12`). |
| `uf` | query | Não | Filtra por UF. |
| `regiao` | query | Não | Filtra por região. |

> **Retorno:** Formatado para integração direta com a biblioteca **ApexCharts**.

---

### Consulta de Dados Brutos

| Endpoint | Descrição |
|----------|-----------|
| `GET /data/credit-risk` | Lista dados brutos de risco com filtros de UF/Região. |
| `GET /data/inclusion-expansion` | Lista dados brutos de inclusão com filtros. |
| `GET /data/pix-structure` | Lista dados estruturais de transações PIX. |
| `GET /data/ibge-structure` | Lista indicadores brutos do IBGE. |

---

## Módulo de Usuários e Administração — `/users`

Gerencia permissões, perfis e auditoria do sistema.

---

### Gestão de Perfil

| Endpoint | Descrição |
|----------|-----------|
| `GET /users/me` | Retorna os dados do usuário autenticado. |

---

### Administração de Contas — Apenas `ADMIN`

| Endpoint | Descrição |
|----------|-----------|
| `GET /users/` | Lista todos os usuários cadastrados. |
| `GET /users/search` | Busca usuários por nome (via query string). |
| `GET /users/id/:id` | Busca detalhes de um usuário específico pelo ID. |
| `GET /users/email/:email` | Busca usuário pelo endereço de e-mail. |
| `GET /users/role/:role` | Filtra usuários por nível de acesso (`USER`, `ADMIN`, `DEV`). |
| `POST /users/create` | Criação de novas contas com validação de senha e rate limit. |
| `PUT /users/edit/:id` | Atualização completa dos dados do usuário. |
| `PATCH /users/inactivate/:id` | Desativa o acesso de um usuário. |
| `PATCH /users/activate/:id` | Reativa uma conta inativa. |
| `PATCH /users/role/admin/:id` | Promove um usuário para o cargo `ADMIN`. |
| `PATCH /users/role/user/:id` | Altera o cargo de um usuário para `USER`. |

---

### Auditoria e Diagnóstico — Apenas `DEV`

| Endpoint | Descrição |
|----------|-----------|
| `GET /users/sessions` | Lista todas as sessões ativas no sistema. |
| `GET /users/sessions/:id` | Lista o histórico de sessões de um usuário específico. |
| `GET /users/logs` | Exibe o log global de operações do sistema. |
| `GET /users/logs/:id` | Exibe os logs de ações realizadas por um usuário específico. |
| `PATCH /users/role/dev/:id` | Atribui nível de acesso `DEV` a um usuário. |

---

## Ferramentas de Desenvolvedor — `/dev`

Exclusivo para o cargo `DEV`.

| Endpoint | Descrição |
|----------|-----------|
| `DELETE /dev/reset-database` | Limpa tabelas de Logs, Sessões e Usuários. |
| `POST /dev/seed-admin` | Cria o usuário administrador padrão (`admin@teste.com`). |
| `POST /dev/seed-dev` | Cria o usuário desenvolvedor padrão (`dev@teste.com`). |

---

## Inteligência de Negócio — Score Service

A API aplica automaticamente **Normalização Min-Max** e **Soma Ponderada** conforme o documento metodológico.

### Eixo RC — Risco de Crédito

| Indicador | Peso |
|-----------|------|
| Inadimplência | 35% |
| Renda | 35% |
| Aging | 20% |
| Escolaridade | 10% |

### Eixo IE — Inclusão e Expansão

| Indicador | Peso |
|-----------|------|
| PIX | 35% |
| Crescimento | 25% |
| População | 25% |
| Bônus | 15% |

> O sistema prioriza **pesos personalizados** definidos pelo usuário; caso ausentes, aplica os pesos padrão acima.

---

## Respostas de Erro

| Código | Descrição |
|--------|-----------|
| `400` | Erro de validação Zod (campos faltando ou formato inválido de UF/Região). |
| `401` | Sessão encerrada ou token inválido. |
| `403` | Acesso negado por nível de permissão. |
| `404` | Dados não encontrados para o filtro solicitado. |
| `500` | Erro interno no motor de cálculo ou banco de dados. |