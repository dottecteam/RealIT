"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { ComposicaoCarteiraChartProps } from "../types/components/ComposicaoCarteiraChart"

const CLASSE_LABELS: Record<string, string> = {
  a: "Classe A",
  b: "Classe B",
  c: "Classe C",
  d: "Classe D",
  e: "Classe E",
}

const CLASSE_CORES = ["#2cfff1", "#68E699", "#FFE372", "#FF9A98", "#FF6B6B"]

export function ComposicaoCarteiraChart({ classes, uf, regiao, nacional, ufSigla }: ComposicaoCarteiraChartProps) {
  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    colors: CLASSE_CORES,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val > 8 ? `${val.toFixed(0)}%` : "",
      style: { fontSize: "10px", fontWeight: 600, colors: ["#1F2937"] },
    },
    xaxis: {
      categories: [ufSigla, "Região", "Brasil"],
      labels: { style: { colors: "#374151", fontSize: "12px", fontWeight: 700 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(0)}%`,
        style: { colors: "#908f8f", fontSize: "11px" },
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "#374151" },
    },
  }), [ufSigla])

  const series = useMemo(() =>
    classes.map((cls, i) => ({
      name: CLASSE_LABELS[cls] ?? cls.toUpperCase(),
      data: [
        Number((uf[i] * 100).toFixed(2)),
        Number((regiao[i] * 100).toFixed(2)),
        Number((nacional[i] * 100).toFixed(2)),
      ],
    })),
    [classes, uf, regiao, nacional]
  )

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={240} width="100%" />
    </div>
  )
}
