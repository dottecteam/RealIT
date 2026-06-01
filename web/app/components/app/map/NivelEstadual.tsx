"use client";

import { useState, useMemo } from "react";
import { BRASIL_PATHS, REGIOES_CONFIG } from "@/app/constants/map/brasilMapPaths";

import { LevelHeader } from "./LevelHeader";
import { UFMapRenderer } from "./UFMapRenderer";
import { UFSelectButtons } from "./UFSelectButtons";
import { EstadualChartPlaceholders } from "./EstadualChartPlaceholders";

interface NivelEstadualProps {
  children?: React.ReactNode;
  onUFChange?: (uf: string) => void;
  active?: string;
}

export function NivelEstadual({ children, onUFChange, active = "AC" }: NivelEstadualProps) {
  const [activeUF, setActiveUF] = useState<string>(active);

  const estadoAtivo = useMemo(() => BRASIL_PATHS.find((p) => p.uf === activeUF)!, [activeUF]);
  const regiaoConfig = useMemo(() => REGIOES_CONFIG[estadoAtivo.regiao], [estadoAtivo]);

  const handleUFChange = (uf: string) => {
    setActiveUF(uf);
    onUFChange?.(uf);
  };

  return (
    <section className="space-y-6 pt-4">
      <LevelHeader
        title="Nível Estadual"
        desc="Análise detalhada por estado selecionado."
        colorClass="bg-secondary"
      />

      <div className="flex flex-wrap gap-2">
        <UFSelectButtons active={activeUF} onSelect={handleUFChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 card-base bg-white shadow-xl p-4">
          <UFMapRenderer estado={estadoAtivo} config={regiaoConfig} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          {children ?? <EstadualChartPlaceholders />}
        </div>
      </div>
    </section>
  );
}