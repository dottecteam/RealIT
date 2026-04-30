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
Autentica o usuário e inicia uma sessão.

- **Sucesso `200`:** Retorna `token` e dados do usuário.

---

### `POST /auth/logout` 🔒
Encerra a sessão ativa e invalida o token.

---

## Módulo de Dados e Analytics — `/data` 🔒

Este módulo fornece a inteligência para o Dashboard, integrando os dados brutos ao motor de cálculo de scores.

### Análise e Performance

#### `GET /data/score`
Calcula scores dinâmicos (Eixo I e II) para todas as UFs ou uma específica.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `uf` | query | Não | Filtra por Unidade Federativa. |

**Diferencial:** Retorna a categoria estratégica (ex: `DIAMANTE BRUTO`) baseada na matriz de decisão.

---

#### `GET /data/summary`
Endpoint unificado para resgate de indicadores brutos por nível geográfico.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `uf` | query | Sim* | Filtra por Unidade Federativa. |
| `regiao` | query | Sim* | Filtra por região. |
| `mesAno` | query | Não | Período de referência. |

> *Obrigatório informar `uf` **ou** `regiao`.

**Retorno:** Consolida Risco de Crédito, Inclusão, PIX e IBGE em um único objeto.

---

#### `GET /data/ranking`
Gera a lista prioritária de estados para investimento.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `orderBy` | query | Não | `'RC'` ou `'IE'` |

**Lógica:** No eixo RC, menores notas aparecem no topo (menor risco = melhor oportunidade).

---

#### `GET /data/history`
Fornece séries temporais para gráficos de evolução.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `limit` | query | Não | Número de meses (padrão: `12`). |
| `uf` | query | Não | Filtra por UF. |
| `regiao` | query | Não | Filtra por região. |

**Retorno:** Formatado para integração direta com a biblioteca **ApexCharts**.

---

### Ingestão de Dados — Apenas `ADMIN`

#### `POST /data/import-monthly`
Ingestão em massa via transação (Bulk Ingestion) para dados processados no Google Colab.

#### `POST /data/credit-risk`
Importação manual de lotes de Risco de Crédito.

---

## Módulo de Usuários — `/users` 🔒

### `GET /users/me`
Retorna os dados do perfil do usuário autenticado.

### `POST /users/create` — Apenas `ADMIN`
Cadastro de novos analistas.

### `PATCH /users/inactivate/:id`
Desativa o acesso de um usuário e derruba todas as suas sessões ativas.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | path | Sim | ID do usuário a ser inativado. |

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