# Controle de Qualidade

Este documento estabelece as diretrizes obrigatórias para garantir a integridade do código, a rastreabilidade das alterações e a fluidez do trabalho em equipe.

---

## 1. Versionamento (Git)

Toda a gestão de código e organização de fluxo de trabalho deve seguir rigorosamente as convenções estabelecidas no arquivo [**`git.md`**](./git.md).

* **Branches:** Devem ser criadas seguindo os prefixos e padrões definidos (ex: `feature/`, `fix/`, `docs/`).
* **Mensagens:** Utilize os padrões de escrita de mensagens de commit descritos no guia de referência para manter um histórico legível.

## 2. Qualidade e Frequência de Commits

O commit deve representar uma unidade lógica de progresso. Para manter um histórico útil e limpo, siga estas regras:

* **Não acumule alterações:** Evite "segurar" diversas funcionalidades ou correções para comitar tudo de uma vez. Commits gigantes dificultam o *Code Review* e tornam impossível reverter um erro sem perder outras partes do trabalho.
* **Evite commits irrelevantes:** Não realize commits para alterações insignificantes, como a mudança de uma única letra ou um ajuste de espaço, a menos que seja uma correção de sintaxe crítica. Agrupe pequenos ajustes estéticos em um único commit de "Refatoração" ou "Lint".
* **Commits Atômicos:** Cada commit deve focar em resolver uma única coisa por vez.

## 3. Definição de Feito (Definition of Done)

Uma tarefa só é considerada oficialmente concluída quando atende a todos os critérios da **Definição de Feito (DoD)**.

* Os critérios específicos para cada funcionalidade ou User Story encontram-se detalhados no [**Backlog da Sprint**](../scrum/).
* Antes de sinalizar a conclusão, verifique se todos os requisitos técnicos e de negócio listados no card da Sprint foram satisfeitos.

## 4. Pull Requests e Aprovações

O processo de integração de código é protegido por revisão obrigatória.

* **Aprovação Obrigatória:** Nenhum código deve ser mesclado (*merged*) nas branches principais sem a abertura de um **Pull Request (PR)**.
* **Revisão por Pares:** Todos os Pull Requests devem ser analisados e **aprovados** por outro desenvolvedor antes do merge.
* **Critérios:** Durante a revisão, serão avaliados a lógica, a segurança, a performance e a conformidade com as definições do projeto.

---

> A aderência a estas práticas garante a estabilidade do produto e a agilidade da equipe durante a Sprint.