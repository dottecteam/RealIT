"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { createBarOptions } from "../../../services/ApexCharts/createBarOptions";
import { SeriesData } from "../../../types/components/chart";
import { EIXO_META } from "../../../constants/charts/rankingConfig";
import { ESTADOS, CATEGORIAS } from "../../../constants/charts/chartOptions";
import { ChartHeader } from "./ChartHeader";

export function RankingStates({ series }: { series: SeriesData[] }) {
  const meta = useMemo(() => {
    const name = series[0]?.name ?? "";

    if (name in EIXO_META) {
      return EIXO_META[name as keyof typeof EIXO_META];
    }

    return {
      label: name,
      descricao: "",
      cores: ["#908f8f"],
      textColors: "#6b7280",
    };
  }, [series]);

  const options = useMemo(() => createBarOptions({
    colors: meta.cores,
    plotOptions: { bar: { columnWidth: 20 } },
    xaxis: { categories: CATEGORIAS },
    tooltip: {
      x: { formatter: (val: string) => ESTADOS[val] ?? val },
      y: { formatter: (val: number | undefined) => val !== undefined ? `${val.toFixed(2)}` : "0.00" }
    }
  }), [meta]);

  return (
    <div className="w-full flex flex-col gap-2">
      <ChartHeader meta={meta} />
      <div className="w-full overflow-x-auto h-[420px]">
        <div style={{ minWidth: 900 }} className="h-full">
          <ReactApexChart options={options} series={series} type="bar" height="100%" />
        </div>
      </div>
    </div>
  );
}

