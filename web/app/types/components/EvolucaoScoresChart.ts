
export interface SeriesData {
  name: string
  data: number[]
}

export interface EvolucaoScoresChartProps {
  categorias: string[]
  series: SeriesData[]
  cores?: string[]
  dashArray?: number[]
  info?: string
  onClose?: () => void
}