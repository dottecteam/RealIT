"use client";

import { useEffect, useRef, useState } from "react";
import mapaBrasil from "mapa-brasil";
import { mockDadosScoreCompleto } from "../mocks/score";
import { IBGE_TO_REGION, STATE_TO_IBGE, STATE_TO_UF, IBGE_TO_UF } from "../mocks/ufRegionData";
import { useMapContext } from "../utils/MapContext";

const REGIONS_COLORS = {
  norte: "#68E699",
  nordeste: "#FF9A98",
  centroOeste: "#FFE372",
  sudeste: "#202AD0",
  sul: "#4EDAD3",
};

const REGIAO_COR: Record<string, string> = {
  "Norte": REGIONS_COLORS.norte,
  "Nordeste": REGIONS_COLORS.nordeste,
  "Sudeste": REGIONS_COLORS.sudeste,
  "Sul": REGIONS_COLORS.sul,
  "Centro-Oeste": REGIONS_COLORS.centroOeste,
};

const UF_COLORS: Record<string, string> = {
  AC: "#68E699", AL: "#FF9A98", AM: "#FFE372", AP: "#4EDAD3", BA: "#FF6B6B",
  CE: "#FFA07A", DF: "#9B59B6", ES: "#3498DB", GO: "#E67E22", MA: "#1ABC9C",
  MG: "#2ECC71", MS: "#E74C3C", MT: "#F39C12", PA: "#16A085", PB: "#8E44AD",
  PE: "#D35400", PI: "#27AE60", PR: "#2980B9", RJ: "#C0392B", RN: "#7F8C8D",
  RO: "#BDC3C7", RR: "#95A5A6", RS: "#34495E", SC: "#1E8BC3", SE: "#BE90D4",
  SP: "#202AD0", TO: "#6C3483",
};

const CATEGORIA_CORES: Record<string, string> = {
  diamante: "#fad144",
  emergente: "#f2e394",
  maduro: "#f2b46b",
  expansao: "#f2b46b",
  organico: "#f2a541",
  defesa: "#f28c28",
  fomento: "#f02817",
  retencao: "#c21807",
  saturacao: "#941336",
  intermediario: "#bbbbbb",
};

const CATEGORIA_TEXTO: Record<string, string> = {
  diamante: "Diamante Bruto",
  emergente: "Potencial Emergente",
  maduro: "Mercado Maduro",
  expansao: "Expansão Cautelosa",
  organico: "Crescimento Orgânico",
  defesa: "Defesa de Mercado",
  fomento: "Fomento Social",
  retencao: "Retenção Restrita",
  saturacao: "Saturação",
  intermediario: "Intermediário",
};

function getCategoria(scoreI: number, scoreII: number): string {
  if (scoreI <= 2 && scoreII <= 2) return "diamante";
  if (scoreI <= 2 && scoreII >= 2 && scoreII <= 4) return "emergente";
  if (scoreI <= 2 && scoreII >= 4 && scoreII <= 5) return "maduro";
  if (scoreI >= 2 && scoreI <= 4 && scoreII <= 2) return "expansao";
  if (scoreI >= 2 && scoreI <= 4 && scoreII >= 2 && scoreII <= 4) return "organico";
  if (scoreI >= 2 && scoreI <= 4 && scoreII >= 4 && scoreII <= 5) return "defesa";
  if (scoreI >= 4 && scoreI <= 5 && scoreII <= 2) return "fomento";
  if (scoreI >= 4 && scoreI <= 5 && scoreII >= 2 && scoreII <= 4) return "retencao";
  if (scoreI >= 4 && scoreI <= 5 && scoreII >= 4 && scoreII <= 5) return "saturacao";
  return "intermediario";
}

export function BrasilMap() {
  const { viewMode } = useMapContext();

  const hiddenRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, lines: [] as string[] });
  const [heatmap, setHeatmap] = useState(false);
  const svgBaseRef = useRef<string>("");

  //Inicializa o SVG base uma única vez pela biblioteca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hiddenRef.current) return;
      hiddenRef.current.innerHTML = "";

      mapaBrasil(hiddenRef.current, {
        unidade: "br",
        regiao: "federacao",
        dataPath: "/data",
        defaultFillColor: "#E5E5E5",
        defaultStrokeColor: "#FFFFFF",
        unidadeData: [],
        onClick: () => {},
      });

      setTimeout(() => {
        const svg = hiddenRef.current?.querySelector("svg");
        if (!svg) return;

        const clone = svg.cloneNode(true) as SVGElement;

        clone.querySelectorAll("path").forEach((path) => {
          const title = path.querySelector("title")?.textContent?.trim();
          if (!title) return;

          const titleUpper = title.toUpperCase();
          path.setAttribute("data-title", titleUpper);

          const codIbge = STATE_TO_IBGE[titleUpper];
          if (codIbge) {
            const uf = IBGE_TO_UF[Number(codIbge)];
            const regiao = IBGE_TO_REGION[codIbge];
            if (uf) path.setAttribute("data-uf", uf);
            if (regiao) path.setAttribute("data-regiao", regiao);
          }
        });

        clone.querySelectorAll("title").forEach((t) => t.remove());
        clone.removeAttribute("width");
        clone.removeAttribute("height");
        clone.removeAttribute("style");
        clone.setAttribute("width", "100%");
        clone.setAttribute("height", "auto");
        clone.setAttribute("viewBox", "0 0 700 800");
        clone.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svgBaseRef.current = clone.outerHTML;
        setSvgContent(applyColors(clone.outerHTML, heatmap, viewMode));
      }, 200);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!svgBaseRef.current) return;
    setSvgContent(applyColors(svgBaseRef.current, heatmap, viewMode));
  }, [heatmap, viewMode]);

  function applyColors(svgString: string, isHeatmap: boolean, mode: string): string {
    if (!svgString) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");

    doc.querySelectorAll("path").forEach((path) => {
      const uf = path.getAttribute("data-uf");
      const regiao = path.getAttribute("data-regiao");

      if (!uf && !regiao) return;

      let cor = "#E5E5E5";

      if (isHeatmap) {
        if (mode === "uf") {
          const dados = mockDadosScoreCompleto.dadosScore.find((d) => d.uf === uf);
          if (dados) {
            cor = CATEGORIA_CORES[getCategoria(dados.score_eixo_i, dados.score_eixo_ii)];
          } else {
            cor = "#d1d5db";
          }
        } else {
          const dadosRegiao = mockDadosScoreCompleto.dadosMediaRegiao.find(
            (r) => r.regiao === regiao
          );
          if (dadosRegiao) {
            cor = CATEGORIA_CORES[getCategoria(dadosRegiao.media_score_eixo_i, dadosRegiao.media_score_eixo_ii)];
          } else {
            cor = "#d1d5db";
          }
        }
      } else {
        if (mode === "uf") {
          //Cor por UF
          cor = uf ? (UF_COLORS[uf] ?? "#E5E5E5") : "#E5E5E5";
        } else {
          //Cor por região
          cor = regiao ? (REGIAO_COR[regiao] ?? "#E5E5E5") : "#E5E5E5";
        }
      }

      path.setAttribute("fill", cor);
      path.style.fill = cor;
    });

    const svg = doc.querySelector("svg");
    return svg ? svg.outerHTML : svgString;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as SVGPathElement;

    if (target.tagName !== "path") {
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }

    const uf = target.getAttribute("data-uf");
    const regiao = target.getAttribute("data-regiao");
    const title = target.getAttribute("data-title");

    const lines: string[] = [];

    if (viewMode === "uf" && uf) {
      const dados = mockDadosScoreCompleto.dadosScore.find((d) => d.uf === uf);
      if (dados) {
        const categoria = getCategoria(dados.score_eixo_i, dados.score_eixo_ii);
        lines.push(`${title ?? uf} (${uf})`);
        lines.push(`Eixo I: ${dados.score_eixo_i}`);
        lines.push(`Eixo II: ${dados.score_eixo_ii}`);
        lines.push(`Inadimplência: ${dados.score_inadimplencia}`);
        lines.push(`Crescimento: ${dados.score_crescimento}`);
        lines.push(`Categoria: ${CATEGORIA_TEXTO[categoria] ?? categoria}`);
      } else {
        lines.push(title ?? uf ?? "");
      }
    } else if (viewMode === "regioes" && regiao) {
      const dadosRegiao = mockDadosScoreCompleto.dadosMediaRegiao.find(
        (r) => r.regiao === regiao
      );
      if (dadosRegiao) {
        const categoria = getCategoria(dadosRegiao.media_score_eixo_i, dadosRegiao.media_score_eixo_ii);
        lines.push(`Região ${regiao}`);
        lines.push(`Eixo I (média): ${dadosRegiao.media_score_eixo_i}`);
        lines.push(`Eixo II (média): ${dadosRegiao.media_score_eixo_ii}`);
        lines.push(`Inadimplência (média): ${dadosRegiao.media_inadimplencia}`);
        lines.push(`Crescimento (média): ${dadosRegiao.media_crescimento}`);
        lines.push(`Categoria: ${CATEGORIA_TEXTO[categoria] ?? categoria}`);
      } else {
        lines.push(regiao);
      }
    } else {
      lines.push(title ?? "");
    }

    setTooltip({ visible: true, x: e.clientX, y: e.clientY, lines });
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  function renderLegenda() {
    if (heatmap) {
      return (
        <>
          {Object.entries(CATEGORIA_TEXTO).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: CATEGORIA_CORES[key] }} />
              {label}
            </div>
          ))}
        </>
      );
    }

    if (viewMode === "uf") {
      return (
        <p className="text-xs text-zinc-400 italic">
          Cada estado exibe sua própria cor identificadora.
        </p>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#68E699]" /> Norte</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FF9A98]" /> Nordeste</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FFE372]" /> Centro-Oeste</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#202AD0]" /> Sudeste</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#4EDAD3]" /> Sul</div>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="h-8 mb-4 z-10 text-center">
        <h3 className="text-xl font-bold text-[#202AD0]">
          Mapa Brasil —{" "}
          <span className="text-gray-700">
            {viewMode === "uf" ? "Por UF" : "Por Região"}
          </span>
        </h3>
      </div>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={heatmap}
          onChange={() => setHeatmap((prev) => !prev)}
        />
        Modo mapa de calor
      </label>

      <style>{`
        .mapa-interativo path {
          transition: opacity 0.2s ease, filter 0.2s ease;
          cursor: pointer;
          opacity: 0.85;
        }
        .mapa-interativo svg:has(path:hover) path {
          opacity: 0.4;
        }
        .mapa-interativo svg path:hover {
          opacity: 1 !important;
          stroke: #000;
          stroke-width: 1.5;
        }
      `}</style>

      <div ref={hiddenRef} style={{ display: "none" }} />

      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-[900px]">
          <div
            className="mapa-interativo w-full aspect-[4/3] drop-shadow-2xl select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      <div className="w-full mt-4 flex flex-wrap gap-4 text-sm justify-center">
        {renderLegenda()}
      </div>

      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            pointerEvents: "none",
            backgroundColor: "#202ad0",
            zIndex: 50,
          }}
          className="text-white text-xs px-3 py-2 rounded shadow-lg"
        >
          {tooltip.lines.map((line, i) => (
            <div key={i} className={i === 0 ? "font-bold mb-1" : ""}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}