# Documentação Técnica da API

## Visão Geral
API REST escalável construída com **Express + TypeScript**, utilizando **Prisma ORM** (SQLite) e validação de esquemas com **Zod**. A arquitetura foca em segurança com múltiplos níveis de acesso e controle de taxa de requisições.

**Base URL:** `http://localhost:3000`

---

## Autenticação e Segurança

### Políticas de Acesso
A API utiliza **JWT (JSON Web Token)**. O token deve ser enviado no header de todas as rotas protegidas:
`Authorization: Bearer <token>`

### Níveis de Permissão (Roles)
- **USER**: Acesso básico a perfil e leitura de dados.
- **ADMIN**: Gerenciamento de usuários e importação de dados.
- **DEV**: Acesso a ferramentas de diagnóstico, logs de sistema e reset de banco.

### Rate Limiting (Proteção contra abusos)
- **Global**: 100 requisições por 20 min por IP.
- **Auth (Login)**: 5 tentativas por 20 min por IP.
- **Criação de Contas**: 10 contas por dia por IP.

---

## Health Check

### `GET /health`
Verifica a disponibilidade da API.
- **Resposta `200`**: `{ "status": "ok" }`

---

## Módulo de Autenticação — `/auth`

### `POST /auth/login`
Autentica o usuário e inicia uma sessão no banco de dados.
- **Body**: `email`, `password`.
- **Sucesso `200`**: Retorna `token`, dados do usuário e registra log `USER_LOGIN`.

### `POST /auth/logout` 🔒
Encerra a sessão ativa e invalida o token.
- **Requisito**: Token de sessão ativo.
- **Sucesso `200`**: `{ "message": "Logout realizado com sucesso" }`.

---

## Módulo de Usuários — `/users`

### Gestão de Perfil
- **`GET /users/me`** 🔒: Retorna o perfil do usuário logado.

### Administração de Usuários (Apenas ADMIN/DEV) 🔒
- **`GET /users/`**: Lista todos os usuários (campos selecionados).
- **`POST /users/create`**: Cria novo usuário com validação rigorosa de senha.
- **`PUT /users/edit/:id`**: Atualiza dados. Se a `role` ou `status` mudar, todas as sessões do usuário são derrubadas por segurança.
- **`PATCH /users/inactivate/:id`**: Desativa usuário e encerra sessões.

### Diagnósticos (Apenas DEV) 🔒
- **`GET /users/sessions`**: Lista todas as sessões do sistema.
- **`GET /users/logs`**: Lista histórico de operações (Login, Create, Update).

---

## Módulo de Dados — `/data` 🔒

### Importação e Escrita (Apenas ADMIN)
- **`POST /data/import-monthly`**: Ingestão em massa (Bulk) de Risco, Inclusão, Pix e IBGE em uma única transação.
- **`POST /data/credit-risk`**: Importação específica de Risco de Crédito.
- **`POST /data/pix-structure`**: Importação de estrutura PIX.

### Consulta e Analytics (USER/ADMIN)
- **`GET /data/calculate-scores`**: Calcula scores dinâmicos baseados nos pesos configurados pelo usuário (FiltroScore).
- **`GET /data/credit-risk`**: Lista dados de risco com filtros de UF, Região e MesAno.
- **`GET /data/pix-structure`**: Lista dados estruturais do PIX.

---

## Ferramentas de Desenvolvedor — `/dev` (Apenas DEV) 🔒

### `DELETE /dev/reset-database`
Limpa todas as tabelas (Logs, Sessions, Users) respeitando a integridade referencial.

### `POST /dev/seed-admin` / `seed-dev`
Cria usuários iniciais de teste com credenciais padrão (`admin123` / `dev123`).

---

## Variáveis de Ambiente (.env)
| Variável | Obrigatória | Descrição |
| :--- | :---: | :--- |
| `DATABASE_URL` | Sim | Caminho para o SQLite ou DB |
| `JWT_SECRET` | Sim | Chave para assinatura dos tokens |
| `PORT` | Não | Porta do servidor (Default: 3000) |

---

## Resumo de Respostas de Erro
- **`400`**: Falha de validação Zod (detalha o campo e a mensagem amigável).
- **`401`**: Token ausente, expirado ou sessão encerrada.
- **`403`**: Usuário não possui o cargo (Role) necessário para a rota.
- **`500`**: Erro interno do servidor ou falha no banco de dados.