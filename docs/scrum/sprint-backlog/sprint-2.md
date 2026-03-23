# Backlog da Sprint 2

| ID | User Story | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #5 | Como tomador de decisão, desejo visualizar um **mapa interativo** para compreender a distribuição geográfica do potencial de mercado. | - Biblioteca de mapas escolhida e documentada;</br> - Dados geográficos com Score disponíveis na API;</br> - Layout da visualização aprovado pela equipe. | - Mapa exibindo todas as regiões com cores proporcionais ao Score;</br> - Interação de hover exibindo informações da região;</br> - Dados consumidos corretamente da API. | 8 |
| #6 | Como gestor de expansão, desejo acessar uma **tabela de ranking regional** para priorizar investimentos nos estados de melhor desempenho. | - Critérios de ordenação do ranking definidos;</br> - Endpoint de ranking disponível na API;</br> - Layout da tabela aprovado pela equipe. | - Tabela exibindo os estados ordenados por Score;</br> - Dados carregados corretamente da API;</br> - Informações claras e compreensíveis para o gestor. | 5 |
| #7 | Como usuário do dashboard, desejo aplicar **filtros nos indicadores** para analisar diferentes cenários e regiões. | - Indicadores filtráveis definidos pela equipe;</br> - Endpoints da API suportando parâmetros de filtro;</br> - Layout dos filtros aprovado. | - Filtros aplicados atualizando os dados exibidos no dashboard;</br> - API respondendo corretamente com os parâmetros enviados;</br> - Experiência de uso validada pela equipe. | 5 |
| #8 | Como usuário do dashboard, desejo alternar entre **macro e micro através de um filtro** para analisar o mercado em diferentes níveis de granularidade. | - Níveis de granularidade definidos (ex: estado vs. mesorregião);</br> - Dados de ambos os níveis disponíveis na API;</br> - Comportamento do filtro validado pela equipe. | - Filtro de alternância funcionando e atualizando mapa e tabela;</br> - Dados de macro e microrregiões exibidos corretamente;</br> - Transição entre níveis sem quebrar a interface. | 5 |

---

## Tasks

| ID | Descrição | Definição de Pronto | Definição de Feito | Estimativa |
|:---:|:---|:---|:---|:---:|
| #5-1 | Pesquisar e definir a biblioteca de mapas a ser utilizada (Mapbox, Leaflet ou similar). | - Requisitos visuais do mapa definidos pela equipe. | - Biblioteca escolhida, justificativa documentada em `/docs` e dependência instalada no projeto. | 1 |
| #5-2 | Criar endpoint na API para fornecer dados geográficos com o Score por região. | - Score disponível no banco de dados. | - Endpoint retornando coordenadas geográficas e Score de cada região em formato JSON. | 2 |
| #5-3 | Configurar e renderizar o mapa base no frontend com as regiões delimitadas. | - Biblioteca instalada;</br> - Endpoint de dados geográficos disponível. | - Mapa renderizando corretamente o território com as divisões regionais visíveis. | 3 |
| #5-4 | Implementar colorização do mapa com base no Score de cada região. | - Mapa base renderizando corretamente. | - Regiões coloridas de forma proporcional ao Score, com legenda de cores visível. | 3 |
| #5-5 | Implementar interatividade de hover no mapa. | - Colorização do mapa concluída. | - Ao passar o mouse sobre uma região, um tooltip exibe o nome e o Score daquela área. | 2 |
| #6-1 | Criar endpoint na API para retornar o ranking regional ordenado por Score. | - Score disponível no banco de dados. | - Endpoint `/ranking` retornando os estados em ordem decrescente de Score. | 2 |
| #6-2 | Implementar componente de tabela de ranking no frontend. | - Endpoint de ranking disponível. | - Tabela exibindo os estados com suas posições e Scores, carregada a partir da API. | 3 |
| #6-3 | Estilizar e garantir responsividade da tabela de ranking. | - Tabela funcional renderizando dados. | - Tabela com visual consistente ao restante do dashboard e funcionando corretamente em diferentes tamanhos de tela. | 2 |
| #7-1 | Adicionar suporte a parâmetros de filtro nos endpoints existentes da API. | - Indicadores filtráveis definidos pela equipe. | - Endpoints aceitando e respondendo corretamente a parâmetros de filtro por indicador e região. | 3 |
| #7-2 | Implementar componente visual dos filtros no frontend. | - Layout dos filtros aprovado pela equipe. | - Filtros renderizados na interface com as opções disponíveis para seleção. | 2 |
| #7-3 | Implementar lógica de atualização do dashboard ao aplicar filtros. | - Componente de filtros renderizando;</br> - Endpoints com suporte a filtros prontos. | - Ao selecionar um filtro, mapa e tabela atualizam os dados exibidos sem recarregar a página. | 3 |
| #8-1 | Adicionar suporte a granularidade (macro e micro) nos endpoints da API. | - Níveis de granularidade definidos pela equipe. | - Endpoints retornando dados segmentados por macrorregião ou microrregião conforme parâmetro recebido. | 3 |
| #8-2 | Implementar componente de alternância entre macro e microrregiões no frontend. | - Endpoint com suporte a granularidade disponível. | - Checkbox ou toggle visível no dashboard para alternância entre os níveis de granularidade. | 2 |
| #8-3 | Integrar o filtro de granularidade ao mapa e à tabela de ranking. | - Toggle de alternância implementado. | - Ao alternar entre macro e micro, mapa e tabela atualizam os dados corretamente sem quebrar a interface. | 3 |
| #9-1 | Implementar design system básico do dashboard (cores, tipografia, componentes base). | - Identidade visual do projeto definida pela equipe. | - Arquivo de estilos globais criado com variáveis de cor, fontes e componentes reutilizáveis aplicados em todo o dashboard. | 3 |
| #9-2 | Garantir responsividade geral do dashboard. | - Todas as telas e componentes do dashboard implementados. | - Dashboard funcionando corretamente em resoluções de desktop e tablet, sem quebras visuais. | 3 |
| #9-3 | Documentar os novos endpoints criados na Sprint 2. | - Todos os endpoints da sprint finalizados e testados. | - Documento `.md` atualizado em `/docs` com exemplos de requisição e resposta para cada novo endpoint. | 2 |
| #9-4 | Realizar testes de integração entre frontend e API para as funcionalidades da sprint. | - Mapa, ranking e filtros implementados e conectados à API. | - Fluxo completo validado: dados saindo da API e sendo exibidos corretamente em cada componente do dashboard. | 3 |