"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { MaturidadePixChartProps } from "../types/components/MaturidadePixChart"

export function MaturidadePixChart({ qtPerCapita, vlPerCapita, ufSigla }: MaturidadePixChartProps) {
  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        grouped: true,
      },
    },
    colors: ["#2cfff1", "#3B82F6", "#F59E0B"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Transações per capita", "Volume per capita (R$)"],
      labels: { style: { colors: "#374151", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(1),
        style: { colors: "#908f8f", fontSize: "11px" },
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, opts: any) => {
          const isVolume = opts?.dataPointIndex === 1
          return isVolume ? `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : val.toFixed(2)
        },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "#374151" },
    },
  }), [])

  const series = useMemo(() => [
    { name: ufSigla, data: [qtPerCapita.uf, vlPerCapita.uf] },
    { name: "Região", data: [qtPerCapita.regiao, vlPerCapita.regiao] },
    { name: "Brasil", data: [qtPerCapita.nacional, vlPerCapita.nacional] },
  ], [qtPerCapita, vlPerCapita, ufSigla])

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={220} width="100%" />
    </div>
  )
}
