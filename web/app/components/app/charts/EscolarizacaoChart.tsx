"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { getRankingOptions } from "../../../services/ApexCharts/chartBuilder";

interface EscolarizacaoChartItem {
  uf: string
  taxa: number
}

interface EscolarizacaoChartProps {
  ranking: EscolarizacaoChartItem[]
  taxaRegiao: number
  taxaNacional: number
  regiao: string
}

export function EscolarizacaoChart({ ranking, taxaRegiao, taxaNacional, regiao }: EscolarizacaoChartProps) {
  const chartData = useMemo(() => ({
    ufs: ranking.map(r => r.uf),
    valores: ranking.map(r => Number((r.taxa * 100).toFixed(2))),
    mediaRegiao: Number((taxaRegiao * 100).toFixed(2)),
    mediaNacional: Number((taxaNacional * 100).toFixed(2))
  }), [ranking, taxaRegiao, taxaNacional]);

  const options = useMemo(() =>
    getRankingOptions(chartData.ufs, chartData.mediaRegiao, chartData.mediaNacional, "#68E699"),
    [chartData]
  );

  const series = useMemo(() => [{ name: "Taxa de Escolarização", data: chartData.valores }], [chartData.valores]);
  const height = Math.max(180, ranking.length * 28);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div style={{ minHeight: height }}>
        <ReactApexChart options={options} series={series} type="bar" height={height} width="100%" />
      </div>
      <ChartLegend regiao={regiao} />
    </div>
  );
}

const ChartLegend = ({ regiao }: { regiao: string }) => (
  <div className="flex gap-4 px-2 pt-1 flex-wrap">
    <span className="flex items-center gap-1.5 text-[10px] text-blue-600 font-semibold">
      <span className="inline-block w-6 border-t-2 border-dashed border-blue-500" /> Média {regiao}
    </span>
    <span className="flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold">
      <span className="inline-block w-6 border-t-2 border-dashed border-amber-500" /> Média Brasil
    </span>
  </div>
);