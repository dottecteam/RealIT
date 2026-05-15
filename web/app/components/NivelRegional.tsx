"use client"

import { useState, useMemo } from "react"
import { BRASIL_PATHS, REGIOES_CONFIG, Regiao, getPathsByRegiao, getViewBoxByRegiao } from "@/app/constants/BrasilMapPaths"

type NivelRegionalProps = {
  /** Opcional: passa dados reais para os gráficos quando estiverem prontos */
  data?: any[]
  children?: React.ReactNode // slot para os ChartCards reais
}

export function NivelRegional({ data = [], children }: NivelRegionalProps) {
  const [activeRegiao, setActiveRegiao] = useState<Regiao>("Norte")
  const [hoveredUF, setHoveredUF] = useState<string | null>(null)
  const regiao = REGIOES_CONFIG[activeRegiao]
  const paths = useMemo(() => getPathsByRegiao(activeRegiao), [activeRegiao])
  const viewBox = useMemo(() => getViewBoxByRegiao(activeRegiao), [activeRegiao])
  const fontSize = activeRegiao === "Norte" ? 18 : activeRegiao === "Nordeste" ? 9 : 10

  return (
    <section className="space-y-6 pt-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-2 bg-primary rounded-full" />
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Nível Regional
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Análise por estados da região selecionada.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(REGIOES_CONFIG) as Regiao[]).map((key) => {
          const r = REGIOES_CONFIG[key]
          const isActive = activeRegiao === key
          return (
            <button
              key={key}
              onClick={() => setActiveRegiao(key)}
              className="transition-all duration-150 rounded-full px-4 py-1.5 text-xs font-semibold border"
              style={{
                background: isActive ? r.color : "#fff",
                color: isActive ? "#fff" : "#64748b",
                borderColor: isActive ? r.color : "#e2e8f0",
                boxShadow: isActive ? `0 4px 12px ${r.color}40` : undefined,
                transform: isActive ? "translateY(-1px)" : undefined,
              }}
            >
              {r.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Mapa da Região*/}
        <div className="lg:col-span-4 card-base bg-white shadow-xl flex flex-col gap-3 p-4">

          <div className="flex items-center justify-between min-h-[24px]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {regiao.label} - {paths.length} estados
            </span>
            {hoveredUF && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full transition-all"
                style={{ background: regiao.fill, color: regiao.color }}
              >
                {BRASIL_PATHS.find((p) => p.uf === hoveredUF)?.nome ?? hoveredUF}
              </span>
            )}
          </div>

          <svg viewBox={viewBox} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">

            <defs>
              <filter id="nrShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3"
                  floodColor={regiao.color} floodOpacity="0.3" />
              </filter>
            </defs>

            {paths.map((estado) => {
              const isHovered = hoveredUF === estado.uf
              return (
                <g key={estado.uf}>
                  <path
                    d={estado.d}
                    fill={isHovered ? regiao.color : regiao.fill}
                    stroke={regiao.color}
                    strokeWidth={isHovered ? 1.5 : 0.7}
                    strokeLinejoin="round"
                    filter={isHovered ? "url(#nrShadow)" : undefined}
                    className="cursor-pointer transition-all duration-150"
                    style={{ opacity: isHovered ? 1 : 0.9 }}
                    onMouseEnter={() => setHoveredUF(estado.uf)}
                    onMouseLeave={() => setHoveredUF(null)}
                  />
                  <text
                    x={estado.centroid[0]}
                    y={estado.centroid[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontWeight={700}
                    fill={isHovered ? "#fff" : regiao.color}
                    style={{ pointerEvents: "none", letterSpacing: "0.04em" }}
                  >
                    {estado.uf}
                  </text>
                </g>
              )
            })}
          </svg>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {paths.map((estado) => (
              <span
                key={estado.uf}
                onMouseEnter={() => setHoveredUF(estado.uf)}
                onMouseLeave={() => setHoveredUF(null)}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-lg cursor-default transition-all duration-150"
                style={{
                  background: hoveredUF === estado.uf ? regiao.color : regiao.fill,
                  color: hoveredUF === estado.uf ? "#fff" : regiao.color,
                }}
              >
                {estado.uf}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children ?? <RegionalChartPlaceholders  />}
        </div>
      </div>
    </section>
  )
}

function RegionalChartPlaceholders() {
  const charts = [
    "Taxa de Escolarização (25+ anos)",
    "Aging da Dívida: Proporção Vencida Acima de 90 Dias",
    "Ranking de Inadimplência Real",
    "Radar Comparativo",
  ]

  return (
    <>
      {charts.map((title) => (
        <div key={title} className="card-base bg-white shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-bold text-gray-700 leading-snug">{title}</p>
          </div>
        </div>
      ))}
    </>
  )
}