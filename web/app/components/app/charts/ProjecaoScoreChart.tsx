"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../../../hooks/useApexChart"
import { createLineOptions } from "../../../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_PRO, DASHES_PRO } from "../../../constants/charts/chartOptions"
import { SeriesData } from "../../../types/components/chart"

interface ProjecaoScoreChartProps {
  categorias: string[]
  series: SeriesData[]
  marcadorProjecao?: string;
}

export function ProjecaoScoreChart({
  categorias,
  series,
  marcadorProjecao
}: ProjecaoScoreChartProps) {

  const options = useMemo(() => {
    return createLineOptions({
      chart: {
        id: "projecao-score-chart-predict",
      },
      categorias,
      cores: CORES_DEFAULT_PRO,
      dashes: DASHES_PRO,
      markerSizes: [0, 4, 0, 4],

      ...(marcadorProjecao && {
        annotations: {
          xaxis: [{
            x: marcadorProjecao,
            borderColor: "var(--gray-300)",
            strokeDashArray: 5,
            label: {
              text: "INÍCIO DA PROJEÇÃO",
              style: {
                color: "var(--gray-500)",
                background: "transparent",
                fontSize: "9px",
                fontWeight: "bold" as const,
              },
            },
          }],
        },
      }),
    });
  }, [categorias, marcadorProjecao]);

  if (!series || series.length === 0) {
    return (
      <div className="w-full h-[350px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
        <p className="text-sm font-semibold text-gray-400 italic">
          Modelagem preditiva em desenvolvimento
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          As projeções de cenários futuros estarão disponíveis nas próximas atualizações do ecossistema.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: 500 }} className="h-[350px]">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}