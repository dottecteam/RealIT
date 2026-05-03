"use client";

import { useState, useCallback, memo } from "react";
import { BRASIL_PATHS } from "../constants/BrasilMapPaths";
import { EstadoPath, TooltipState } from "../types/components/BrasilMap";
import { mockDadosScoreCompleto } from "../mocks/score";
import { useMapContext } from "../contexts/MapContext";
import { getCategoria } from "../utils/mapUtils";
import { REGIAO_COR, UF_COLORS, CATEGORIA_TEXTO, CATEGORIA_CORES } from "../constants/mapColors";
import { EstadoProps } from "../types/components/BrasilMap";

// ─── Sub-componente (MEMOIZADO) ──────────

const EstadoPath_ = memo(function EstadoPath_({
  estado,
  fill,
  isHovered,
  anyHovered,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: EstadoProps) {
  const opacity = anyHovered ? (isHovered ? 1 : 0.38) : 0.88;
  const stroke = isHovered ? "var(--primary)" : "var(--white)";
  const strokeWidth = isHovered ? 1.5 : 0.8;

  return (
    <path
      d={estado.d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      style={{ cursor: "pointer", transition: "opacity 0.18s ease, fill 0.3s ease" }}
      onMouseEnter={(e) => onMouseEnter(e, estado)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    />
  );
});

export function BrasilMap() {
  const { viewMode } = useMapContext();

  const [heatmap, setHeatmap] = useState(false);
  const [hoveredUf, setHoveredUf] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    lines: [],
  });

  const getFill = useCallback(
    (estado: EstadoPath): string => {
      if (heatmap) {
        if (viewMode === "uf") {
          const dados = mockDadosScoreCompleto.dadosScore.find(
            (d) => d.uf === estado.uf
          );
          if (dados) {
            return CATEGORIA_CORES[getCategoria(dados.score_eixo_i, dados.score_eixo_ii)];
          }
        } else {
          const dadosRegiao = mockDadosScoreCompleto.dadosMediaRegiao.find(
            (r) => r.regiao === estado.regiao
          );
          if (dadosRegiao) {
            return CATEGORIA_CORES[
              getCategoria(dadosRegiao.media_score_eixo_i, dadosRegiao.media_score_eixo_ii)
            ];
          }
        }
        return "var(--gray-300)";
      }

      return viewMode === "uf"
        ? (UF_COLORS[estado.uf] ?? "var(--gray-200)")
        : (REGIAO_COR[estado.regiao] ?? "var(--gray-200)");
    },
    [heatmap, viewMode]
  );

  const buildTooltipLines = useCallback(
    (estado: EstadoPath): string[] => {
      const lines: string[] = [];

      if (viewMode === "uf") {
        const dados = mockDadosScoreCompleto.dadosScore.find(
          (d) => d.uf === estado.uf
        );
        if (dados) {
          const categoria = getCategoria(dados.score_eixo_i, dados.score_eixo_ii);
          lines.push(`${estado.nome} (${estado.uf})`);
          lines.push(`Eixo I: ${dados.score_eixo_i}`);
          lines.push(`Eixo II: ${dados.score_eixo_ii}`);
          lines.push(`Inadimplência: ${dados.score_inadimplencia}`);
          lines.push(`Crescimento: ${dados.score_crescimento}`);
          lines.push(`Categoria: ${CATEGORIA_TEXTO[categoria] ?? categoria}`);
        } else {
          lines.push(`${estado.nome} (${estado.uf})`);
        }
      } else {
        const dadosRegiao = mockDadosScoreCompleto.dadosMediaRegiao.find(
          (r) => r.regiao === estado.regiao
        );
        if (dadosRegiao) {
          const categoria = getCategoria(
            dadosRegiao.media_score_eixo_i,
            dadosRegiao.media_score_eixo_ii
          );
          lines.push(`Região ${estado.regiao}`);
          lines.push(`Eixo I (média): ${dadosRegiao.media_score_eixo_i}`);
          lines.push(`Eixo II (média): ${dadosRegiao.media_score_eixo_ii}`);
          lines.push(`Inadimplência (média): ${dadosRegiao.media_inadimplencia}`);
          lines.push(`Crescimento (média): ${dadosRegiao.media_crescimento}`);
          lines.push(`Categoria: ${CATEGORIA_TEXTO[categoria] ?? categoria}`);
        } else {
          lines.push(estado.regiao);
        }
      }

      return lines;
    },
    [viewMode]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, estado: EstadoPath) => {
      setHoveredUf(estado.uf);
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        lines: buildTooltipLines(estado),
      });
    },
    [buildTooltipLines]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) =>
      prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredUf(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);


  function renderLegenda() {
    if (heatmap) {
      return (
        <>
          {Object.entries(CATEGORIA_TEXTO).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: CATEGORIA_CORES[key] }}
              />
              <span className="text-gray-600 font-medium">{label}</span>
            </div>
          ))}
        </>
      );
    }

    if (viewMode === "uf") {
      return (
        <p className="text-xs text-gray-400 italic">
          Cada estado exibe sua própria cor identificadora.
        </p>
      );
    }

    return (
      <>
        {Object.entries(REGIAO_COR).map(([regiao, cor]) => (
          <div key={regiao} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: cor }} />
            <span className="text-gray-600 font-medium">{regiao}</span>
          </div>
        ))}
      </>
    );
  }


  const anyHovered = hoveredUf !== null;

  return (
    <div className="card-base flex flex-col w-full h-fit min-h-[600px] relative overflow-hidden">
      <div className="mb-6 text-center shrink-0">
        <h3 className="text-xl font-black text-primary uppercase tracking-tight">
          Mapa Brasil <span className="text-gray-400 font-medium">/ {viewMode == "uf" ? "UF" : "Região"}</span>
        </h3>
      </div>

      <div className="mb-4 shrink-0 px-4">
        <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={heatmap}
            onChange={() => setHeatmap((prev) => !prev)}
          />
          <span className="text-sm font-bold text-gray-600">Modo mapa de calor</span>
        </label>
      </div>

      {/* SVG do mapa*/}
      <div className="flex-1 flex justify-center items-center w-full relative px-4">
        <svg
          viewBox="0 0 800 691"
          className="w-full h-full max-h-[500px] drop-shadow-2xl select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {BRASIL_PATHS.map((estado) => (
            <EstadoPath_
              key={estado.uf}
              estado={estado}
              fill={getFill(estado)}
              isHovered={hoveredUf === estado.uf}
              anyHovered={anyHovered}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          ))}

          {/* Labels de UF */}
          {BRASIL_PATHS.map((estado) => (
            <text
              key={`label-${estado.uf}`}
              x={estado.centroid[0]}
              y={estado.centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-black pointer-events-none select-none"
              style={{ fontSize: "11px", paintOrder: "stroke", stroke: "rgba(0,0,0,0.3)", strokeWidth: "2.5px" }}
            >
              {estado.uf}
            </text>
          ))}
        </svg>
      </div>

      {/* Legenda */}
      <div className="w-full mt-6 py-4 flex flex-wrap gap-x-6 gap-y-2 text-[10px] sm:text-xs justify-center shrink-0 border-t border-gray-100">
        {renderLegenda()}
      </div>

      {/* Tooltip*/}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            pointerEvents: "none",
            backgroundColor: "var(--primary)",
            zIndex: 9999,
          }}
          className="text-white text-xs px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10"
        >
          {tooltip.lines.map((line, i) => (
            <div key={i} className={i === 0 ? "font-black text-secondary border-b border-white/10 mb-1 pb-1 uppercase tracking-wider" : "opacity-90 py-0.5"}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}