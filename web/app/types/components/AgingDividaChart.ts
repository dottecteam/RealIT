export interface AgingDividaChartItem {
  uf: string
  aging: number
}

export interface AgingDividaChartProps {
  ranking: AgingDividaChartItem[]
  agingRegiao: number
  agingNacional: number
  regiao: string
}
