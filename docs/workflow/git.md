# Padrões de Desenvolvimento - GitHub

Este documento estabelece as regras de colaboração para evitar códigos incompletos e garantir a integridade do projeto.

## Política de Branches

### Ambiente da Sprint:
**A branch develop é a nossa branch principal de desenvolvimento durante a Sprint.**
* Toda nova funcionalidade deve ser baseada (criada a partir) da develop.
* É nela que integraremos os códigos dos membros do grupo para testar a aplicação completa antes da entrega final na main.
* O merge para a main só ocorrerá no fechamento da Sprint, após validação total do grupo.

### Funcionalidades:
**É expressamente proibido separar branches por camadas técnicas (ex: branch só para Model ou só para View).** Cada branch deve representar uma funcionalidade que possa ser testada do início ao fim.

* **Padrão:** `tipo/id-descricao-da-feature`
* **Exemplo Correto:** `feature/02-calculo-inadimplencia-regional` (Inclui a lógica, a busca no banco e a exibição).
* **Exemplo Incorreto:** `feature/02-apenas-backend-dashboard`.

### Tipos Permitidos:
* `feature/`: Novas funcionalidades do Backlog.
* `fix/`: Correção de bugs.
* `docs/`: Documentação, manuais da Fatec, VPC e BPMN.
* `refactor/`: Melhoria de código existente sem alterar comportamento.

---

## Padrão de Commits

Adotamos o formato de identificação por tarefa para facilitar a revisão de código exigida no semestre.

**Formato:** `tipo (#ID-Indice): descrição curta`

* **feat:** `feat (#04-1): implementa consumo de dados do Banco Central`
* **fix:** `fix (#12-3): corrige erro na média de endividamento`
* **docs:** `docs (#01-1): define padrões de branch e commit`

---

## Fluxo de Trabalho (Pull Requests)

Para evitar que códigos quebrados entrem na branch principal, seguiremos este fluxo:

1.  **Criação:** Abra o PR da `feature/` para a `develop`.
2.  **Checklist de Autoria:** O autor deve garantir que a feature está completa.
3.  **Revisão por Pares:** Pelo menos 1 colega deve revisar o código.
4.  **Aprovação:** O merge só será feito após a aprovação e se não houver conflitos.

---

## GitHub Features

### 1. Branch Protection (Proteção de Branch)
Para garantir a integridade do código, as branches `main` e `develop` estão protegidas.
- **Push Direto:** Desativado. Todo código entra via Pull Request.
- **Revisão Obrigatória:** É necessário pelo menos 1 aprovação de um colega para mergear.

### 2. Pull Request Template
Ao abrir um PR, o GitHub carregará automaticamente um checklist. O autor deve marcar as opções confirmando que a funcionalidade está completa (Verticalidade) e que o código foi testado.

### 3. Issues & Projects
- **Issues:** Cada tarefa do Backlog será uma Issue com um ID único (ex: #04).
- **Projects:** O progresso será movido no Kanban do projeto para visualização em tempo real.