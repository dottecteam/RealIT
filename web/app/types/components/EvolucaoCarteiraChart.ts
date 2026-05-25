export interface EvolucaoCarteiraChartProps {
  categories: string[]
  carteiraAtiva: number[]
  taxaInadimplencia: (number | null)[]
  taxaInadRegiao: (number | null)[]
  taxaInadNacional: (number | null)[]
  ufSigla: string
}
