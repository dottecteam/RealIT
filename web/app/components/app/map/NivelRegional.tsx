"use client"

import { useState, useMemo } from "react"
import { REGIOES_CONFIG, Regiao, getPathsByRegiao, getViewBoxByRegiao } from "@/app/constants/map/brasilMapPaths"
import { BrasilMapRenderer } from "./BrasilMapRenderer"
import { LevelHeader } from "./LevelHeader"
import { RegionFilterButtons } from "./RegionFilterButtons"

type NivelRegionalProps = {
  children?: React.ReactNode
  onRegiaoChange?: (regiao: Regiao) => void
  active?: Regiao
}

export function NivelRegional({ children, onRegiaoChange, active = "Norte" }: NivelRegionalProps) {
  const [activeRegiao, setActiveRegiao] = useState<Regiao>(active);
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);

  const regiao = REGIOES_CONFIG[activeRegiao];
  const paths = useMemo(() => getPathsByRegiao(activeRegiao), [activeRegiao]);

  return (
    <section className="space-y-6 pt-4">
      <LevelHeader title="Nível Regional" desc="Análise por estados da região selecionada." colorClass="bg-primary" />

      {/* Botões de Filtro */}
      <RegionFilterButtons
        active={activeRegiao}
        onSelect={(k) => { setActiveRegiao(k); onRegiaoChange?.(k); }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card-base bg-white shadow-xl p-4">
          <BrasilMapRenderer
            paths={paths}
            hoveredUF={hoveredUF}
            onHover={setHoveredUF}
            config={regiao}
            fontSize={activeRegiao === "Norte" ? 18 : 10}
            viewBox={getViewBoxByRegiao(activeRegiao)}
          />
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}