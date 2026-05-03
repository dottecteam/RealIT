"use client"
import dynamic from "next/dynamic"
import { ChartCard } from "./ChartCard"
import { CORES_DEFAULT_PRO, DASHES_PRO } from "../constants/ScoreChartOptions"
import { ProjecaoScoreChartProps } from "../types/components/ProjecaoScoreChart"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function ProjecaoScoreChart({ categorias, series, marcadorProjecao, info }: ProjecaoScoreChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: { 
      type: "line", 
      toolbar: { show: false }, 
      fontFamily: "inherit", 
      animations: { enabled: false } 
    },
    colors: CORES_DEFAULT_PRO,
    stroke: { curve: "smooth", width: 2.5, dashArray: DASHES_PRO },
    markers: { size: [0, 4, 0, 4] },
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
    annotations: marcadorProjecao ? {
      xaxis: [{
        x: marcadorProjecao,
        borderColor: "var(--gray-300)",
        strokeDashArray: 5,
        label: {
          text: "INÍCIO DA PROJEÇÃO",
          style: { 
            color: "var(--gray-500)", 
            background: "transparent", 
            fontSize: "9px",
            fontWeight: "bold" 
          },
        },
      }],
    } : {},
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "var(--gray-600)" },
      markers: {
        customHTML: CORES_DEFAULT_PRO.map((cor, i) => () => {
          const dashed = DASHES_PRO[i] > 0
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
    tooltip: { theme: "light", shared: true, intersect: false },
  }

  return (
    <ChartCard title="Projeção do Score RC e IE" info={info}>
      <div className="w-full h-[300px] mt-4">
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
    </ChartCard>
  )
}