# MANUAL DO USUÁRIO - PLATAFORMA REAL IT

## 1. Visão Geral: Inteligência Geográfica
A tela de Inteligência Geográfica é o principal painel de análise da plataforma REAL IT. Ela foi desenvolvida para cruzar dados públicos (SCR, IBGE e Pix) e fornecer uma visão clara sobre oportunidades de expansão de crédito no Brasil. Esta tela permite que o usuário identifique rapidamente as regiões mais seguras para fomento de crédito e as regiões com maior risco de inadimplência ou saturação de mercado.

### 1.1. Navegação e Controles Superiores
Na barra lateral esquerda e no menu superior, você encontrará os controles gerais de navegação:
* **Menu Principal:** Permite alternar entre as telas de Início, Gráficos (tela atual) e Relatórios. O menu pode ser recolhido clicando em `< MENU` para ampliar a área de visualização dos dados.
* **Perfil de Usuário:** Localizado no canto superior direito, exibe o usuário logado e seu nível de acesso (ex: Administrador).
* **Barra de Ação:** Apresenta um toggle (chave) para Visualização por Região/ Visualização por Estado, permitindo agrupar os dados por blocos regionais ou detalhar por Estados (UF).

### 1.2. Mapa Interativo
O mapa do Brasil centraliza a interação geográfica.
* **Seleção por Região:** Clique em qualquer região (Norte, Nordeste, Centro-Oeste, Sul ou Sudeste) para filtrar e destacar automaticamente os resultados nos gráficos laterais.
* **Seleção por estado:** Clique em qualquer estado (UF) para filtrar e destacar automaticamente os resultados no mapa. Opção de mapa de calor serve como legenda visual para facilitar a distinção rápida entre os blocos do país durante as apresentações e análises.

### 1.3. Painéis de Score (Barras Empilhadas)
O sistema consolida variáveis em duas notas unificadas, que variam numa escala de 1.0 a 5.0. O gráfico de barras empilhadas mostra a composição exata da nota de cada região.
* **Risco de Crédito (Eixo I):** Mede a segurança para a concessão de crédito. Atenção: Quanto MAIOR a nota (próxima a 5.0), MAIOR é o risco de calote e o perigo da operação. A barra é composta por quatro indicadores: Inadimplência Real (maior peso), Fragilidade de Renda, Aging da Dívida (tempo de atraso) e Vulnerabilidade Social (escolaridade).
* **Inclusão Demográfica (Eixo II):** Mede o potencial e a saturação do mercado. Atenção: Quanto MAIOR a nota (próxima a 5.0), MAIS SATURADO e populoso é o mercado. Notas menores indicam mercados ainda pouco explorados. A barra é composta por quatro indicadores: Maturidade Pix (volume de uso), Crescimento Populacional, População Absoluta e Bônus Demográfico (juventude da região).

### 1.4. Gráficos de Evolução e Projeção Temporal
Esses gráficos de linha permitem entender o comportamento dos mercados ao longo do tempo.
* **Evolução Comparativa dos Scores RC e IE:** Mostra o histórico de como o Risco e a Inclusão se comportaram nas regiões/estados selecionados. É ideal para identificar se uma região está melhorando ou piorando antes de tomar uma decisão.
* **Projeção do Score RC e IE:** Utiliza os dados históricos para traçar uma linha de tendência futura. Uma linha divisória vertical indica o marco "Hoje", separando o histórico consolidado das estimativas preditivas do sistema para os próximos meses.

---

## 2. Visão Granular: Ranking por Estado
A tela de Ranking por Estado oferece um aprofundamento da visualização geográfica. Em vez de analisar os grandes blocos regionais, o usuário tem acesso a um comparativo linear e detalhado de todas as 27 Unidades da Federação (UFs). Esta visualização é fundamental para identificar discrepâncias dentro de uma mesma região (por exemplo, um único estado com risco muito elevado que possa estar puxando a média da região inteira para cima).

### 2.1. Gráfico: Performance de Crédito por UF (Eixo I)
Este painel detalha o nível de Risco de Crédito (RC) de cada estado brasileiro de forma individualizada, em uma escala normalizada de 1.0 a 5.0.
* **Como interpretar:** Procure pelas barras mais baixas se o objetivo for segurança na concessão. Estados com a nota total mais alta (próxima a 5.0) apresentam o maior risco de inadimplência e perigo na operação.
* **Composição visual:** As fatias coloridas dentro de cada barra mostram exatamente qual fator está pesando mais para aquela nota (ex: permitindo identificar se o alto risco do estado é causado pela Inadimplência Real ou pela alta Vulnerabilidade Social).

### 2.2. Gráfico: Maturidade de Mercado por UF (Eixo II)
Este painel detalha a Inclusão e Expansão Demográfica (IE) de cada estado, também na escala de 1.0 a 5.0.
* **Como interpretar:** Avalia o nível de saturação e o potencial futuro do estado. Barras altas (próximas a 5.0) indicam mercados muito saturados, superpopulosos e com alta adoção financeira. Barras menores (próximas a 1.0) indicam mercados com baixa inclusão e demanda possivelmente reprimida.
* **Composição visual:** Permite ao analista identificar se a nota do estado é impulsionada, por exemplo, por uma alta População Absoluta (mercado endereçável) ou por uma alta Maturidade Pix.

### 2.3. Dinâmica de Análise
A principal utilidade desta tela é permitir o cruzamento visual dos dados. Ao localizar um estado específico no primeiro gráfico (Eixo I) e comparar com o seu desempenho exato no segundo gráfico (Eixo II), o usuário extrai as duas "coordenadas" necessárias para aplicar o estado na Matriz Estratégica de Tomada de Decisão.

---

## 3. Visão Aprofundada: Nível Regional
A tela de Nível Regional foi desenhada para realizar um aprofundamento nos dados. Enquanto a visão inicial mostra o país como um todo, esta seção permite que o analista isole uma região específica para comparar o desempenho dos estados que a compõem de forma direta.

### 3.1. Filtros de Navegação Regional
No topo da tela, os botões de seleção rápida (Norte, Nordeste, C-Oeste, Sul, Sudeste) funcionam como o filtro principal. Ao clicar em uma região, toda a tela é reatualizada dinamicamente para carregar apenas os dados pertencentes àquele bloco.

### 3.2. Rankings de Indicadores Específicos
À direita, o painel desmembra o Score consolidado e exibe o ranking dos estados em três dos indicadores brutos mais críticos para a operação de crédito.

---

## 4. Visão Detalhada: Nível Estadual
O ecrã de Nível Estadual representa o grau máximo de detalhe geográfico na plataforma. O seu principal objetivo é permitir uma análise profunda de uma única Unidade da Federação (UF). Nesta vista, os dados do estado selecionado são sempre colocados lado a lado com a média da sua respetiva região e com a média nacional, permitindo avaliar se o estado está a ter um desempenho acima ou abaixo do esperado no cenário macroeconómico.

### 4.1. Seleção e Filtro de Estado
Na parte superior do ecrã, o utilizador encontra um painel expansivo com botões para as 27 UFs.

### 4.2. Perfil Geográfico e Identificação
O painel à esquerda apresenta o mapa isolado do estado selecionado.

### 4.3. Painéis Comparativos
Os gráficos à direita desdobram as variáveis financeiras e demográficas essenciais que compõem os Eixos de Risco e Inclusão.

---

## 5. Visão Consolidada: Painel Estratégico
A tela de Painel Estratégico é a página inicial (Home) do sistema. O seu principal objetivo é fornecer um resumo sobre a base de dados atual, sem que o usuário precise navegar imediatamente pelos gráficos geográficos complexos.

### 5.1. Indicadores Chave de Desempenho (KPIs)
No topo da tela, quatro cartões fornecem um retrato instantâneo do cenário macroeconômico analisado pelo sistema:
* **Risco de Crédito Médio (Eixo I):** Exibe a média nacional atual do risco de inadimplência.
* **Inclusão Média (Eixo II):** Exibe a média nacional da tração tecnológica (Pix) e do crescimento demográfico.
* **Cobertura (UFs):** Indica quantos estados estão atualmente com os dados sincronizados e processados no banco.
* **Oportunidades ('Diamante'):** Um contador de destaque que avisa ao usuário quantos estados, no processamento atual, atingiram a classificação máxima de "Diamante Bruto" (baixo risco e baixa inclusão/alta demanda) na Matriz Estratégica.

### 5.2. Acesso à Matriz de Oportunidades
O grande bloco central azul funciona como um atalho e um lembrete da regra de negócio central da plataforma. Ele explica resumidamente como a modelagem cruza a vulnerabilidade (Eixo I) com a expansão (Eixo II).

### 5.3. Dicas de Interpretação (Rodapé)
Abaixo do bloco central, dois painéis servem como um guia para o analista não esquecer a regra de ouro dos eixos:
* **Atenção ao Eixo I (Risco):** Relembra que notas próximas a 5 exigem políticas cautelosas devido à alta inadimplência.
* **Foco no Eixo II (Expansão):** Relembra que a alta maturidade digital reduz o custo operacional da financeira.

### 5.4. Atividade do Sistema (Monitoramento de ETL)
O painel lateral direito, Atividade do Sistema, traz uma transparência técnica fundamental para a confiabilidade dos dados.
* **Sincronização BCB/IBGE:** Informa quando foi a última vez que os dados brutos governamentais foram baixados e inseridos no banco.
* **Matriz de Decisão:** Informa quando o motor de cálculo rodou pela última vez para reprocessar e normalizar (fórmula Min-Max) os scores dos estados. Isso garante ao analista que ele está tomando decisões com base nos cálculos mais recentes.

* **Matriz estratégica de tomada de decisão**

| Risco (RC) | Inclusão (IE) | Diagnóstico | Estratégia Recomendada |
| :--- | :--- | :--- | :--- |
| Baixo(1‑2) | Baixo(1‑2) | DIAMANTE BRUTO | Fomento Imediato. Público seguro com demanda. |
| Baixo(1‑2) | Médio(2‑4) | POTENCIAL EMERGENTE | Boa segurança. Oportunidade de acelerar a aquisição de clientes antes que o mercado sature. |
| Baixo(1‑2) | Alto(4‑5) | MERCADO MADURO | Oceano Vermelho. Foco em fidelização e taxas baixas. |
| Médio(2‑4) | Baixo(1‑2) | EXPANSÃO CAUTELOSA | Demanda reprimida, mas risco requer atenção. Testar limites de crédito menores e aumentar progressivamente. |
| Médio(2‑4) | Médio(2‑4) | CRESCIMENTO ORGÂNICO | Ponto de equilíbrio. Estratégia padrão de crédito com monitoramento contínuo das safras de clientes. |
| Médio(2‑4) | Alto(4‑5) | DEFESA DE MERCADO | Região com alta concorrência e risco moderado. Foco em rentabilizar a base atual com produtos complementares. |
| Alto(4‑5) | Baixo(1‑2) | FOMENTO SOCIAL | Alto risco. Requer garantias governamentais. |
| Alto(4‑5) | Médio(2‑4) | RETENÇÃO RESTRITA | Risco elevado sem o benefício da alta demanda populacional. Manter carteira atual e restringir novas concessões. |
| Alto(4‑5) | Alto(4‑5) | SATURAÇÃO | Risco de superendividamento. Recomenda-se cautela. |
