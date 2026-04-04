// "use client";

// import { useEffect, useRef, useState } from "react";
// import mapaBrasil from "mapa-brasil";

// const REGIONS_COLORS = {
//   norte: "#68E699",
//   nordeste: "#FF9A98",
//   centroOeste: "#FFE372",
//   sudeste: "#202AD0",
//   sul: "#4EDAD3",
// };

// const IBGE_TO_REGION: Record<number, string> = {
//   11: "Norte", 12: "Norte", 13: "Norte", 14: "Norte", 15: "Norte", 16: "Norte", 17: "Norte",
//   21: "Nordeste", 22: "Nordeste", 23: "Nordeste", 24: "Nordeste", 25: "Nordeste", 26: "Nordeste", 27: "Nordeste", 28: "Nordeste", 29: "Nordeste",
//   31: "Sudeste", 32: "Sudeste", 33: "Sudeste", 35: "Sudeste",
//   41: "Sul", 42: "Sul", 43: "Sul",
//   50: "Centro-Oeste", 51: "Centro-Oeste", 52: "Centro-Oeste", 53: "Centro-Oeste",
// };

// export function BrasilMap() {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const [regiaoAtiva, setRegiaoAtiva] = useState<string | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!mapRef.current) return;
      
//       mapRef.current.innerHTML = "";

//       mapaBrasil(mapRef.current, {
//         unidade: "br",
//         regiao: "federacao",
//         dataPath: "/data",
//         defaultFillColor: "#E5E5E5",
//         defaultStrokeColor: "#FFFFFF",
        
//         unidadeData: [
//           { codIbge: 11, fillColor: REGIONS_COLORS.norte }, { codIbge: 12, fillColor: REGIONS_COLORS.norte }, { codIbge: 13, fillColor: REGIONS_COLORS.norte }, { codIbge: 14, fillColor: REGIONS_COLORS.norte }, { codIbge: 15, fillColor: REGIONS_COLORS.norte }, { codIbge: 16, fillColor: REGIONS_COLORS.norte }, { codIbge: 17, fillColor: REGIONS_COLORS.norte },
//           { codIbge: 21, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 22, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 23, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 24, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 25, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 26, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 27, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 28, fillColor: REGIONS_COLORS.nordeste }, { codIbge: 29, fillColor: REGIONS_COLORS.nordeste },
//           { codIbge: 31, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 32, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 33, fillColor: REGIONS_COLORS.sudeste }, { codIbge: 35, fillColor: REGIONS_COLORS.sudeste },
//           { codIbge: 41, fillColor: REGIONS_COLORS.sul }, { codIbge: 42, fillColor: REGIONS_COLORS.sul }, { codIbge: 43, fillColor: REGIONS_COLORS.sul },
//           { codIbge: 50, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 51, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 52, fillColor: REGIONS_COLORS.centroOeste }, { codIbge: 53, fillColor: REGIONS_COLORS.centroOeste },
//         ],

//         onClick: function (data: any) {
//           const nomeDaRegiao = IBGE_TO_REGION[data.codIbge];
//           setRegiaoAtiva(prev => prev === nomeDaRegiao ? null : nomeDaRegiao);
//         }
//       });

//       setTimeout(() => {
//         if (mapRef.current) {
//           const svgElement = mapRef.current.querySelector('svg');
//           if (svgElement) {
//             svgElement.removeAttribute('width');
//             svgElement.removeAttribute('height');
//             svgElement.setAttribute('width', '100%');
//             svgElement.setAttribute('height', '100%');
//             svgElement.setAttribute('viewBox', '0 0 800 800');
//           }
//         }
//       }, 50);

//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="w-full flex flex-col items-center justify-center p-4">
      
//       <div className="h-8 mb-4 z-10 text-center">
//         {regiaoAtiva ? (
//           <h3 className="text-xl font-bold text-[#202AD0]">Região Selecionada: <span className="text-gray-700">{regiaoAtiva}</span></h3>
//         ) : (<h3 className="text-xl text-gray-400">Clique em um estado no mapa</h3>)}
//       </div>

//       <style>{`
//         .mapa-interativo svg {
//           display: block;
//           max-width: 100%;
//           max-height: 100%;
//           overflow: visible !important;
//         }

//         .mapa-interativo svg path {
//           transition: filter 0.2s ease-in-out, transform 0.2s ease;
//           cursor: pointer;
//           transform-origin: center;
//         }

//         .mapa-interativo svg path:hover {
//           filter: brightness(0.85);
//           transform: scale(1.01);
//         }
//       `}</style>

//       <div 
//         ref={mapRef} 
//         className="mapa-interativo w-full max-w-[500px] aspect-square flex items-center justify-center drop-shadow-2xl"
//       />
      
//     </div>
//   );
// }