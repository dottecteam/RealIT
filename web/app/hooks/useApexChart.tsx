"use client";

import dynamic from "next/dynamic";
import React, { ComponentType } from "react";
import { Props as ApexChartProps } from "react-apexcharts";

const loadingFallback = (
  <div className="w-full h-full min-h-[320px] flex items-center justify-center text-gray-400 font-medium italic text-sm animate-pulse">
    Carregando gráfico...
  </div>
);

export const ReactApexChart = React.memo(
  dynamic(
    () => import("react-apexcharts"),
    {
      ssr: false,
      loading: () => loadingFallback
    }
  )
) as ComponentType<ApexChartProps>;

ReactApexChart.displayName = "ReactApexChart";