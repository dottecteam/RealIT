"use client"

import { useState, useMemo } from "react"
import { BRASIL_PATHS, REGIOES_CONFIG, getViewBoxByUF } from "@/app/constants/BrasilMapPaths"

const ESTADOS_ORDENADOS = [...BRASIL_PATHS].sort((a, b) =>
  a.nome.localeCompare(b.nome, "pt-BR")
)

type NivelEstadualProps = {
  data?: any[]
  children?: React.ReactNode
}

const UF_COLORS: Record<string, string> = {
  AC: "#68E699", AL: "#FF9A98", AM: "#FFE372", AP: "#4EDAD3", BA: "#FF6B6B",
  CE: "#FFA07A", DF: "#9B59B6", ES: "#3498DB", GO: "#E67E22", MA: "#1ABC9C",
  MG: "#2ECC71", MS: "#E74C3C", MT: "#F39C12", PA: "#16A085", PB: "#8E44AD",
  PE: "#D35400", PI: "#27AE60", PR: "#2980B9", RJ: "#C0392B", RN: "#7F8C8D",
  RO: "#BDC3C7", RR: "#95A5A6", RS: "#34495E", SC: "#1E8BC3", SE: "#BE90D4",
  SP: "#202AD0", TO: "#6C3483",
}

export function NivelEstadual({ data = [], children }: NivelEstadualProps) {
  const [activeUF, setActiveUF] = useState<string>("AC")
  const [isHovered, setIsHovered] = useState(false)
  const estadoAtivo = useMemo(() => BRASIL_PATHS.find((p) => p.uf === activeUF)!, [activeUF])
  const regiaoConfig = useMemo(() => REGIOES_CONFIG[estadoAtivo.regiao], [estadoAtivo])
  const viewBox = useMemo(() => getViewBoxByUF(activeUF), [activeUF])
  const ufColor = UF_COLORS[activeUF] || regiaoConfig.color
  const estadosMenores = ["AL", "DF", "ES", "PB", "RJ", "RN", "SE"]
  const estadosMaiores = ["AM", "MT", "MG", "PA", "RS", "SP"]
  const fontSize = estadosMenores.includes(activeUF) ? 6 : estadosMaiores.includes(activeUF) ? 20 : 14
  const formatarNome = (nome: string) => {
    const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e"]
    return nome.toLowerCase().split(" ").map((palavra, index) => {
        if (index > 0 && palavrasMinusculas.includes(palavra)) {
          return palavra
        }
        return palavra.charAt(0).toUpperCase() + palavra.slice(1)}).join(" ")
    }

  return (
    <section className="space-y-6 pt-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-2 bg-secondary rounded-full" />

        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Nível Estadual
          </h2>

          <p className="text-sm text-gray-400 font-medium">
            Análise detalhada por estado selecionado.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ESTADOS_ORDENADOS.map((estado) => {
          const color = UF_COLORS[estado.uf] || regiaoConfig.color
          const isActive = activeUF === estado.uf

          return (
            <button
              key={estado.uf}
              onClick={() => setActiveUF(estado.uf)}
              className="transition-all duration-150 rounded-full px-3 py-1 text-xs font-semibold border"
              style={{
                background: isActive ? color : "#fff",
                color: isActive ? "#fff" : "#64748b",
                borderColor: isActive ? color : "#e2e8f0",
                boxShadow: isActive ? `0 4px 12px ${color}40` : undefined,
                transform: isActive ? "translateY(-1px)" : undefined,
              }}
            >
              {formatarNome(estado.nome)}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card-base bg-white shadow-xl flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between min-h-6">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {estadoAtivo.nome}
            </span>

            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: `${ufColor}20`,
                color: ufColor,
              }}
            >
              {regiaoConfig.label}
            </span>
          </div>

          <svg
            viewBox={viewBox}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="neShadow">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="5"
                  floodColor={ufColor}
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            <path
              d={estadoAtivo.d}
              fill={isHovered ? ufColor : `${ufColor}25`}
              stroke={ufColor}
              strokeWidth={1.2}
              strokeLinejoin="round"
              filter="url(#neShadow)"
              className="cursor-pointer transition-all duration-200"
              style={{ opacity: isHovered ? 1 : 0.92 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />

            <text
              x={estadoAtivo.centroid[0]}
              y={estadoAtivo.centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight={800}
              fill={isHovered ? "#fff" : ufColor}
              style={{ pointerEvents: "none", letterSpacing: "0.06em" }}
            >
              {estadoAtivo.uf}
            </text>
          </svg>

          <div
            className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-semibold"
            style={{ color: ufColor }}
          >
            <span>
              Cód. IBGE: {estadoAtivo.codIbge}
            </span>

            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ background: `${ufColor}20` }}
            >
              {estadoAtivo.regiao}
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          {children ?? (
            <EstadualChartPlaceholders />
          )}
        </div>
      </div>
    </section>
  )
}

function EstadualChartPlaceholders() {
  const charts = [
    "Maturidade Pix",
    "Composição de Carteira por Classe Social",
    "Evolução da Carteira Ativa e Inadimplência",
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {charts.slice(0, 2).map((title) => (
          <PlaceholderCard
            key={title}
            title={title}
          />
        ))}
      </div>

      <PlaceholderCard
        title={charts[2]}
        tall
      />
    </>
  )
}

function PlaceholderCard({
  title,
  tall = false,
}: {
  title: string
  tall?: boolean
}) {
  return (
    <div className="card-base bg-white shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-bold text-gray-700 leading-snug">
          {title}
        </p>
      </div>

      <div className={`flex-1 rounded-lg flex items-center justify-center ${tall ? "min-h-35" : "min-h-27.5"}`}>
        {/* Conteúdo dos gráficos */}
      </div>
    </div>
  )
}