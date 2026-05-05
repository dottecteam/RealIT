
export const OPCOES_VISIBILIDADE = [
    {id: "inadimplencia", texto: "Ranking de Inadimplência Real"},
    {id: "composicao", texto: "Composição da Carteira"},
    {id: "aging", texto: "Aging da Dívida"},
    {id: "escolarizacao", texto: "Taxa de Escolarização"},
    {id: "maturidade", texto: "Maturidade do PIX"},
    {id: "radar", texto: "Radar Comparativo"},
    {id: "projecao", texto: "Projeção do Score RC e IE"},
    {id: "evolucao", texto: "Evolução da Carteira"}
];

export const SECOES_FILTRO = [
    {categoria: "Endividamento", opcoes: ["% da renda", "Comprometimento da renda", "Endividamento por tipo de crédito"]},
    {categoria: "Dados PIX", opcoes: ["Valor total movimentado", "Valor médio transação", "Percentual de crescimento"]},
    {categoria: "Credituário", opcoes: ["Crédito pessoal", "Consignado", "Financiamento imobiliário"]},
];

export const OPCOES_DOWNLOAD = [
    {id: "csv", texto: "Download em CSV"},
    {id: "excel", texto: "Download em Excel"},
    {id: "pdf", texto: "Download em PDF"}
];