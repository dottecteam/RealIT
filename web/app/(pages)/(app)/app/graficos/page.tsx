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
import { Timer, Loader2 } from "lucide-react";

import { useApiData } from "../../../../hooks/useApiData";
import { CATEGORIAS, REGIOES } from "../../../../constants/ChartOptions";

export default function AnalyticsPage() {
  const { data: dashboardData, isLoading } = useApiData<any>('/data/dashboard-charts');

  // Mapeamento para o Eixo I (Risco de Crédito)
  const seriesEixoI = useMemo(() => {
    if (!dashboardData?.ranking) return [];
    const scores = CATEGORIAS.map(uf => {
      const state = dashboardData.ranking.find((d: any) => d.uf === uf);
      // Garanta que o campo 'score_eixo_i' seja o que o backend envia
      return state ? state.score_eixo_i : 0;
    });
    return [{ name: "Risco de Crédito (RC)", data: scores }];
  }, [dashboardData]);

  const seriesEixoII = useMemo(() => {
    if (!dashboardData?.ranking) return [];
    const scores = CATEGORIAS.map(uf => {
      const state = dashboardData.ranking.find((d: any) => d.uf === uf);
      return state ? state.score_eixo_ii : 0;
    });
    return [{ name: "Inclusão e Expansão (IE)", data: scores }];
  }, [dashboardData]);

  const { seriesRegiaoI, seriesRegiaoII } = useMemo(() => {
    if (!dashboardData?.ranking) return { seriesRegiaoI: [], seriesRegiaoII: [] };

    const calcMedia = (regiaoNome: string, eixo: 'score_eixo_i' | 'score_eixo_ii') => {
      const searchName = regiaoNome === "C-Oeste" ? "Centro-Oeste" : regiaoNome;

      const estadosDaRegiao = dashboardData.ranking.filter((d: any) => d.regiao === searchName);
      if (estadosDaRegiao.length === 0) return 0;

      const soma = estadosDaRegiao.reduce((acc: number, curr: any) => acc + curr[eixo], 0);
      return Number((soma / estadosDaRegiao.length).toFixed(2));
    };

    const scoresRegiaoI = REGIOES.map(regiao => calcMedia(regiao, 'score_eixo_i'));
    const scoresRegiaoII = REGIOES.map(regiao => calcMedia(regiao, 'score_eixo_ii'));

    return {
      seriesRegiaoI: [{ name: "RC Médio Regional", data: scoresRegiaoI }],
      seriesRegiaoII: [{ name: "IE Médio Regional", data: scoresRegiaoII }]
    };
  }, [dashboardData]);

  const evolutionData = dashboardData?.history;


  // ==========================================
  // 2. DADOS ZERADOS (Projeção Preditiva)
  // ==========================================
  // Apenas a projeção fica zerada pois depende de lógica futura no backend
  const mockProjecaoZerado = [
    { name: "RC Histórico", data: [0, 0, 0, 0, 0, 0] },
    { name: "RC Projeção", data: [0, 0, 0, 0, 0, 0] }
  ];

  return (
    <MapProvider>
      <div className="flex flex-col gap-8 sm:pb-15 animate-in fade-in duration-700">

        {/* Cabeçalho de Contexto */}
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

        {/* Grid Principal: Mapa e Rankings Regionais */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 group">
            <div className="card-base bg-white h-full border border-transparent hover:border-primary/10 transition-all duration-500 shadow-xl">
              <BrasilMap data={dashboardData?.ranking || []} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <ChartCard title="Risco Regional (Eixo I)" info="Média ponderada de inadimplência e fragilidade.">
              <div className="h-[250px] mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <RankingChart series={seriesRegiaoI} title={""} />
                )}
              </div>
            </ChartCard>
            <ChartCard title="Inclusão Regional (Eixo II)" info="Nível de maturidade digital e crescimento.">
              <div className="h-[250px] mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <RankingChart series={seriesRegiaoII} title={""} />
                )}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Seção de Séries Temporais e Projeções */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Evolução Temporal dos Scores" info="Análise do comportamento histórico dos índices.">
            <div className="p-2 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-[280px]">
                  <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
              ) : (
                <EvolucaoScoresChart
                  categorias={evolutionData?.categories || []}
                  series={evolutionData?.series || []}
                />
              )}
            </div>
          </ChartCard>

          <ChartCard title="Modelagem Preditiva" info="Projeção baseada em regressão linear simples.">
            <div className="p-2">
              <ProjecaoScoreChart categorias={["Jan/24", "Abr/24", "Jul/24", "Out/24", "Jan/25", "Abr/25"]} marcadorProjecao="Jul/24" series={mockProjecaoZerado} />
            </div>
          </ChartCard>
        </section>

        {/* Seção Final: Ranking Detalhado UF */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-secondary rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Ranking por Estado</h2>
              <p className="text-sm text-gray-400 font-medium">Comparativo granular de performance entre as 27 UFs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <ChartCard title="Performance de Crédito por UF (Eixo I)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[450px]">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                  </div>
                ) : (
                  <RankingStates series={seriesEixoI} />
                )}
              </div>
            </ChartCard>

            <ChartCard title="Maturidade de Mercado por UF (Eixo II)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[450px]">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                  </div>
                ) : (
                  <RankingStates series={seriesEixoII} />
                )}
              </div>
            </ChartCard>
          </div>
        </section>

      </div>
    </MapProvider>
  );
}