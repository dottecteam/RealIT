export interface EscolarizacaoChartItem {
  uf: string
  taxa: number
}

export interface EscolarizacaoChartProps {
  ranking: EscolarizacaoChartItem[]
  taxaRegiao: number
  taxaNacional: number
  regiao: string
}
