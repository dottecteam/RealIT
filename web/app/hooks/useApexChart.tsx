"use client"
import dynamic from "next/dynamic"
import { ComponentType } from "react"

const loadingFallback = (
  <div className="w-full h-full flex items-center justify-center text-[#ADADAD]">
    Carregando gráfico...
  </div>
)

export const ReactApexChart = dynamic(
  () => import("react-apexcharts"),
  { ssr: false, loading: () => loadingFallback }
) as ComponentType<any>