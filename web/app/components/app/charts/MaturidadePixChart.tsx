"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { getMaturidadePixOptions } from "../../../services/ApexCharts/chartBuilder";

interface MaturidadePixMetrica {
  uf: number
  regiao: number
  nacional: number
}

interface MaturidadePixChartProps {
  qtPerCapita: MaturidadePixMetrica
  vlPerCapita: MaturidadePixMetrica
  ufSigla: string
}

export function MaturidadePixChart({ qtPerCapita, vlPerCapita, ufSigla }: MaturidadePixChartProps) {

  const options = useMemo(() => getMaturidadePixOptions(), []);

  const series = useMemo(() => [
    { name: ufSigla, data: [qtPerCapita.uf, vlPerCapita.uf] },
    { name: "Região", data: [qtPerCapita.regiao, vlPerCapita.regiao] },
    { name: "Brasil", data: [qtPerCapita.nacional, vlPerCapita.nacional] },
  ], [qtPerCapita, vlPerCapita, ufSigla]);

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={220}
        width="100%"
      />
    </div>
  );
}