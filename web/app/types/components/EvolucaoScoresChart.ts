export interface SeriesData {
  name: string
  data: (number | null)[]
}

export interface EvolucaoScoresChartProps {
  categorias: string[]
  series: SeriesData[]
  cores?: string[]
  dashArray?: number[]
  info?: string
  onClose?: () => void
}