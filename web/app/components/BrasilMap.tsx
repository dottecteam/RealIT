"use client";

import { useEffect, useRef, useState } from "react";
import mapaBrasil from "mapa-brasil";

const REGIONS_COLORS = {
  norte: "#68E699",
  nordeste: "#FF9A98",
  centroOeste: "#FFE372",
  sudeste: "#202AD0",
  sul: "#4EDAD3",
};

const IBGE_TO_REGION: Record<number, string> = {
  11: "Norte", 12: "Norte", 13: "Norte", 14: "Norte", 15: "Norte", 16: "Norte", 17: "Norte",
  21: "Nordeste", 22: "Nordeste", 23: "Nordeste", 24: "Nordeste", 25: "Nordeste", 26: "Nordeste", 27: "Nordeste", 28: "Nordeste", 29: "Nordeste",
  31: "Sudeste", 32: "Sudeste", 33: "Sudeste", 35: "Sudeste",
  41: "Sul", 42: "Sul", 43: "Sul",
  50: "Centro-Oeste", 51: "Centro-Oeste", 52: "Centro-Oeste", 53: "Centro-Oeste",
};

const STATE_TO_IBGE: Record<string, number> = {
  "RONDÔNIA": 11, "ACRE": 12, "AMAZONAS": 13, "RORAIMA": 14,
  "PARÁ": 15, "AMAPÁ": 16, "TOCANTINS": 17,
  "MARANHÃO": 21, "PIAUÍ": 22, "CEARÁ": 23, "RIO GRANDE DO NORTE": 24,
  "PARAÍBA": 25, "PERNAMBUCO": 26, "ALAGOAS": 27, "SERGIPE": 28, "BAHIA": 29,
  "MINAS GERAIS": 31, "ESPÍRITO SANTO": 32, "RIO DE JANEIRO": 33, "SÃO PAULO": 35,
  "PARANÁ": 41, "SANTA CATARINA": 42, "RIO GRANDE DO SUL": 43,
  "MATO GROSSO DO SUL": 50, "MATO GROSSO": 51, "GOIÁS": 52, "DISTRITO FEDERAL": 53,
};


export function BrasilMap() {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [regiaoAtiva, setRegiaoAtiva] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "", });

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
        unidadeData: [
          { codIbge: 11, fillColor: REGIONS_COLORS.norte }, { codIbge: 12, fillColor: REGIONS_COLORS.norte }, { codIbge: 13, fillColor: REGIONS_COLORS.norte }, { codIbge: 14, fillColor: REGIONS_COLORS.norte }, { codIbge: 15, fillColor: REGIONS_COLORS.norte }, { codIbge: 16, fillColor: REGIONS_COLORS.norte }, { codIbge: 17, fillColor: REGIONS_COLORS.norte },
          { codIbge: 21, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 22, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 23, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 24, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 25, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 26, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 27, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 28, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 29, fillColor: REGIONS_COLORS.nordeste },
          { codIbge: 31, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 32, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 33, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 35, fillColor: REGIONS_COLORS.sudeste },
          { codIbge: 41, fillColor: REGIONS_COLORS.sul }, { codIbge: 42, fillColor: REGIONS_COLORS.sul }, { codIbge: 43, fillColor: REGIONS_COLORS.sul },
          { codIbge: 50, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 51, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 52, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 53, fillColor: REGIONS_COLORS.centroOeste },
        ],
        onClick: () => {},
      });

      setTimeout(() => {
        const svg = hiddenRef.current?.querySelector("svg");
        if (!svg) return;

        //Clona o SVG do mapa da biblioteca p resolver o problema que tava dando antes (mapa ficava arrastável)
        const clone = svg.cloneNode(true) as SVGElement;

        clone.removeAttribute("width");
        clone.removeAttribute("height");
        clone.removeAttribute("style");
        clone.setAttribute("width", "100%");
        clone.setAttribute("height", "100%");
        clone.setAttribute("viewBox", "0 0 700 800");

        clone.setAttribute("preserveAspectRatio", "xMinYMid meet");

        setSvgContent(clone.outerHTML);
      }, 200);
    }, 100);

    return () => clearTimeout(timer);
  }, []);


    function handlePathClick(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as SVGPathElement;
        if (target.tagName !== "path") return;

        const title = target.querySelector("title")?.textContent?.trim().toUpperCase();
        if (!title) return;

        const codIbge = STATE_TO_IBGE[title];
        if (!codIbge) return;

        const regiao = IBGE_TO_REGION[codIbge];
        if (!regiao) return;

        setRegiaoAtiva(prev => prev === regiao ? null : regiao);
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as SVGPathElement;

        if (target.tagName === "path") {
            const title = target.querySelector("title")?.textContent;

            if (title) {
            setTooltip({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                text: title,
            });
            return;
            }
        }

        setTooltip(prev => ({ ...prev, visible: false }));
    }

    function handleMouseLeave() {
        setTooltip(prev => ({ ...prev, visible: false }));
    }

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="h-8 mb-4 z-10 text-center">
            {regiaoAtiva ? (
            <h3 className="text-xl font-bold text-[#202AD0]">
                Região Selecionada: <span className="text-gray-700">{regiaoAtiva}</span>
            </h3>
            ) : (
            <h3 className="text-xl text-gray-400">Clique em um estado no mapa</h3>
            )}
        </div>

        <style>{`
            .mapa-interativo path {
            transition: opacity 0.2s ease, filter 0.2s ease;
            cursor: pointer;
            opacity: 0.8;
            }

            .mapa-interativo svg:has(path:hover) path {
                opacity: 0.5;
            }

            .mapa-interativo svg path:hover {
                opacity: 1 !important;
                stroke: #000;
                stroke-width: 1.5;
            }

        `}</style>

        <div ref={hiddenRef} style={{ display: "none" }} />

        <div
            className="mapa-interativo w-full aspect-[16/9] drop-shadow-2xl select-none"
            onClick={handlePathClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {tooltip.visible && (
            <div
                style={{
                position: "fixed",
                top: tooltip.y + 10,
                left: tooltip.x + 10,
                pointerEvents: "none",
                backgroundColor: "#202ad0",
                zIndex: 50,
                }}
                className="text-white text-xs px-2 py-1 rounded shadow-lg"
            >
                {tooltip.text}
            </div>
            )}
            
        </div>
    );
}