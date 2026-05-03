const BAR_DEFAULTS: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "inherit",
  },
  colors: ["#FF9A98", "#2cfff1", "#68E699", "#FFE372"],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 7,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      dataLabels: {
        total: {
          enabled: true,
          offsetY: -12,
          formatter: (val: string) => parseFloat(val).toFixed(1),
          style: { fontSize: "13px", fontWeight: 400 },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      style: { colors: "#ADADAD", fontSize: "12px" },
      formatter: (v: number) => v.toFixed(1),
    },
  },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#E5E7EB",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: { theme: "light", shared: true, intersect: false },
  legend: { position: "bottom", fontSize: "11px" },
}

/**
 * Merge raso — suficiente para sobrescrever seções de primeiro nível.
 * Para merge profundo, use lodash merge() ou deepmerge.
 */
export function createBarOptions(
  overrides: ApexCharts.ApexOptions = {}
): ApexCharts.ApexOptions {
  return {
    ...BAR_DEFAULTS,
    ...overrides,
    chart:        { ...BAR_DEFAULTS.chart,        ...overrides.chart },
    plotOptions:  { ...BAR_DEFAULTS.plotOptions,  ...overrides.plotOptions,
      bar: { ...BAR_DEFAULTS.plotOptions?.bar, ...overrides.plotOptions?.bar }
    },
    xaxis:   { ...BAR_DEFAULTS.xaxis,   ...overrides.xaxis },
    yaxis:   { ...BAR_DEFAULTS.yaxis,   ...overrides.yaxis },
    legend:  { ...BAR_DEFAULTS.legend,  ...overrides.legend },
    grid:    { ...BAR_DEFAULTS.grid,    ...overrides.grid },
    tooltip: { ...BAR_DEFAULTS.tooltip, ...overrides.tooltip },
  }
}