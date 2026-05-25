export interface MaturidadePixMetrica {
  uf: number
  regiao: number
  nacional: number
}

export interface MaturidadePixChartProps {
  qtPerCapita: MaturidadePixMetrica
  vlPerCapita: MaturidadePixMetrica
  ufSigla: string
}
