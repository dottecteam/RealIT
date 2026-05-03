"use client"
import dynamic from "next/dynamic"
import { ChartCard } from "./ChartCard"
import { CORES_DEFAULT_EVO, DASHES_DEFAULT_EVO } from "../constants/ScoreChartOptions"
import { EvolucaoScoresChartProps } from "../types/components/EvolucaoScoresChart"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function EvolucaoScoresChart({ categorias, series, cores, dashArray, info, onClose }: EvolucaoScoresChartProps) {
  const CORES = cores ?? CORES_DEFAULT_EVO
  const DASHES = dashArray ?? DASHES_DEFAULT_EVO

  const options: ApexCharts.ApexOptions = {
    chart: { 
      type: "line", 
      toolbar: { show: false }, 
      fontFamily: "inherit", 
      animations: { enabled: false },
      selection: { enabled: false }
    },
    colors: CORES,
    stroke: { curve: "smooth", width: 2.5, dashArray: DASHES },
    markers: { size: 0 },
    xaxis: {
      categories: categorias,
      labels: { 
        rotate: -45, 
        style: { fontSize: "10px", colors: "var(--gray-400)" },
        hideOverlappingLabels: true 
      },
      axisBorder: { show: false }
    },
    yaxis: {
      min: 1,
      max: 5,
      tickAmount: 4,
      labels: {
        formatter: (v: number | null) => v != null ? v.toFixed(1) : "",
        style: { colors: "var(--gray-400)", fontSize: "11px" },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "var(--gray-600)" },
      markers: {
        customHTML: CORES.map((cor, i) => () => {
          const dashed = DASHES[i] > 0
          return `<svg width="20" height="6" style="display:inline-block;vertical-align:middle">
            <line x1="0" y1="3" x2="20" y2="3"
              stroke="${cor}"
              stroke-width="2.5"
              stroke-dasharray="${dashed ? "4,2" : "none"}"
            />
          </svg>`
        }) as any,
      },
    },
    grid: { borderColor: "var(--gray-100)", strokeDashArray: 4 },
    tooltip: { 
      theme: "light", 
      shared: true, 
      intersect: false,
      style: { fontSize: '12px' }
    },
  }

  return (
    <ChartCard title="Evolução Comparativa dos Scores RC e IE" info={info} onClose={onClose}>
      <div className="w-full h-[300px] mt-4">
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
    </ChartCard>
  )
}