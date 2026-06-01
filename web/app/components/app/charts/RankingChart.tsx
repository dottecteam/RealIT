"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { createBarOptions } from "../../../services/ApexCharts/createBarOptions";
import { REGIOES } from "../../../constants/charts/chartOptions";
import { EIXO_META_II } from "../../../constants/charts/rankingConfig";
import { SeriesData } from "../../../types/components/chart";

interface RankingChartProps { title: string; info?: string; series: SeriesData[] }

export function RankingChart({ series }: RankingChartProps) {
  const meta = useMemo(() => {
    const name = series[0]?.name ?? "";

    if (name in EIXO_META_II) {
      return EIXO_META_II[name as keyof typeof EIXO_META_II];
    }

    return {
      label: name,
      descricao: "",
      cor: ["#908f8f"],
      textColors: "#6b7280",
    };
  }, [series]);

  const options = useMemo(() => createBarOptions({
    colors: [meta.cor],
    plotOptions: { bar: { columnWidth: "45%" } },
    xaxis: { categories: REGIOES },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)} (escala 1–5)`,
        title: { formatter: () => `${meta.label}: ` },
      },
    },
  }), [meta]);

  return (
    <div className="w-full flex flex-col gap-1">
      <ChartMetaHeader meta={meta} />
      <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
  );
}

const ChartMetaHeader = ({ meta }: { meta: any }) => (
  <div className="px-1">
    <span
      className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ background: `${meta.cor}33`, color: meta.textCor }}
    >
      {meta.label}
    </span>
    {meta.descricao && (
      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{meta.descricao}</p>
    )}
  </div>
);