"use client"
import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { createLineOptions } from "../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_EVO, DASHES_DEFAULT_EVO } from "../constants/ChartOptions"
import { EvolucaoScoresChartProps } from "../types/components/EvolucaoScoresChart"

export function EvolucaoScoresChart({ categorias, series, cores, dashArray }: EvolucaoScoresChartProps) {
  const options = useMemo(() => createLineOptions({
    categorias,
    cores: cores ?? CORES_DEFAULT_EVO,
    dashes: dashArray ?? DASHES_DEFAULT_EVO,
    tooltipFontSize: "12px",
  }), [categorias, cores, dashArray])

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