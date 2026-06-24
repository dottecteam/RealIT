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
import {
  FilterProvider,
  useFilters,
  isRankingRowVisible,
} from "../../../../contexts/FilterContext";

import { useApiData } from "../../../../hooks/useApiData";
import { DashboardData } from "../../../../types/components/dashboard";
import { CATEGORIAS, REGIOES } from "../../../../constants/charts/chartOptions";
import { BRASIL_PATHS, type Regiao } from "../../../../constants/map/brasilMapPaths";

export default function AnalyticsPage() {
  return (
    <FilterProvider>
      <MapProvider>
        <AnalyticsPageInner />
      </MapProvider>
    </FilterProvider>
  );
}

function AnalyticsPageInner() {
  const { serverParams, client: clientFilters } = useFilters();

  // Os parâmetros de servidor (período/indicador) vão como query params na API.
  const { data: dashboardData, isLoading } = useApiData<DashboardData>(
    "/data/dashboard-charts",
    serverParams
  );

  const fullRanking = useMemo(
    () => ((dashboardData?.ranking as any[]) ?? []),
    [dashboardData]
  );

  // Filtragem client-side (faixas de score + região/UF ocultas).
  const filteredRanking = useMemo(
    () => fullRanking.filter((r) => isRankingRowVisible(r, clientFilters)),
    [fullRanking, clientFilters]
  );

  // Conjunto de UFs que devem aparecer apagadas no mapa.
  const ufsOcultasSet = useMemo(() => {
    const set = new Set<string>();
    for (const uf of clientFilters.ufsOcultas) set.add(uf);
    for (const estado of BRASIL_PATHS) {
      if (clientFilters.regioesOcultas.includes(estado.regiao as Regiao)) {
        set.add(estado.uf);
      }
    }
    for (const row of fullRanking) {
      if (!isRankingRowVisible(row, clientFilters)) set.add(row.uf);
    }
    return set;
  }, [fullRanking, clientFilters]);

  const ufsVisiveis = useMemo(
    () => CATEGORIAS.filter((uf) => !ufsOcultasSet.has(uf)),
    [ufsOcultasSet]
  );

  const regioesVisiveis = useMemo(
    () =>
      REGIOES.filter((regiaoNome) => {
        const searchName = regiaoNome === "C-Oeste" ? "Centro-Oeste" : regiaoNome;
        return !clientFilters.regioesOcultas.includes(searchName as Regiao);
      }),
    [clientFilters.regioesOcultas]
  );

  const seriesEixoI = useMemo(() => {
    if (filteredRanking.length === 0) return [];
    const scores = ufsVisiveis.map((ufSigla) => {
      const item = filteredRanking.find((d: any) => d.uf === ufSigla);
      return item ? item.score_eixo_i : 0;
    });
    return [{ name: "Risco de Crédito (RC)", data: scores }];
  }, [filteredRanking, ufsVisiveis]);

  const seriesEixoII = useMemo(() => {
    if (filteredRanking.length === 0) return [];
    const scores = ufsVisiveis.map((ufSigla) => {
      const item = filteredRanking.find((d: any) => d.uf === ufSigla);
      return item ? item.score_eixo_ii : 0;
    });
    return [{ name: "Inclusão e Expansão (IE)", data: scores }];
  }, [filteredRanking, ufsVisiveis]);

  const { seriesRegiaoI, seriesRegiaoII } = useMemo(() => {
    if (filteredRanking.length === 0) return { seriesRegiaoI: [], seriesRegiaoII: [] };
    const calcMedias = regioesVisiveis.map((regiaoNome) => {
      const searchName = regiaoNome === "C-Oeste" ? "Centro-Oeste" : regiaoNome;
      const estados = filteredRanking.filter((d: any) => d.regiao === searchName);
      if (estados.length === 0) return { r: 0, i: 0 };
      const somaI = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_i, 0);
      const somaII = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_ii, 0);
      return {
        r: Number((somaI / estados.length).toFixed(2)),
        i: Number((somaII / estados.length).toFixed(2)),
      };
    });
    return {
      seriesRegiaoI: [{ name: "RC Médio Regional", data: calcMedias.map((m) => m.r) }],
      seriesRegiaoII: [{ name: "IE Médio Regional", data: calcMedias.map((m) => m.i) }],
    };
  }, [filteredRanking, regioesVisiveis]);

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
            <BrasilMap data={fullRanking} ufsOcultas={ufsOcultasSet} />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ChartCard title="Risco Regional (Eixo I)">
            <div className="h-62.5 mt-4">
              <RankingChart title="Risco Regional (Eixo I)" series={seriesRegiaoI} categories={regioesVisiveis} />
            </div>
          </ChartCard>
          <ChartCard title="Inclusão Regional (Eixo II)">
            <div className="h-62.5 mt-4">
              <RankingChart title="Inclusão Regional (Eixo II)" series={seriesRegiaoII} categories={regioesVisiveis} />
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
            <RankingStates series={seriesEixoI} categories={ufsVisiveis} />
          </ChartCard>
          <ChartCard title="Maturidade de Mercado (Eixo II)">
            <RankingStates series={seriesEixoII} categories={ufsVisiveis} />
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
