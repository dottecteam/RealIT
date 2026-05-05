"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../hooks/useApexChart"
import { createBarOptions } from "../services/ApexCharts/createBarOptions"
import { SeriesData } from "../types/components/RankingChart"
import { CATEGORIAS, ESTADOS } from "../constants/ChartOptions"

const EIXO_META: Record<string, { label: string; descricao: string; cores: string[] }> = {
  "Risco de Crédito (RC)": {
    label: "Eixo I — Risco de Crédito",
    descricao: "Score composto (1–5). Quanto MAIOR, PIOR. Formado por: inadimplência real, fragilidade de renda, aging da dívida e vulnerabilidade social.",
    cores: ["#FF9A98"],
  },
  "Inclusão e Expansão (IE)": {
    label: "Eixo II — Inclusão e Expansão",
    descricao: "Score composto (1–5). Quanto MAIOR, MELHOR. Formado por: maturidade PIX, crescimento populacional, população absoluta e bônus demográfico.",
    cores: ["#2cfff1"],
  },
}

function getMeta(series: SeriesData[]) {
  const nome = series[0]?.name ?? ""
  return EIXO_META[nome] ?? { label: nome, descricao: "", cores: ["#908f8f"] }
}

export function RankingStates({ series }: { series: SeriesData[] }) {
  const meta = useMemo(() => getMeta(series), [series])

  const options = createBarOptions({
    colors: meta.cores,
    plotOptions: { bar: { columnWidth: 20 } },
    xaxis: {
      categories: CATEGORIAS,
      axisBorder: { show: false },
      axisTicks:  { show: false },
      labels: { style: { colors: "#908f8f", fontSize: "11px", fontWeight: 600 } },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: { colors: "#374151" },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      x: { formatter: (val: string) => ESTADOS[val] ?? val },
      y: {
        formatter: (val: number) => `${val.toFixed(2)} (escala 1–5)`,
        title: { formatter: () => meta.label + ": " },
      },
    },
    responsive: [{
      breakpoint: 480,
      options: { legend: { position: "bottom", offsetX: -10, offsetY: 0 } },
    }],
  })

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Cabeçalho do eixo */}
      {meta.label && (
        <div className="px-4 pt-3 flex flex-col gap-0.5">
          <span
            className="inline-block self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: meta.cores[0] + "33",
              color: meta.cores[0] === "#2cfff1" ? "#0e9488" : "#c0392b",
            }}
          >
            {meta.label}
          </span>
          {meta.descricao && (
            <p className="text-[10px] text-gray-400 leading-tight">{meta.descricao}</p>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: 900 }} className="h-[420px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}