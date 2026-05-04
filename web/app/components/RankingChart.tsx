"use client"

import { ChartCard } from "./ChartCard"
import { ReactApexChart } from "../hooks/useApexChart"
import { createBarOptions } from "../services/ApexCharts/createBarOptions"
import { REGIOES } from "../constants/ChartOptions"
import { RankingChartProps } from "../types/components/RankingChart"

export function RankingChart({ series }: RankingChartProps) {
  const options = createBarOptions({
  plotOptions: { bar: { columnWidth: "45%" } },
  xaxis: {
    categories: REGIOES,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#908f8f", fontSize: "12px", fontWeight: 500 } },
  },
})
  return (
        <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
  )
}