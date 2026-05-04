"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { createBarOptions } from "../services/ApexCharts/createBarOptions"
import { REGIOES } from "../constants/ChartOptions"
import { RankingChartProps } from "../types/components/RankingChart"

const EIXO_META: Record<string, { label: string; descricao: string; cor: string }> = {
  "RC Médio Regional":     { label: "Eixo I — Risco de Crédito",     descricao: "Média ponderada de inadimplência, fragilidade de renda, aging da dívida e vulnerabilidade social. Quanto MAIOR, PIOR.", cor: "#FF9A98" },
  "IE Médio Regional":     { label: "Eixo II — Inclusão e Expansão",  descricao: "Média de maturidade PIX, crescimento e população. Quanto MAIOR, MELHOR.", cor: "#2cfff1" },
  "Risco de Crédito (RC)": { label: "Eixo I — Risco de Crédito",     descricao: "Score normalizado (1–5). Quanto MAIOR, PIOR.", cor: "#FF9A98" },
  "Inclusão e Expansão (IE)": { label: "Eixo II — Inclusão e Expansão", descricao: "Score normalizado (1–5). Quanto MAIOR, MELHOR.", cor: "#2cfff1" },
}

function getMeta(series: RankingChartProps["series"]) {
  const nome = series[0]?.name ?? ""
  return EIXO_META[nome] ?? { label: nome, descricao: "", cor: "#908f8f" }
}

export function RankingChart({ series }: RankingChartProps) {
  const meta = useMemo(() => getMeta(series), [series])

  const options = createBarOptions({
    colors: [meta.cor],
    plotOptions: { bar: { columnWidth: "45%" } },
    xaxis: {
      categories: REGIOES,
      axisBorder: { show: false },
      axisTicks:  { show: false },
      labels: { style: { colors: "#908f8f", fontSize: "12px", fontWeight: 500 } },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val.toFixed(2)} (escala 1–5)`,
        title: { formatter: () => meta.label + ": " },
      },
    },
  })

  return (
    <div className="w-full flex flex-col gap-1">
      {meta.label && (
        <div className="px-1">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: meta.cor + "33", color: meta.cor === "#2cfff1" ? "#0e9488" : "#c0392b" }}
          >
            {meta.label}
          </span>
          {meta.descricao && (
            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{meta.descricao}</p>
          )}
        </div>
      )}
      <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
  )
}