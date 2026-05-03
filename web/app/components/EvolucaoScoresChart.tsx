"use client"
import { useMemo } from "react"
import { ChartCard } from "./ChartCard"
import { ReactApexChart } from "../hooks/useApexChart"
import { createLineOptions } from "../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_EVO, DASHES_DEFAULT_EVO } from "../constants/ChartOptions"
import { EvolucaoScoresChartProps } from "../types/components/EvolucaoScoresChart"

export function EvolucaoScoresChart({ categorias, series, cores, dashArray, info, onClose }: EvolucaoScoresChartProps) {
  const options = useMemo(() => createLineOptions({
    categorias,
    cores:  cores  ?? CORES_DEFAULT_EVO,
    dashes: dashArray ?? DASHES_DEFAULT_EVO,
    tooltipFontSize: "12px",
  }), [categorias, cores, dashArray])

  return (
    <ChartCard title="Evolução Comparativa dos Scores RC e IE" info={info} onClose={onClose}>
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
    </ChartCard>
  )
}