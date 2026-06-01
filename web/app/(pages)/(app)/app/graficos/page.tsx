"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";

import { RankingChart } from "../../../../components/app/charts/RankingChart";
import { BrasilMap } from "../../../../components/app/map/BrasilMap";
import FilterBar from "../../../../components/app/FilterBar";
import RegionFilter from "../../../../components/app/map/RegionFilter";
import { RankingStates } from "../../../../components/app/charts/RankingStates";
import { EvolucaoScoresChart } from "../../../../components/app/charts/EvolucaoScoresChart";
import { ProjecaoScoreChart } from "../../../../components/app/charts/ProjecaoScoreChart";
import { ChartCard } from "../../../../components/app/ChartCard";
import { MapProvider } from "../../../../contexts/MapContext";

import { useApiData } from "../../../../hooks/useApiData";
import { useAnalyticsCalculations } from "../../../../hooks/useAnalyticsCalculations";
import { DashboardData } from "../../../../types/components/dashboard";

export default function AnalyticsPage() {
  // Agora usamos a interface DashboardData para garantir a segurança dos tipos
  const { data: dashboardData, isLoading } = useApiData<DashboardData>("/data/dashboard-charts");

  // Passamos o dado tipado para o seu hook
  const { seriesEixoI, seriesEixoII, seriesRegiaoI, seriesRegiaoII } = useAnalyticsCalculations(dashboardData);

  const mockProjecao = useMemo(() => [
    { name: "Histórico", data: [0, 0, 0, 0, 0, 0] },
    { name: "Projeção", data: [0, 0, 0, 0, 0, 0] },
  ], []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <MapProvider>
      <div className="flex flex-col gap-8 sm:pb-15 animate-in fade-in duration-700" id="export-pdf">

        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
              Inteligência Geográfica
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2 italic">
              Cruzamento de dados públicos e variáveis de crédito por UF.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <RegionFilter />
            <FilterBar />
          </div>
        </header>

        {/* Seção Principal: Mapa e Resumo */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="card-base bg-white h-full border border-transparent hover:border-primary/10 shadow-xl transition-all">
              <BrasilMap data={dashboardData?.ranking || []} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ChartCard title="Risco Regional (Eixo I)">
              <div className="h-62.5 mt-4">
                <RankingChart series={seriesRegiaoI} />
              </div>
            </ChartCard>
            <ChartCard title="Inclusão Regional (Eixo II)">
              <div className="h-62.5 mt-4">
                <RankingChart series={seriesRegiaoII} />
              </div>
            </ChartCard>
          </div>
        </section>

        {/* Seção de Tendências */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Evolução Temporal dos Scores" info="Histórico das variáveis macroeconômicas.">
            {dashboardData && (
              <EvolucaoScoresChart
                categorias={dashboardData.history.categories}
                series={dashboardData.history.series}
              />
            )}
          </ChartCard>
          <ChartCard title="Modelagem Preditiva" info="Tendência baseada em regressão linear.">
            <ProjecaoScoreChart
              categorias={["Jan/24", "Abr/24", "Jul/24", "Out/24", "Jan/25", "Abr/25"]}
              marcadorProjecao="Jul/24"
              series={mockProjecao}
            />
          </ChartCard>
        </section>

        {/* Ranking Detalhado */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Ranking por Estado</h2>
          <div className="grid grid-cols-1 gap-8">
            <ChartCard title="Performance de Crédito (Eixo I)">
              <RankingStates series={seriesEixoI} />
            </ChartCard>
            <ChartCard title="Maturidade de Mercado (Eixo II)">
              <RankingStates series={seriesEixoII} />
            </ChartCard>
          </div>
        </section>
      </div>
    </MapProvider>
  );
}