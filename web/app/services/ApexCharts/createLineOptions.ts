function makeLegendMarkers(cores: string[], dashes: number[]) {
  return {
    customHTML: cores.map((cor, i) => () => {
      const dashed = dashes[i] > 0
      return `<svg width="20" height="6" style="display:inline-block;vertical-align:middle">
        <line x1="0" y1="3" x2="20" y2="3"
          stroke="${cor}" stroke-width="2.5"
          stroke-dasharray="${dashed ? "4,2" : "none"}"
        />
      </svg>`
    }) as any,
  }
}

interface LineOptionsParams {
  categorias: string[]
  cores: string[]
  dashes: number[]
  markerSizes?: number[]
  marcadorProjecao?: string
  tooltipFontSize?: string
}

export function createLineOptions({
  categorias,
  cores,
  dashes,
  markerSizes = [0],
  marcadorProjecao,
  tooltipFontSize,
}: LineOptionsParams): ApexCharts.ApexOptions {
  return {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: false },
      selection: { enabled: false },
    },
    colors: cores,
    stroke: { curve: "smooth", width: 2.5, dashArray: dashes },
    markers: { size: markerSizes },
    xaxis: {
      categories: categorias,
      labels: {
        rotate: -45,
        style: { fontSize: "10px", colors: "var(--gray-400)" },
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 1,
      max: 5,
      tickAmount: 4,
      labels: {
        formatter: (v: number | null) => v != null ? v.toFixed(1) : "",
        style: { colors: "var(--gray-400)", fontSize: "11px" },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "var(--gray-600)" },
      markers: makeLegendMarkers(cores, dashes),
    },
    grid: { borderColor: "var(--gray-100)", strokeDashArray: 4 },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      ...(tooltipFontSize && { style: { fontSize: tooltipFontSize } }),
    },
    ...(marcadorProjecao && {
      annotations: {
        xaxis: [{
          x: marcadorProjecao,
          borderColor: "var(--gray-300)",
          strokeDashArray: 5,
          label: {
            text: "INÍCIO DA PROJEÇÃO",
            style: {
              color: "var(--gray-500)",
              background: "transparent",
              fontSize: "9px",
              fontWeight: "bold",
            },
          },
        }],
      },
    }),
  }
}