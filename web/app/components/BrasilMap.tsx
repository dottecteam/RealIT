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
    emergente: "#f2e394",
    maduro: "#f2b46b",
    expansao: "#f2b46b",
    organico: "#f2a541",
    defesa: "#f28c28",
    fomento: "#f02817",
    retencao: "#c21807",
    saturacao: "#941336",
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
        clone.querySelectorAll("path").forEach((path) => {
        const title = path.querySelector("title")?.textContent?.trim();
        if (title) {
            path.setAttribute("data-title", title.toUpperCase());
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

        const title = target.getAttribute("data-title");
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
            const title = target.getAttribute("data-title");

            if (title) {
            const uf = getUFByTitle(title);

            if (uf) {
                const dados = getScoreByUF(uf);

                if (dados) {
                    let categoria = getCategoria(dados.score_eixo_i, dados.score_eixo_ii)
                    let categoriaTexto = "";

                    switch(categoria){
                        case "diamante":
                            categoriaTexto = "Diamante Bruto";
                            break;
                        case "emergente":
                            categoriaTexto = "Potencial Emergente";
                            break;
                        case "maduro":
                            categoriaTexto = "Mercado Maduro";
                            break;
                        case "expansao":
                            categoriaTexto = "Expansão Cautelosa";
                            break;
                        case "organico":
                            categoriaTexto = "Crescimento Orgânico";
                            break;
                        case "defesa":
                            categoriaTexto = "Defesa de Mercado";
                            break;
                        case "fomento":
                            categoriaTexto = "Fomento Social";
                            break;
                        case "retencao": 
                            categoriaTexto = "Retenção Restrita";
                            break;
                        case "saturacao":
                            categoriaTexto = "Saturação";
                            break;
                    }
                    
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
                            Categoria: ${categoriaTexto}
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
        //diamante bruto
        if ((scoreI <= 2) && (scoreII <= 2)) return "diamante";

        //potencial emergente
        if ((scoreI <= 2) && (scoreII >= 2 && scoreII <= 4)) return "emergente";

        //mercado maduro
         if ((scoreI <= 2) && (scoreII >= 4 && scoreII <= 5)) return "maduro";

        //expansao cautelosa
         if ((scoreI >= 2 && scoreI <= 4) && (scoreII <= 2)) return "expansao";

        //crescimento organico
         if ((scoreI >= 2 && scoreI <= 4) && (scoreII >= 2 && scoreII <= 4)) return "organico";

        //defesa de mercado
         if ((scoreI >= 2 && scoreI <= 4) && (scoreII >= 4 && scoreII <= 5)) return "emergente";

        //fomento social
        if ((scoreI >= 4 && scoreI <= 5) && (scoreII <= 2)) return "fomento";

        //retencao restrita
         if ((scoreI >= 4 && scoreI <= 5) && (scoreII >= 2 && scoreII <= 4)) return "retencao";

        //saturacao
         if ((scoreI >= 4 && scoreI <= 5) && (scoreII >= 4 && scoreII <= 5)) return "saturacao";

        return "intermediario";
    }

    return (
        <div className="w-full flex flex-col p-4 bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="h-8 mb-4 z-10 text-center">
                <h3 className="text-xl font-bold text-[#202AD0]">
                    Mapa Brasil - <span className="text-gray-700">Visualização</span>
                </h3>
            </div>

            <label className="flex items-center gap-2 mb-4">
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
            `}
            </style>

            <div ref={hiddenRef} style={{ display: "none" }} />


            <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-[900px]">
                    <div
                        className="mapa-interativo w-full aspect-[4/3] drop-shadow-2xl select-none"
                        onClick={handlePathClick}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                </div>
            </div>

            <div className="w-full mt-4 flex flex-wrap gap-4 text-sm justify-center">
                {heatmap ? (
                    <>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#fad144]" /> Diamante Bruto
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f2e394]" /> Potencial Emergente
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f2b46b]" /> Mercado Maduro
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f2b46b]" /> Expansão Cautelosa
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f2a541]" /> Crescimento Orgânico
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f28c28]" /> Defesa de Mercado
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#f02817]" /> Fomento Social
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#c21807]" /> Retenção Restrita
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#941336]" /> Saturação
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#68E699]" /> Norte
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#FF9A98]" /> Nordeste
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#FFE372]" /> Centro-Oeste
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#202AD0]" /> Sudeste
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#4EDAD3]" /> Sul
                        </div>
                    </>
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

        </div>
    );
}