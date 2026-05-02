"use client"
import dynamic from "next/dynamic"
import { ChartCard } from "./ChartCard"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface SeriesData {
  name: string
  data: number[]
}

interface EvolucaoScoresChartProps {
  categorias: string[]
  series: SeriesData[]
  cores?: string[]
  dashArray?: number[]
  info?: string
  onClose?: () => void
}

const CORES_DEFAULT = ["#7DF4ED","#7DF4ED","#FF9A98","#FF9A98","#FFE372","#FFE372","#68E699","#68E699"]
const DASHES_DEFAULT = [0,6,0,6,0,6,0,6]

export function EvolucaoScoresChart({ categorias, series, cores, dashArray, info, onClose }: EvolucaoScoresChartProps) {
  const CORES = cores ?? CORES_DEFAULT
  const DASHES = dashArray ?? DASHES_DEFAULT

  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
    colors: CORES,
    stroke: { curve: "smooth", width: 2.5, dashArray: DASHES },
    markers: { size: 0 },
    xaxis: {
      categories: categorias,
      labels: { rotate: -30, style: { fontSize: "11px", colors: "#908f8f" } },
    },
    yaxis: {
      min: 1,
      max: 5,
      tickAmount: 4,
      labels: {
        formatter: (v: number | null) => v != null ? v.toFixed(1) : "",
        style: { colors: "#ADADAD", fontSize: "12px" },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "10px",
      markers: {
        customHTML: CORES.map((cor, i) => () => {
          const dashed = DASHES[i] > 0
          return `<svg width="22" height="6" style="display:inline-block;vertical-align:middle">
            <line x1="0" y1="3" x2="22" y2="3"
              stroke="${cor}"
              stroke-width="2.5"
              stroke-dasharray="${dashed ? "5,3" : "none"}"
            />
          </svg>`
        }) as any,
      },
    },
    grid: { borderColor: "#f0f0f0", strokeDashArray: 4 },
    tooltip: { theme: "light", shared: true, intersect: false },
  }

  return (
    <ChartCard title="Evolução Comparativa dos Scores RC e IE" info={info} onClose={onClose}>
      <ReactApexChart options={options} series={series} type="line" height={280} width="100%" />
    </ChartCard>
  )
}