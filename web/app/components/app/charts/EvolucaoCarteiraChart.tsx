"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { getEvolucaoCarteiraOptions } from "../../../services/ApexCharts/chartBuilder";

interface EvolucaoCarteiraChartProps {
  categories: string[]
  carteiraAtiva: number[]
  taxaInadimplencia: (number | null)[]
  taxaInadRegiao: (number | null)[]
  taxaInadNacional: (number | null)[]
  ufSigla: string
}

export function EvolucaoCarteiraChart(props: EvolucaoCarteiraChartProps) {
  const { categories, carteiraAtiva, taxaInadimplencia, taxaInadRegiao, taxaInadNacional, ufSigla } = props;

  const options = useMemo(() =>
    getEvolucaoCarteiraOptions(categories, ufSigla),
    [categories, ufSigla]);

  const series = useMemo(() => [
    { name: "Carteira Ativa", data: carteiraAtiva },
    { name: `Inadimplência ${ufSigla}`, data: taxaInadimplencia },
    { name: "Inadimplência Região", data: taxaInadRegiao },
    { name: "Inadimplência Brasil", data: taxaInadNacional },
  ], [carteiraAtiva, taxaInadimplencia, taxaInadRegiao, taxaInadNacional, ufSigla]);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div style={{ minWidth: 420 }} className="h-[300px]">
        <ReactApexChart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
    </div>
  );
}