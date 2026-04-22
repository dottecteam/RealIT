"use client";

import { useEffect, useRef, useState } from "react";
import mapaBrasil from "mapa-brasil";
import { mockDadosScoreCompleto } from "../mocks/score";
import { IBGE_TO_REGION, STATE_TO_IBGE, STATE_TO_UF, IBGE_TO_UF } from "../mocks/ufRegionData";

const REGIONS_COLORS = {
  norte: "#68E699",
  nordeste: "#FF9A98",
  centroOeste: "#FFE372",
  sudeste: "#202AD0",
  sul: "#4EDAD3",
};


const CATEGORIA_CORES: Record<string, string> = {
  diamante: "#fad144",      
  maduro: "#f58c1b",        
  fomento: "#f02817",       
  saturado: "#941336",      
  intermediario: "#bbbbbb"
};



export function BrasilMap() {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [regiaoAtiva, setRegiaoAtiva] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "", });
  const [heatmap, setHeatmap] = useState(false);
  const svgBaseRef = useRef<string>("");

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

        svgBaseRef.current = clone.outerHTML;
        setSvgContent(clone.outerHTML);
        }, 200);

    }, 100);

        return () => clearTimeout(timer);
    }, []);


    function applyHeatmap(svgString: string, isHeatmapActive: boolean): string {
        if (!svgString) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const paths = doc.querySelectorAll("path");

        paths.forEach((path) => {
        const titleElement = path.querySelector("title");
        const title = titleElement?.textContent?.trim().toUpperCase();

        if (!title) return;

        const uf = Object.entries(STATE_TO_UF).find(([estado]) =>
            title.includes(estado)
        )?.[1];

        if (!uf) return;

        const dados = mockDadosScoreCompleto.dadosScore.find(item => item.uf === uf);
        const codIbge = Object.entries(IBGE_TO_UF).find(([, u]) => u === uf)?.[0];

        if (isHeatmapActive){
            if (dados){
                const categoria = getCategoria(dados.score_eixo_i, dados.score_eixo_ii);
                const color = CATEGORIA_CORES[categoria];
                
                path.style.fill = color;
            path.setAttribute("fill", color);
            } 
            else{
                path.style.fill = "#d1d5db"; 
                path.setAttribute("fill", "#d1d5db");
            }
        } 
        else{
            if (codIbge){
                const regiao = IBGE_TO_REGION[Number(codIbge)];
                const corRegiao: Record<string, string> = {
                    "Norte": REGIONS_COLORS.norte,
                    "Nordeste": REGIONS_COLORS.nordeste,
                    "Sudeste": REGIONS_COLORS.sudeste,
                    "Sul": REGIONS_COLORS.sul,
                    "Centro-Oeste": REGIONS_COLORS.centroOeste,
                };
                const cor = corRegiao[regiao];
                
                if (cor) {
                    path.style.fill = cor;
                    path.setAttribute("fill", cor);
                }
            }
        }
    });

        const svg = doc.querySelector("svg");
        return svg ? svg.outerHTML : svgString;
    }

    useEffect(() => {
        if (!svgBaseRef.current) return;
        setSvgContent(applyHeatmap(svgBaseRef.current, heatmap));
    }, [heatmap]);


    //Parte do hover
    function getScoreByUF(uf: string) {
        return mockDadosScoreCompleto.dadosScore.find(
            item => item.uf === uf
        );
    }

    function getUFByTitle(title: string) {
        const entry = Object.entries(STATE_TO_UF).find(([estado]) =>
            title.includes(estado)
        );

        return entry?.[1];
    }


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
            const title = target.querySelector("title")?.textContent?.trim().toUpperCase();

            if (title) {
            const uf = getUFByTitle(title);

            if (uf) {
                const dados = getScoreByUF(uf);

                if (dados) {
                setTooltip({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    text: `
                        ${title} (${uf})
                        Eixo I: ${dados.score_eixo_i}
                        Eixo II: ${dados.score_eixo_ii}
                        Inadimplência: ${dados.score_inadimplencia}
                        Crescimento: ${dados.score_crescimento}
                        Categoria: ${getCategoria(dados.score_eixo_i, dados.score_eixo_ii).toUpperCase()}
                    `,
                });
                return;
                }
            }

            // fallback
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


    //Parte do mapa de calor
    function getCategoria(scoreI: number, scoreII: number) {
        if (scoreI >= 3 && scoreII >= 2) return "saturado";
        if (scoreI >= 3 && scoreII < 2) return "maduro";
        if (scoreI < 2.5 && scoreII >= 2) return "fomento";
        if (scoreI < 2.5 && scoreII < 2) return "diamante";
        return "intermediario";
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

        <label className="flex items-center gap-2 mb-2">
            <input
                type="checkbox"
                checked={heatmap}
                onChange={() => setHeatmap(prev => !prev)}
            />
            Modo mapa de calor
        </label>

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

        {heatmap && (
            <div className="mt-4 text-sm space-y-1">
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#fad144]" /> Diamante Bruto
                </div>
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f58c1b]" /> Mercado Maduro
                </div>
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f02817]" /> Fomento Social
                </div>
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#941336]" /> Saturação
                </div>
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#bbbbbb]" /> Intermediário
                </div>
            </div>
        )}

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
                {tooltip.text.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        )}
            
        </div>
    );
}