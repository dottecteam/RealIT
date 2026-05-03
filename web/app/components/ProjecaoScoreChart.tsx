"use client"
import { useMemo } from "react"
import { ChartCard } from "./ChartCard"
import { ReactApexChart } from "../hooks/useApexChart"
import { createLineOptions } from "../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_PRO, DASHES_PRO } from "../constants/ChartOptions"
import { ProjecaoScoreChartProps } from "../types/components/ProjecaoScoreChart"

export function ProjecaoScoreChart({ categorias, series, marcadorProjecao, info }: ProjecaoScoreChartProps) {
  const options = useMemo(() => createLineOptions({
    categorias,
    cores:        CORES_DEFAULT_PRO,
    dashes:       DASHES_PRO,
    markerSizes:  [0, 4, 0, 4],
    marcadorProjecao,
  }), [categorias, marcadorProjecao])

  return (
    <ChartCard title="Projeção do Score RC e IE" info={info}>
      <div className="w-full h-[300px] mt-4">
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
    </ChartCard>
  )
}