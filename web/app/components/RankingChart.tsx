"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#ADADAD]">
      Carregando gráfico...
    </div>
  ),
});

interface RankingChartProps {
  pontuacoes: number[];
}

export function RankingChart({ pontuacoes }: RankingChartProps) {

  const chartData = useMemo(() => {
    return {
      series: [
        {
          name: "Score",
          //AQUI ENTRA O DADO REAL!
          data: pontuacoes, 
        },
      ],
      options: {
        chart: {
          type: "bar" as const,
          toolbar: { show: false },
          fontFamily: "inherit",
        },
        colors: ["#68E699", "#FF9A98", "#FFE372", "#202AD0", "#4EDAD3"],
        plotOptions: {
          bar: { borderRadius: 8, columnWidth: "40%", distributed: true },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: {
          borderColor: "#E5E7EB",
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
        },
        xaxis: {
          categories: ["Norte", "Nordeste", "C-Oeste", "Sudeste", "Sul"],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { style: { colors: "#908f8f", fontSize: "13px", fontWeight: 500 } },
        },
        yaxis: {
          labels: { style: { colors: "#ADADAD", fontSize: "13px" } },
        },
        tooltip: {
          theme: "light",
          y: { formatter: function (val: number) { return val + " pontos"; } },
        },
      },
    };
  }, [pontuacoes]);

  return (
    <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-10 flex flex-col items-center w-full">
      <h3 className="text-2xl font-black text-[#202AD0] mb-6 self-center">
        Brasil - Rank
      </h3>

      <div className="w-full h-[350px]">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}