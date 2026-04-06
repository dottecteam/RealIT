# Documentação Técnica da API

## Visão Geral

API REST construída com **Express + TypeScript**, utilizando **Prisma ORM** com SQLite e autenticação via **JWT**. O servidor sobe na porta `3000` por padrão (configurável via variável de ambiente `PORT`).

**Base URL:** `http://localhost:3000`

---

## Autenticação

A API utiliza autenticação via **Bearer Token (JWT)**. Rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido na rota `POST /auth/login` e tem validade de **1 dia**.

---

## Health Check

### `GET /health`

Verifica se a API está no ar.

**Resposta de sucesso `200`:**
```json
{ "status": "ok" }
```

---

## Rotas de Autenticação — `/auth`

### `POST /auth/registrar`

Cria um novo usuário.

**Body (JSON):**

| Campo      | Tipo   | Obrigatório | Descrição                          |
|------------|--------|-------------|-------------------------------------|
| `name`     | string | Sim         | Nome do usuário                     |
| `email`    | string | Sim         | E-mail válido                       |
| `password` | string | Sim         | Senha (mínimo 6 caracteres)         |

**Exemplo de requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Usuario criado com sucesso",
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                        | Motivo                         |
|--------|---------------------------------|--------------------------------|
| `400`  | `Todos os campos são obrigatórios` | Campo ausente no body       |
| `409`  | `Email já cadastrado`           | E-mail duplicado               |

---

### `POST /auth/login`

Autentica um usuário e retorna o token JWT.

**Body (JSON):**

| Campo      | Tipo   | Obrigatório |
|------------|--------|-------------|
| `email`    | string | Sim         |
| `password` | string | Sim         |

**Exemplo de requisição:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso `200`:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                          | Motivo                               |
|--------|-----------------------------------|--------------------------------------|
| `400`  | `Todos os campos são obrigatórios` | Campo ausente no body               |
| `401`  | `Usuário não encontrado`          | E-mail não cadastrado ou senha errada |

---

### `GET /auth/me` 🔒

Retorna os dados do usuário autenticado. **Requer token.**

**Resposta de sucesso `200`:**
```json
{
  "user": {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Respostas de erro:**

| Status | Mensagem                      | Motivo                    |
|--------|-------------------------------|---------------------------|
| `401`  | `Token não fornecido`         | Header Authorization ausente |
| `401`  | `Token inválido ou expirado`  | Token inválido ou expirado |

---

### `GET /auth/listar-usuarios`

Lista todos os usuários cadastrados.

**Resposta de sucesso `200`:**
```json
[
  {
    "id": "clxyz...",
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "..."
  }
]
```

---

## Rotas de Dados — `/dados`

Todas as rotas de `POST` possuem validação do body via Zod. Em caso de falha na validação, a resposta será:

**Resposta de erro de validação `400`:**
```json
{
  "error": "Campos obrigatórios faltando ou com formato inválido",
  "detalhes": [
    {
      "campo": "uf",
      "mensagem": "UF deve ter exatamente 2 letras"
    }
  ]
}
```

---

### `POST /dados/receber-dados`

Recebe dados do SCR (Sistema de Informações de Crédito do Banco Central).

**Body (JSON):**

| Campo                    | Tipo    | Obrigatório | Descrição                      |
|--------------------------|---------|-------------|--------------------------------|
| `data_base`              | string  | Sim         | Data de referência (ex: `"01/2024"`) |
| `uf`                     | string  | Sim         | Sigla do estado (2 letras)     |
| `cliente`                | string  | Sim         | Tipo de cliente                |
| `cnae_ocupacao`          | string  | Sim         | Código CNAE ou ocupação        |
| `porte`                  | string  | Sim         | Porte do tomador               |
| `carteira_inadiplencia`  | number  | Sim         | Valor da carteira em inadimplência |
| `carteira_vencida`       | number  | Não         | Valor da carteira vencida      |

**Exemplo de requisição:**
```json
{
  "data_base": "01/2024",
  "uf": "SP",
  "cliente": "Pessoa Física",
  "cnae_ocupacao": "4711-3/01",
  "porte": "Micro",
  "carteira_inadiplencia": 1500.50,
  "carteira_vencida": 300.00
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Dado recebido e cadastrado com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-dados-pix`

Recebe dados de transações Pix por município.

**Body (JSON):**

| Campo               | Tipo    | Obrigatório | Descrição                           |
|---------------------|---------|-------------|--------------------------------------|
| `ano_mes`           | integer | Sim         | Período no formato `YYYYMM` (ex: `202401`) |
| `municipio_ibge`    | integer | Sim         | Código IBGE do município             |
| `municipio`         | string  | Sim         | Nome do município                    |
| `estado_ibge`       | integer | Sim         | Código IBGE do estado                |
| `estado`            | string  | Sim         | Nome do estado                       |
| `sigla_regiao`      | string  | Sim         | Sigla da região (ex: `"SE"`)         |
| `vl_pagador_pf`     | number  | Sim         | Volume financeiro de pagadores PF    |
| `qt_pagador_pf`     | integer | Sim         | Quantidade de transações de pagadores PF |
| `vl_recebedor_pf`   | number  | Sim         | Volume financeiro de recebedores PF  |
| `qt_recebedor_pf`   | integer | Sim         | Quantidade de transações de recebedores PF |
| `qt_pes_pagador_pf` | integer | Sim         | Quantidade de pessoas pagadoras PF   |
| `qt_pes_recebedor_pf` | integer | Sim       | Quantidade de pessoas recebedoras PF |

**Exemplo de requisição:**
```json
{
  "ano_mes": 202401,
  "municipio_ibge": 3550308,
  "municipio": "São Paulo",
  "estado_ibge": 35,
  "estado": "São Paulo",
  "sigla_regiao": "SE",
  "vl_pagador_pf": 980000.00,
  "qt_pagador_pf": 15000,
  "vl_recebedor_pf": 870000.00,
  "qt_recebedor_pf": 14200,
  "qt_pes_pagador_pf": 8000,
  "qt_pes_recebedor_pf": 7500
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Dado PIX recebido e cadastrado com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-taxa`

Recebe dados de taxa de escolarização (IBGE/SIDRA tabela 7138).

**Body (JSON):**

| Campo  | Tipo    | Obrigatório | Descrição                              |
|--------|---------|-------------|----------------------------------------|
| `nn`   | string  | Sim         | Unidade da Federação (nome)            |
| `v`    | number  | Sim         | Valor da taxa                          |
| `d1n`  | string  | Sim         | Unidade da Federação (dimensão 1)      |
| `d3n`  | integer | Sim         | Ano de referência                      |
| `d5n`  | string  | Sim         | Grupo de idade                         |

**Exemplo de requisição:**
```json
{
  "nn": "São Paulo",
  "v": 92.5,
  "d1n": "São Paulo",
  "d3n": 2022,
  "d5n": "15 a 17 anos"
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Taxa de escolarização recebida e cadastrada com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-crescimento`

Recebe dados de crescimento populacional (IBGE).

**Body (JSON):**

| Campo  | Tipo   | Obrigatório | Descrição                          |
|--------|--------|-------------|-------------------------------------|
| `d1n`  | string | Sim         | Unidade da Federação               |
| `d2n`  | string | Sim         | Tipo de taxa de crescimento        |
| `v`    | number | Sim         | Valor da taxa                      |

**Exemplo de requisição:**
```json
{
  "d1n": "Minas Gerais",
  "d2n": "Taxa de crescimento geométrico",
  "v": 0.87
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Crescimento populacional recebido e cadastrado com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-populacao`

Recebe dados de população absoluta (IBGE).

**Body (JSON):**

| Campo  | Tipo    | Obrigatório | Descrição                        |
|--------|---------|-------------|-----------------------------------|
| `d1n`  | string  | Sim         | Unidade da Federação             |
| `d2n`  | string  | Sim         | Tipo de população residente      |
| `v`    | integer | Sim         | Valor absoluto da população      |

**Exemplo de requisição:**
```json
{
  "d1n": "Rio de Janeiro",
  "d2n": "População residente",
  "v": 17366189
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "População Absoluta recebida e cadastrada com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-bonus`

Recebe dados de bônus demográfico.

**Body (JSON):**

| Campo                  | Tipo    | Obrigatório | Descrição                                   |
|------------------------|---------|-------------|----------------------------------------------|
| `brasilGrandeRegiaoUf` | string  | Sim         | Localidade (Brasil, grande região ou UF)     |
| `total`                | integer | Sim         | População total                              |
| `xy_anos`              | integer | Sim         | População na faixa etária específica         |

**Exemplo de requisição:**
```json
{
  "brasilGrandeRegiaoUf": "Sudeste",
  "total": 89012114,
  "xy_anos": 14200000
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Bônus Demográfico recebido e cadastrado com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-risco`

Recebe dados de Risco de Crédito (scores do Eixo I). **Sem validação Zod** — a validação é feita manualmente no controller.

**Body (JSON):**

| Campo                  | Tipo   | Obrigatório | Descrição                                  |
|------------------------|--------|-------------|---------------------------------------------|
| `inadimplenciaReal`    | number | Sim         | Score de inadimplência                      |
| `FragilidadeRenda`     | number | Sim         | Score de fragilidade de renda               |
| `AgingDivida`          | number | Sim         | Score de aging da dívida                    |
| `VulnerabilidadeSocial`| number | Sim         | Score de vulnerabilidade social (escolarização) |

**Exemplo de requisição:**
```json
{
  "inadimplenciaReal": 3,
  "FragilidadeRenda": 2.7,
  "AgingDivida": 1.8,
  "VulnerabilidadeSocial": 3.5
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Risco de Crédito cadastrado com sucesso",
  "dado": { ... }
}
```

---

### `POST /dados/receber-inclusao`

Recebe dados de Inclusão Demográfica (scores do Eixo II).

**Body (JSON):**

| Campo                    | Tipo    | Obrigatório | Descrição                            |
|--------------------------|---------|-------------|---------------------------------------|
| `MaturidadePix`          | number  | Sim         | Score de maturidade Pix               |
| `CrescimentoPopulacional`| number  | Sim         | Score de crescimento populacional     |
| `PopulacaoAbsoluta`      | integer | Sim         | Valor de população absoluta           |
| `BonusDemografico`       | number  | Sim         | Score de bônus demográfico            |

**Exemplo de requisição:**
```json
{
  "MaturidadePix": 4.2,
  "CrescimentoPopulacional": 3.1,
  "PopulacaoAbsoluta": 45900000,
  "BonusDemografico": 2.8
}
```

**Resposta de sucesso `201`:**
```json
{
  "message": "Inclusão Demográfica cadastrada com sucesso",
  "dado": { ... }
}
```

---

## Rotas de Listagem — `GET /dados`

Todas retornam `200` com um array de registros ou `500` em caso de erro interno.

| Rota                        | Retorna                        |
|-----------------------------|--------------------------------|
| `GET /dados/listar-dados`   | Todos os registros SCR         |
| `GET /dados/listar-dados-pix` | Todos os registros Pix       |
| `GET /dados/listar-taxa`    | Taxas de escolarização         |
| `GET /dados/listar-crescimento` | Crescimento populacional   |
| `GET /dados/listar-populacao` | Dados de população absoluta  |
| `GET /dados/listar-bonus`   | Dados de bônus demográfico     |
| `GET /dados/listar-risco`   | Dados de risco de crédito      |
| `GET /dados/listar-inclusao` | Dados de inclusão demográfica |

**Exemplo de resposta `200`:**
```json
[
  { "id": 1, ... },
  { "id": 2, ... }
]
```

**Resposta de erro `500`:**
```json
{ "error": "Erro ao buscar dados" }
```

---

## Variáveis de Ambiente

| Variável       | Descrição                                  |
|----------------|--------------------------------------------|
| `PORT`         | Porta do servidor (padrão: `3000`)         |
| `DATABASE_URL` | URL de conexão com o banco SQLite          |
| `JWT_SECRET`   | Chave secreta para assinatura dos tokens JWT |

---

## Fluxo de Uso Típico

O fluxo padrão de integração com a API segue esta ordem:

1. **Registrar** um usuário em `POST /auth/registrar`
2. **Autenticar** em `POST /auth/login` e guardar o token retornado
3. Usar o token no header `Authorization: Bearer <token>` para acessar rotas protegidas
4. **Enviar dados** pelas rotas `POST /dados/receber-*` (normalmente feito pelo script Python `processadordedadosrealit.py`)
5. **Consultar** os dados armazenados pelas rotas `GET /dados/listar-*`

---