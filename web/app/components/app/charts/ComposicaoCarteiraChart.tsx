"use client";

import { useMemo } from "react";
import { ReactApexChart } from "../../../hooks/useApexChart";
import { getComposicaoCarteiraOptions } from "../../../services/ApexCharts/chartBuilder";

interface ComposicaoCarteiraChartProps {
  classes: string[]
  uf: number[]
  regiao: number[]
  nacional: number[]
  ufSigla: string
}

const CLASSE_LABELS: Record<string, string> = {
  a: "Classe A", b: "Classe B", c: "Classe C", d: "Classe D", e: "Classe E",
};

export function ComposicaoCarteiraChart({ classes, uf, regiao, nacional, ufSigla }: ComposicaoCarteiraChartProps) {

  const options = useMemo(() =>
    getComposicaoCarteiraOptions([ufSigla, "Região", "Brasil"]),
    [ufSigla]);

  const series = useMemo(() =>
    classes.map((cls, i) => ({
      name: CLASSE_LABELS[cls] ?? cls.toUpperCase(),
      data: [
        Number((uf[i] * 100).toFixed(2)),
        Number((regiao[i] * 100).toFixed(2)),
        Number((nacional[i] * 100).toFixed(2)),
      ],
    })),
    [classes, uf, regiao, nacional]
  );

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="bar" height={240} width="100%" />
    </div>
  );
}