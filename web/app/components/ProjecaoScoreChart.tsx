"use client"
import { useMemo } from "react"
import { ChartCard } from "./ChartCard"
import { ReactApexChart } from "../hooks/useApexChart"
import { createLineOptions } from "../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_PRO, DASHES_PRO } from "../constants/ChartOptions"
import { ProjecaoScoreChartProps } from "../types/components/ProjecaoScoreChart"

export function ProjecaoScoreChart({ categorias, series, marcadorProjecao }: ProjecaoScoreChartProps) {
  const options = useMemo(() => createLineOptions({
    categorias,
    cores: CORES_DEFAULT_PRO,
    dashes: DASHES_PRO,
    markerSizes: [0, 4, 0, 4],
    marcadorProjecao,
  }), [categorias, marcadorProjecao])

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: 500 }} className="h-[350px]">
          <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
        </div>
      </div>
    </div>
  )
}