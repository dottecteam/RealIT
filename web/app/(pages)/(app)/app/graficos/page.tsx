"use client";

import { useMemo } from "react";
import { RankingChart } from "../../../../components/RankingChart";
import { BrasilMap } from "../../../../components/BrasilMap";
import FilterBar from "../../../../components/FilterBar";
import RegionFilter from "../../../../components/RegionFilter";
import { RankingStates } from "../../../../components/RankingStates";
import { EvolucaoScoresChart } from "../../../../components/EvolucaoScoresChart";
import { ProjecaoScoreChart } from "../../../../components/ProjecaoScoreChart";
import { MapProvider } from "../../../../contexts/MapContext";
import { ChartCard } from "../../../../components/ChartCard";
import { Loader2 } from "lucide-react";
import { useApiData } from "../../../../hooks/useApiData"; 
import { CATEGORIAS, REGIOES } from "../../../../constants/ChartOptions";

export default function AnalyticsPage() {
  // Chamada única para o endpoint agregador da API
  const { data: dashboardData, isLoading } = useApiData<any>('/data/dashboard-charts');

  // --- 1. MAPEAMENTO DE DADOS POR UF (RANKING) ---
  
  // Eixo I: Risco de Crédito
  const seriesEixoI = useMemo(() => {
    if (!dashboardData?.ranking) return [];
    const scores = CATEGORIAS.map(ufSigla => {
      const item = dashboardData.ranking.find((d: any) => d.uf === ufSigla);
      return item ? item.score_eixo_i : 0;
    });
    return [{ name: "Risco de Crédito (RC)", data: scores }];
  }, [dashboardData]);

  // Eixo II: Inclusão e Expansão[cite: 4]
  const seriesEixoII = useMemo(() => {
    if (!dashboardData?.ranking) return [];
    const scores = CATEGORIAS.map(ufSigla => {
      const item = dashboardData.ranking.find((d: any) => d.uf === ufSigla);
      return item ? item.score_eixo_ii : 0;
    });
    return [{ name: "Inclusão e Expansão (IE)", data: scores }];
  }, [dashboardData]);


  const { seriesRegiaoI, seriesRegiaoII } = useMemo(() => {
    if (!dashboardData?.ranking) return { seriesRegiaoI: [], seriesRegiaoII: [] };

    const calcMedias = REGIOES.map(regiaoNome => {
      const searchName = regiaoNome === "C-Oeste" ? "Centro-Oeste" : regiaoNome;
      const estados = dashboardData.ranking.filter((d: any) => d.regiao === searchName);
      
      if (estados.length === 0) return { r: 0, i: 0 };
      
      const somaI = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_i, 0);
      const somaII = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_ii, 0);
      
      return {
        r: Number((somaI / estados.length).toFixed(2)),
        i: Number((somaII / estados.length).toFixed(2))
      };
    });

    return {
      seriesRegiaoI: [{ name: "RC Médio Regional", data: calcMedias.map(m => m.r) }],
      seriesRegiaoII: [{ name: "IE Médio Regional", data: calcMedias.map(m => m.i) }]
    };
  }, [dashboardData]);

  const mockProjecao = [
    { name: "Histórico", data: [0,0,0,0,0,0] },
    { name: "Projeção", data: [0,0,0,0,0,0] }
  ];

  return (
    <MapProvider>
      <div className="flex flex-col gap-8 sm:pb-15 animate-in fade-in duration-700">
        
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-100">
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

        {/* Grid do Mapa e Rankings Regionais */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 group">
            <div className="card-base bg-white h-full border border-transparent hover:border-primary/10 transition-all duration-500 shadow-xl">
              {/* Mapa recebe o array de ranking para o modo Heatmap[cite: 4] */}
              <BrasilMap data={dashboardData?.ranking || []} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <ChartCard title="Risco Regional (Eixo I)">
              <div className="h-[250px] mt-4">
                {isLoading ? <Loader2 className="animate-spin m-auto" /> : <RankingChart series={seriesRegiaoI} title="" />}
              </div>
            </ChartCard>

            <ChartCard title="Inclusão Regional (Eixo II)">
              <div className="h-[250px] mt-4">
                {isLoading ? <Loader2 className="animate-spin m-auto" /> : <RankingChart series={seriesRegiaoII} title="" />}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Séries Temporais e Projeções */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Evolução Temporal dos Scores" info="Histórico das variáveis macroeconômicas.">
            <div className="p-2">
              {isLoading ? (
                <div className="h-[280px] flex"><Loader2 className="animate-spin m-auto" /></div>
              ) : (
                <EvolucaoScoresChart 
                  categorias={dashboardData?.history?.categories || []} 
                  series={dashboardData?.history?.series || []} 
                />
              )}
            </div>
          </ChartCard>

          <ChartCard title="Modelagem Preditiva" info="Tendência baseada em regressão linear.">
            <div className="p-2">
              <ProjecaoScoreChart 
                categorias={["Jan/24", "Abr/24", "Jul/24", "Out/24", "Jan/25", "Abr/25"]} 
                marcadorProjecao="Jul/24" 
                series={mockProjecao} 
              />
            </div>
          </ChartCard>
        </section>

        {/* Ranking Detalhado por UF */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-secondary rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Ranking por Estado</h2>
              <p className="text-sm text-gray-400 font-medium">Comparativo granular entre as 27 UFs.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <ChartCard title="Performance de Crédito por UF (Eixo I)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-50">
                {isLoading ? <Loader2 className="animate-spin m-auto" /> : <RankingStates series={seriesEixoI} />}
              </div>
            </ChartCard>

            <ChartCard title="Maturidade de Mercado por UF (Eixo II)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
                {isLoading ? <Loader2 className="animate-spin m-auto" /> : <RankingStates series={seriesEixoII} />}
              </div>
            </ChartCard>
          </div>
        </section>
      </div>
    </MapProvider>
  );
}