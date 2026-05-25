export interface RankingInadimplenciaItem {
  uf: string
  taxa: number
}

export interface RankingInadimplenciaChartProps {
  ranking: RankingInadimplenciaItem[]
  taxaRegiao: number
  taxaNacional: number
  regiao: string
}
