export interface SeriesData {
  name: string
  data: (number | null)[]
}

export interface ProjecaoScoreChartProps {
  categorias: string[]
  series: SeriesData[]
  marcadorProjecao?: string
  info?: string
}