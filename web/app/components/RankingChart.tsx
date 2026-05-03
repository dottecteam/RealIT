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

const ESTADOS: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas",
  BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo",
  GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
  SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
}

interface SeriesData {
  name: string
  data: number[]
}

interface RankingChartProps {
  title: string
  info?: string
  series: SeriesData[]
  categorias: string[]
}

export function RankingChart({ title, info, series, categorias }: RankingChartProps) {
  const isMany = categorias.length > 10

  const options: ApexCharts.ApexOptions = {
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
        columnWidth: isMany ? "75%" : "50%",
        horizontal: false,
        borderRadius: 7,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            offsetY: -10,
            formatter: (val: string) => parseFloat(val).toFixed(1),
            style: {
              fontSize: isMany ? "10px" : "13px",
              fontWeight: 300,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categorias,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#908f8f",
          fontSize: isMany ? "9px" : "11px",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        style: { colors: "#ADADAD", fontSize: "10px" },
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
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      x: {
        formatter: (val: string) => ESTADOS[val] ?? val,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: { bar: { columnWidth: isMany ? "85%" : "60%" } },
          xaxis: { labels: { style: { fontSize: isMany ? "8px" : "10px" } } },
          legend: { fontSize: "10px" },
        },
      },
    ],
  }

  return (
    <ChartCard title={title} info={info}>
      <div className="w-full h-[380px] sm:h-[450px] md:h-[500px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </ChartCard>
  )
}

//Código anterior, para referência:
// "use client"
// import dynamic from "next/dynamic"
// import { ChartCard } from "./ChartCard"

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-full flex items-center justify-center text-[#ADADAD]">
//       Carregando gráfico...
//     </div>
//   ),
// })

// const Regioes = ["Norte", "Nordeste", "C-Oeste", "Sudeste", "Sul"]

// const OPTIONS: ApexCharts.ApexOptions = {
//   chart: {
//     type: "bar",
//     stacked: true,
//     toolbar: { show: false },
//     zoom: { enabled: false },
//     fontFamily: "inherit",
//   },
//   colors: ["#FF9A98", "#2cfff1", "#68E699", "#FFE372"],
//   plotOptions: {
//     bar: {
//       columnWidth: "45%",
//       horizontal: false,
//       borderRadius: 7,
//       borderRadiusApplication: "end",
//       borderRadiusWhenStacked: "last",
//       dataLabels: {
//         total: {
//           enabled: true,
//           offsetY: -12,
//           formatter: (val: string) => parseFloat(val).toFixed(1),
//           style: { fontSize: "13px", fontWeight: 400 },
//         },
//       },
//     },
//   },
//   dataLabels: { enabled: false },
//   xaxis: {
//     categories: Regioes,
//     axisBorder: { show: false },
//     axisTicks: { show: false },
//     labels: { style: { colors: "#908f8f", fontSize: "12px", fontWeight: 500 } },
//   },
//   yaxis: {
//     min: 0,
//     max: 5,
//     tickAmount: 5,
//     labels: {
//       style: { colors: "#ADADAD", fontSize: "12px" },
//       formatter: (v: number) => v.toFixed(1),
//     },
//   },
//   legend: { position: "bottom", fontSize: "11px" },
//   fill: { opacity: 1 },
//   grid: {
//     borderColor: "#E5E7EB",
//     strokeDashArray: 4,
//     xaxis: { lines: { show: false } },
//     yaxis: { lines: { show: true } },
//   },
//   tooltip: { theme: "light", shared: true, intersect: false },
// }

// interface SeriesData {
//   name: string
//   data: number[]
// }

// interface RankingChartProps {
//   title: string
//   info?: string
//   series: SeriesData[]
// }

// export function RankingChart({ title, info, series}: RankingChartProps) {
//   return (
//     <ChartCard title={title} info={info}>
//       <div className="w-full h-[600px]">
//         <ReactApexChart
//           options={OPTIONS}
//           series={series}
//           type="bar"
//           height="100%"
//           width="100%"
//         />
//       </div>
//     </ChartCard>
//   )
// }