"use client"

import { ReactApexChart } from "../hooks/useApexChart"
import { createBarOptions } from "../services/ApexCharts/createBarOptions"
import { SeriesData } from "../types/components/RankingChart"
import { CATEGORIAS, ESTADOS } from "../constants/ChartOptions"

export function RankingStates({ series }: { series: SeriesData[] }) {
  const options = createBarOptions({
    plotOptions: { bar: { columnWidth: 20 } },
    xaxis: {
      categories: CATEGORIAS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#908f8f", fontSize: "11px", fontWeight: 600 } },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: { colors: "#374151" },
    },
    tooltip: {
      theme: "light", shared: true, intersect: false,
      x: { formatter: (val: string) => ESTADOS[val] || val },
    },
    responsive: [{
      breakpoint: 480,
      options: { legend: { position: "bottom", offsetX: -10, offsetY: 0 } },
    }],
  })
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: 900 }} className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}