"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { EvolucaoCarteiraChartProps } from "../types/components/EvolucaoCarteiraChart"

export function EvolucaoCarteiraChart({
  categories,
  carteiraAtiva,
  taxaInadimplencia,
  taxaInadRegiao,
  taxaInadNacional,
  ufSigla,
}: EvolucaoCarteiraChartProps) {
  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: [2.5, 2.5, 2, 1.5],
      dashArray: [0, 0, 4, 4],
    },
    colors: ["#2cfff1", "#FF9A98", "#3B82F6", "#F59E0B"],
    markers: { size: [3, 3, 0, 0] },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: { fontSize: "10px", colors: "#908f8f" },
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: "Carteira Ativa",
        title: {
          text: "Carteira Ativa",
          style: { color: "#2cfff1", fontSize: "10px" },
        },
        labels: {
          formatter: (val: number) => val >= 1e9 ? `${(val / 1e9).toFixed(1)}B` : val >= 1e6 ? `${(val / 1e6).toFixed(1)}M` : val.toFixed(0),
          style: { colors: "#2cfff1", fontSize: "10px" },
        },
      },
      {
        seriesName: `Inadimplência ${ufSigla}`,
        opposite: true,
        title: {
          text: "Taxa de Inadimplência",
          style: { color: "#FF9A98", fontSize: "10px" },
        },
        labels: {
          formatter: (val: number | null) => val != null ? `${(val * 100).toFixed(1)}%` : "",
          style: { colors: "#FF9A98", fontSize: "10px" },
        },
      },
      {
        seriesName: "Inadimplência Região",
        show: false,
        opposite: true,
      },
      {
        seriesName: "Inadimplência Brasil",
        show: false,
        opposite: true,
      },
    ],
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (val: number) =>
            val >= 1e9 ? `R$ ${(val / 1e9).toFixed(2)}B` : val >= 1e6 ? `R$ ${(val / 1e6).toFixed(2)}M` : `R$ ${val.toFixed(2)}`,
          title: { formatter: () => "Carteira Ativa: " },
        },
        {
          formatter: (val: number | null) => val != null ? `${(val * 100).toFixed(2)}%` : "—",
          title: { formatter: () => `Inad. ${ufSigla}: ` },
        },
        {
          formatter: (val: number | null) => val != null ? `${(val * 100).toFixed(2)}%` : "—",
          title: { formatter: () => "Inad. Região: " },
        },
        {
          formatter: (val: number | null) => val != null ? `${(val * 100).toFixed(2)}%` : "—",
          title: { formatter: () => "Inad. Brasil: " },
        },
      ],
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "#374151" },
    },
  }), [categories, ufSigla])

  const series = useMemo(() => [
    { name: "Carteira Ativa", data: carteiraAtiva },
    { name: `Inadimplência ${ufSigla}`, data: taxaInadimplencia },
    { name: "Inadimplência Região", data: taxaInadRegiao },
    { name: "Inadimplência Brasil", data: taxaInadNacional },
  ], [carteiraAtiva, taxaInadimplencia, taxaInadRegiao, taxaInadNacional, ufSigla])

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div style={{ minWidth: 420 }} className="h-[300px]">
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
    </div>
  )
}
