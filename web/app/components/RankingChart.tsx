"use client"
import dynamic from "next/dynamic"
import { ChartCard } from "./ChartCard"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#ADADAD]">
      Carregando gráfico...
    </div>
  ),
})

const Regioes = ["Norte", "Nordeste", "C-Oeste", "Sudeste", "Sul"]

const OPTIONS: ApexCharts.ApexOptions = {
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
      columnWidth: "45%",
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
  xaxis: {
    categories: Regioes,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#908f8f", fontSize: "12px", fontWeight: 500 } },
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      style: { colors: "#ADADAD", fontSize: "12px" },
      formatter: (v: number) => v.toFixed(1),
    },
  },
  legend: { position: "bottom", fontSize: "11px" },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#E5E7EB",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: { theme: "light", shared: true, intersect: false },
}

interface SeriesData {
  name: string
  data: number[]
}

interface RankingChartProps {
  title: string
  info?: string
  series: SeriesData[]
}

export function RankingChart({ title, info, series}: RankingChartProps) {
  return (
    <ChartCard title={title} info={info}>
      <div className="w-full h-[460px]">
        <ReactApexChart
          options={OPTIONS}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </ChartCard>
  )
}