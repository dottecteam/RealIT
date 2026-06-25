
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

export interface SecaoIndicador {
    categoria: string;
    opcoes: { id: string; texto: string }[];
}

export const SECOES_FILTRO: SecaoIndicador[] = [
    {
        categoria: "Risco de Crédito (Eixo I)",
        opcoes: [
            { id: "inadimplenciaReal",     texto: "Inadimplência Real" },
            { id: "fragilidadeRenda",      texto: "Fragilidade de Renda" },
            { id: "agingDivida",           texto: "Aging da Dívida" },
            { id: "vulnerabilidadeSocial", texto: "Vulnerabilidade Social" },
        ],
    },
    {
        categoria: "Inclusão e Expansão (Eixo II)",
        opcoes: [
            { id: "maturidadePix",           texto: "Maturidade do PIX" },
            { id: "crescimentoPopulacional", texto: "Crescimento Populacional" },
            { id: "populacaoAbsoluta",       texto: "População Absoluta" },
            { id: "bonusDemografico",        texto: "Bônus Demográfico" },
        ],
    },
];

export const OPCOES_DOWNLOAD = [
    {id: "csv", texto: "Download em CSV"},
    {id: "excel", texto: "Download em Excel"},
    {id: "pdf", texto: "Download em PDF"}
];