"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { getRankingOptions } from "../../../services/ApexCharts/chartBuilder";

interface AgingDividaChartItem {
  uf: string
  aging: number
}

interface AgingDividaChartProps {
  ranking: AgingDividaChartItem[]
  agingRegiao: number
  agingNacional: number
  regiao: string
}

export function AgingDividaChart({ ranking, agingRegiao, agingNacional, regiao }: AgingDividaChartProps) {
  const chartData = useMemo(() => ({
    ufs: ranking.map(r => r.uf),
    valores: ranking.map(r => Number((r.aging * 100).toFixed(2))),
    mediaRegiao: Number((agingRegiao * 100).toFixed(2)),
    mediaNacional: Number((agingNacional * 100).toFixed(2))
  }), [ranking, agingRegiao, agingNacional]);

  const options = useMemo(() =>
    getRankingOptions(chartData.ufs, chartData.mediaRegiao, chartData.mediaNacional, "#FF9A98"),
    [chartData]
  );

  const series = useMemo(() => [{ name: "Aging da Dívida", data: chartData.valores }], [chartData.valores]);
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