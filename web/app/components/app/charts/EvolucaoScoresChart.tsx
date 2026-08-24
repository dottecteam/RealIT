"use client"

import { useMemo } from "react"
import { ReactApexChart } from "../../../hooks/useApexChart"
import { createLineOptions } from "../../../services/ApexCharts/createLineOptions"
import { CORES_DEFAULT_EVO, DASHES_DEFAULT_EVO } from "../../../constants/charts/chartOptions"
import { SeriesData } from "../../../types/components/chart"

interface EvolucaoScoresChartProps {
  categorias: string[]
  series: SeriesData[]
  cores?: string[]
  dashArray?: number[]
}

export function EvolucaoScoresChart({
  categorias,
  series,
  cores,
  dashArray
}: EvolucaoScoresChartProps) {

  const options = useMemo(() => {
    return createLineOptions({
      chart: {
        id: "evolucao-scores-chart-real",
      },
      categorias,
      cores: cores ?? CORES_DEFAULT_EVO,
      dashes: dashArray ?? DASHES_DEFAULT_EVO,
      tooltip: {
        style: {
          fontSize: "12px"
        }
      }
    });
  }, [categorias, cores, dashArray]);

  if (!series || series.length === 0 || series.every(s => !s.data || s.data.length === 0)) {
    return (
      <div className="w-full h-[350px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50 animate-in fade-in duration-300">
        <p className="text-sm font-semibold text-gray-400 italic">
          Nenhum dado histórico encontrado
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Não há registros de score de crédito suficientes para o período ou filtros selecionados.
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