# Ambientes de Desenvolvimento

Este documento descreve os ambientes que compõem o ecossistema do projeto e as instruções básicas para configurar e rodar cada um deles localmente.

---

## Estrutura dos Ambientes

O projeto é dividido em três frentes principais, cada uma com uma responsabilidade específica:

### 1. Processamento de Dados (Google Colab)
Ambiente voltado para a análise, limpeza e processamento pesado de dados.
* **Tecnologia:** Python.
* **Uso:** Scripts de extração e transformação de dados que alimentam nossa base.
* **Acesso:** Via navegador através do link oficial do projeto no Google Colab.

### 2. Backend (API)
Camada de serviços e integração com o banco de dados.
* **Stack:** TypeScript, Express e Prisma (ORM).
* **Instalação:**
    ```bash
    cd api
    npm install
    ```
* **Execução:** `npm run dev` (ou comando equivalente definido no `package.json`).

### 3. Frontend (Interface)
Interface do usuário para interação com os dados processados.
* **Stack:** TypeScript e React.
* **Instalação:**
    ```bash
    cd frontend
    npm install
    ```
* **Execução:** `npm start` ou `npm run dev`.

---

## Instruções Gerais de Instalação

Por enquanto, o setup segue o padrão básico de gerenciamento de pacotes do Node.js:

1.  Certifique-se de ter o **Node.js** (versão LTS recomendada) instalado.
2.  Clone o repositório.
3.  Em cada diretório (`backend` e `frontend`), execute o comando para instalar as dependências:
    ```bash
    npm i
    ```

## Evolução Futura (Conteinerização)

Atualmente, o ambiente roda diretamente na máquina local (ou via VM/VirtualBox conforme nossa infraestrutura atual). No entanto, está planejado para o futuro a migração para **Docker**.

* **Objetivo:** Isolar as dependências da API e do Banco de Dados em containers para garantir que o ambiente seja idêntico em todas as máquinas dos desenvolvedores.
* **Status:** A estrutura de `Dockerfile` e `docker-compose.yml` será implementada em sprints posteriores.

---

> A estrutura detalhada de pastas de cada serviço será definida e documentada durante a execução da sprint vigente.