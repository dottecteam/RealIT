"use client"
import dynamic from "next/dynamic"
import { ChartCard } from "./ChartCard"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface SeriesData {
  name: string
  data: (number | null)[]
}

interface ProjecaoScoreChartProps {
  categorias: string[]
  series: SeriesData[]
  marcadorProjecao?: string
  info?: string
}

const CORES = ["#FF9A98", "#FF9A98", "#7DF4ED", "#7DF4ED"]
const DASHES = [0, 6, 0, 6]

export function ProjecaoScoreChart({ categorias, series, marcadorProjecao, info }: ProjecaoScoreChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
    colors: CORES,
    stroke: { curve: "smooth", width: 2.5, dashArray: DASHES },
    markers: { size: [0, 4, 0, 4] },
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
    annotations: marcadorProjecao ? {
      xaxis: [{
        x: marcadorProjecao,
        borderColor: "#ccc",
        strokeDashArray: 5,
        label: {
          text: "início da projeção",
          style: { color: "#999", background: "transparent", fontSize: "10px" },
        },
      }],
    } : {},
    legend: {
      position: "bottom",
      fontSize: "11px",
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
    <ChartCard title="Projeção do Score RC e IE" info={info}>
      <ReactApexChart options={options} series={series} type="line" height={280} width="100%" />
    </ChartCard>
  )
}