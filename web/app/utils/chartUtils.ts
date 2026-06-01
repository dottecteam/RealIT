/**
 * Gera marcadores de legenda customizados em SVG para o ApexCharts,
 * suportando cores dinâmicas e linhas tracejadas.
 */
export function makeLegendMarkers(cores: string[], dashes: number[]) {
  return {
    customHTML: cores.map((cor, i) => {
      return () => {
        const isDashed = dashes && dashes[i] > 0;
        
        return `<svg width="20" height="6" style="display:inline-block;vertical-align:middle">
          <line x1="0" y1="3" x2="20" y2="3"
            stroke="${cor}" stroke-width="2.5"
            stroke-dasharray="${isDashed ? "4,2" : "none"}"
          />
        </svg>`;
      };
    }) as (() => string)[],
  };
}