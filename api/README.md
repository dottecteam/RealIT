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
DATABASE_URL="file:./dev.db"
PORT=3000
```

### 4. Executar em modo de Desenvolvimento

Para rodar a API, utilize:

```bash
npm run dev
```

O servidor estará disponível em: ```http://localhost:3000``` (ou na rota indicada no ```.env```).

---

