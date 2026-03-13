# Backlog da Sprint 3

| ID | User Story | Definição de Pronto | Definição de Feito | Estimativa |
|:---|:---|:---|:---|:---:|
| #10 | Como usuário do dashboard, desejo aplicar **filtros nos indicadores** para analisar diferentes cenários e regiões. | - Indicadores que poderão ser filtrados definidos pela equipe;</br> - Estrutura de dados da API disponível (Sprints 1 e 2);</br> - Layout dos filtros aprovado. | - Filtros funcionando corretamente no dashboard;</br> - Atualização dinâmica dos dados exibidos;</br> - Cliente validou que os filtros permitem análises mais específicas. | 3 |
| #11 | Como usuário do dashboard, desejo alternar entre **macro e microrregiões através de um filtro (checkbox)** para analisar o mercado em diferentes níveis de granularidade. | - Estrutura geográfica dos dados definida;</br> - Dados disponíveis na API;</br> - Layout do checkbox aprovado pela equipe. | - Alternância entre macro e microrregiões funcionando corretamente;</br> - Dashboard atualizado dinamicamente ao alterar o filtro;</br> - Cliente validou que a granularidade da análise está correta. | 3 |
| #12 | Como analista, desejo **exportar os dados do dashboard** para formatos como PDF, CSV, XLSX e XML para utilizar as análises em relatórios e apresentações. | - Formatos de exportação definidos;</br> - Estrutura dos dados a serem exportados definida;</br> - Biblioteca de exportação escolhida. | - Exportação funcionando para os formatos definidos;</br> - Arquivos gerados contendo os dados exibidos no dashboard;</br> - Cliente validou que os arquivos são utilizáveis em relatórios. | 3 |
| #13 | Como analista de mercado, desejo comparar detalhadamente duas regiões específicas para entender as vantagens competitivas de cada uma. | - Indicadores da comparação definidos;</br> - Dados das regiões disponíveis na API;</br> - Layout da tela de comparação aprovado. | - Comparação exibindo corretamente os indicadores das duas regiões;</br> - Interface clara facilitando a análise;</br> - Cliente validou que a comparação é útil para a tomada de decisão. | 3 |
| #14 | Como líder de equipe, desejo ter acesso a manuais claros de uso para que meu time opere o sistema com autonomia. | - Funcionalidades das sprints anteriores concluídas;</br> - Estrutura dos manuais definida;</br> - Público-alvo dos manuais definido. | - Manuais publicados em `/docs` cobrindo todas as funcionalidades;</br> - Linguagem acessível e revisada pela equipe;</br> - Líder de equipe validou que o material permite uso autônomo do sistema. | 3 |

---

## Tasks

| ID | Descrição | Definição de Pronto | Definição de Feito | Estimativa |
|:---|:---|:---|:---|:---:|
| #10-1 | Definir os indicadores que poderão ser filtrados no dashboard. | - Indicadores disponíveis na API mapeados. | - Documento `.md` em `/docs` listando os filtros disponíveis;</br> - Revisado pela equipe. | 1 |
| #10-2 | Implementar componentes de filtro no frontend do dashboard. | - Layout aprovado;</br> - Estrutura de dados conhecida. | - Filtros funcionando e atualizando os dados exibidos;</br> - Código revisado pela equipe. | 2 |
| #10-3 | Integrar filtros com a API para retornar dados filtrados. | - Task #10-2 em andamento. | - API respondendo corretamente conforme os filtros aplicados;</br> - Testes realizados com múltiplos cenários. | 1 |
| #11-1 | Implementar checkbox para alternar entre macro e microrregiões. | - Estrutura geográfica dos dados definida. | - Checkbox funcional no dashboard. | 1 |
| #11-2 | Ajustar chamadas da API para retornar dados conforme o nível regional selecionado. | - Task #11-1 concluída. | - Dados atualizados corretamente ao alternar regiões. | 2 |
| #12-1 | Definir formatos de exportação de dados (PDF, CSV, XLSX, XML). | - Reunião da equipe realizada. | - Documento `.md` justificando os formatos escolhidos. | 1 |
| #12-2 | Implementar geração de arquivos na API. | - Task #12-1 concluída. | - API gerando arquivos corretamente. | 2 |
| #12-3 | Implementar botão de exportação no dashboard. | - Task #12-2 em andamento. | - Arquivos sendo baixados corretamente pelo usuário. | 1 |
| #13-1 | Definir indicadores exibidos na comparação entre regiões. | - Indicadores disponíveis mapeados. | - Documento `.md` descrevendo a comparação. | 1 |
| #13-2 | Implementar rota na API para fornecer dados comparativos. | - Task #13-1 concluída. | - API retornando dados de duas regiões. | 2 |
| #13-3 | Implementar tela de comparação no dashboard. | - Layout aprovado. | - Comparação visual funcionando no frontend. | 2 |
| #14-1 | Elaborar manual de uso do sistema para usuários finais. | - Funcionalidades estáveis. | - Manual em `/docs` cobrindo login, dashboard, filtros e exportação. | 2 |
| #14-2 | Elaborar manual técnico de instalação e execução do projeto. | - Ambiente do projeto definido. | - Documento com instruções completas de instalação. | 2 |
| #14-3 | Revisar e consolidar toda a documentação do projeto. | - Documentos anteriores disponíveis. | - `README.md` atualizado com índice da documentação. | 1 |
