# Real IT - API

Esta é a camada de serviços (Backend) do projeto Real IT, responsável por persistir e servir os dados de indicadores econômicos processados.

---

## Como Executar o Projeto

Siga os passos abaixo para configurar o ambiente localmente:

### 1. Pré-requisitos

Certifique-se de ter o Node.js instalado na sua máquina (recomendado v20 LTS ou superior).

### 2. Instalação de Dependências

No diretório ```/api```, execute:

```bash
npm install
```

### 3. Variáveis de Ambiente

Crie um arquivo ```.env``` na raiz da pasta ```/api``` com a URL do banco de dados **(Temporariamente utilizando o SQLite)**

```bash
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Servidor
PORT=3000
NODE_ENV=development

# Segurança
JWT_SECRET="sua_chave_secreta_aqui"
JWT_EXPIRES_IN="1d"

# Limites de Requisições
GLOBAL_LIMIT_WINDOW_MS=1200000
GLOBAL_LIMIT_MAX=100
AUTH_LIMIT_MAX=5
CREATE_ACCOUNT_LIMIT_MAX=10
```

### 4. Preparar o Prisma

É preciso gerar o conteúdo do Prisma e o migrate caso o primeiro acesso:

```bash
npx prisma generate

npx prisma migrate dev
```

### 4. Executar em modo de Desenvolvimento

Para rodar a API, utilize:

```bash
npm run dev
```

O servidor estará disponível em: ```http://localhost:3000``` (ou na rota indicada no ```.env```).

---

