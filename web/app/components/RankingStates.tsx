"use client"

import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#ADADAD]">
      Carregando gráfico...
    </div>
  ),
})

const Categorias = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO",
  "MA","MG","MS","MT","PA","PB","PE","PI","PR",
  "RJ","RN","RO","RR","RS","SC","SE","SP","TO"
]

const Estados: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas",
  BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo",
  GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
  SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
}

const OPTIONS: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: true },
    fontFamily: "inherit",
  },
  colors: ["#FF9A98", "#2cfff1", "#68E699", "#FFE372"],
  plotOptions: {
    bar: {
      columnWidth: 20,
      horizontal: false,
      borderRadius: 7,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      dataLabels: {
        total: {
          enabled: true,
          offsetY: -12,
          formatter: (val: string) => parseFloat(val).toFixed(1),
          style: {
            fontSize: "14px",
            fontWeight: 400
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: Categorias,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#908f8f", fontSize: "11px", fontWeight: 600 },
    },
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
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "13px",
    labels: { colors: "#374151" },
  },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#E5E7EB",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: "light",
    shared: true,
    intersect: false,
    x: {
      formatter: (val: string) => Estados[val] || val
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: { position: "bottom", offsetX: -10, offsetY: 0 },
      },
    },
  ],
}

interface SeriesData {
  name: string
  data: number[]
}

interface RankingStatesProps {
  series: SeriesData[]
}

export function RankingStates({ series }: RankingStatesProps) {
  return (
    <div className="bg-white rounded-[40px] p-10 flex flex-col items-center w-full">
      <div className="w-full h-[450px]">
        <ReactApexChart
          options={OPTIONS}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  )
}