"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { EscolarizacaoChartProps } from "../types/components/EscolarizacaoChart"

export function EscolarizacaoChart({ ranking, taxaRegiao, taxaNacional, regiao }: EscolarizacaoChartProps) {
  const ufs = useMemo(() => ranking.map(r => r.uf), [ranking])
  const valores = useMemo(() => ranking.map(r => Number((r.taxa * 100).toFixed(2))), [ranking])
  const mediaRegiao = Number((taxaRegiao * 100).toFixed(2))
  const mediaNacional = Number((taxaNacional * 100).toFixed(2))

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
      },
    },
    colors: ["#68E699"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { fontSize: "10px", colors: ["#374151"], fontWeight: 400 },
      offsetX: 28,
    },
    xaxis: {
      categories: ufs,
      labels: {
        formatter: (val: string) => `${val}%`,
        style: { colors: "#908f8f", fontSize: "11px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#374151", fontSize: "11px", fontWeight: 600 } },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    annotations: {
      xaxis: [
        {
          x: mediaRegiao,
          borderColor: "#3B82F6",
          strokeDashArray: 4,
          label: {
            text: `Reg: ${mediaRegiao.toFixed(1)}%`,
            style: { color: "#3B82F6", background: "#EFF6FF", fontSize: "9px", fontWeight: "bold" },
            position: "bottom",
          },
        },
        {
          x: mediaNacional,
          borderColor: "#F59E0B",
          strokeDashArray: 4,
          label: {
            text: `BR: ${mediaNacional.toFixed(1)}%`,
            style: { color: "#92400E", background: "#FFFBEB", fontSize: "9px", fontWeight: "bold" },
            position: "top",
          },
        },
      ],
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
        title: { formatter: () => "Taxa de escolarização: " },
      },
    },
    legend: { show: false },
  }), [ufs, mediaRegiao, mediaNacional])

  const series = useMemo(() => [{ name: "Taxa de Escolarização", data: valores }], [valores])

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div style={{ minHeight: Math.max(180, ranking.length * 28) }}>
        <ReactApexChart options={options} series={series} type="bar" height={Math.max(180, ranking.length * 28)} width="100%" />
      </div>
      <div className="flex gap-4 px-2 pt-1 flex-wrap">
        <span className="flex items-center gap-1.5 text-[10px] text-blue-600 font-semibold">
          <span className="inline-block w-6 border-t-2 border-dashed border-blue-500" />
          Média {regiao}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold">
          <span className="inline-block w-6 border-t-2 border-dashed border-amber-500" />
          Média Brasil
        </span>
      </div>
    </div>
  )
}
