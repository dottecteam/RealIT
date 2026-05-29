# Como Rodar o Projeto com Docker

Este projeto utiliza **Docker** e **Docker Compose** para facilitar a configuração do ambiente de desenvolvimento.

Com apenas um comando, toda a aplicação será iniciada automaticamente.

---

# Requisitos

Antes de começar, você precisa ter instalado:

- Docker
- Docker Compose

---

# Instalação no Windows

## 1. Instale o WSL2

Abra o PowerShell como administrador e execute:

```powershell
wsl --install
```

Reinicie o computador após a instalação.

---

## 2. Instale o Docker Desktop

Acesse o site oficial:

https://www.docker.com/products/docker-desktop/

Baixe e instale normalmente.

---

## 3. Ative integração com WSL

Após instalar:

1. Abra o Docker Desktop
2. Vá em:
   - `Settings`
   - `Resources`
   - `WSL Integration`
3. Ative sua distribuição Ubuntu

Exemplo:
- Ubuntu
- Ubuntu-22.04

---

## 4. Verifique se está funcionando

Abra o terminal e digite:

```bash
wsl
```

Com isso, verifique se o docker está funcionando:

```bash
docker --version
docker compose version
```

---

# Instalação no Linux

## Ubuntu / Debian

Atualize os pacotes:

```bash
sudo apt update
```

Instale dependências:

```bash
sudo apt install ca-certificates curl gnupg -y
```

Adicione a chave do Docker:

```bash
sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

Adicione o repositório:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Instale Docker:

```bash
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

---

## Verifique a instalação

```bash
docker --version
docker compose version
```

---

#  Como Rodar o Projeto

Na raiz do repositório, execute:

```bash
docker compose up
```

Ou em modo detached:

```bash
docker compose up -d
```

---

# Portas da Aplicação

Após iniciar:

| Serviço | Porta |
|---|---|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:3000 |

---

# Parar os Containers

```bash
docker compose down
```

---

# Rebuild da Aplicação

Caso altere dependências ou Dockerfiles:

```bash
docker compose up --build
```

---

# Problemas Comuns no WSL

## Erro: Permission denied

Exemplo:

```bash
sh: 1: next: Permission denied
```

Esse erro normalmente acontece quando:

- o `node_modules` foi criado no Windows
- permissões Linux foram perdidas
- arquivos ficaram sem permissão de execução

---

## Solução 1 — Remover node_modules

Dentro do projeto:

```bash
rm -rf node_modules
```

Depois:

```bash
docker compose up --build
```

---

## Solução 2 — Ajustar permissões

```bash
chmod -R 755 .
```

Ou especificamente:

```bash
chmod +x node_modules/.bin/*
```

---

## Solução 3 — Nunca desenvolver dentro do `/mnt/c`

Evite rodar projetos Node.js em:

```bash
/mnt/c/
```

Isso pode causar:

- lentidão
- erros de permissão
- hot reload quebrado
- problemas com volumes Docker

---

## Recomendado

Mantenha o projeto dentro da home Linux:

```bash
~/projects/meu-projeto
```

Exemplo:

```bash
cd ~

mkdir projects

cd projects
```

Clone o projeto ali:

```bash
git clone <repo>
```

---

# Limpeza Completa do Docker

Caso algo quebre:

```bash
docker compose down -v
```

Depois:

```bash
docker system prune -a
```

> Isso remove containers, imagens e volumes não utilizados.

---

# Logs dos Containers

Ver logs:

```bash
docker compose logs
```

Logs em tempo real:

```bash
docker compose logs -f
```

---

# Projeto Rodando

Se tudo ocorreu corretamente:

- Frontend disponível em:
  - http://localhost:3001

- Backend disponível em:
  - http://localhost:3000