"use client";

import { useMemo } from "react";
import { Button } from "../../../components/basic/Button";
import { Map as MapIcon, TrendingDown, TrendingUp, AlertCircle, Loader2, Info } from "lucide-react";
import { KPICard } from "../../../components/app/KPICard";
import { InsightCard } from "../../../components/app/InsightCard";
import { useApiData } from "../../../hooks/useApiData";

export default function DashboardHome() {
  const { data: dashboardData, isLoading } = useApiData<any>('/data/dashboard-charts');

  const kpiIndicators = useMemo(() => {
    if (!dashboardData?.ranking || dashboardData.ranking.length === 0) {
      return [
        { label: "Risco de Crédito (Eixo I)", val: "0.00", change: "Aguardando sincronia...", icon: TrendingDown, color: "var(--gray-400)" },
        { label: "Inclusão PIX (Eixo II)", val: "0.00", change: "Aguardando sincronia...", icon: TrendingUp, color: "var(--gray-400)" },
        { label: "UFs Processadas", val: "0", change: "Aguardando dados...", icon: MapIcon, color: "var(--gray-400)" },
        { label: "Mercados Diamante", val: "0", change: "Calculando clusters...", icon: AlertCircle, color: "var(--gray-400)" }
      ];
    }

    const ranking = dashboardData.ranking;
    const totalUfs = ranking.length;

    const somaRC = ranking.reduce((acc: number, curr: any) => acc + curr.score_eixo_i, 0);
    const mediaRC = (somaRC / totalUfs).toFixed(2);

    const somaIE = ranking.reduce((acc: number, curr: any) => acc + curr.score_eixo_ii, 0);
    const mediaIE = (somaIE / totalUfs).toFixed(2);

    const alertasDiamante = ranking.filter((r: any) => r.categoria === "DIAMANTE BRUTO").length;

    const ufsCriticas = ranking.filter((r: any) => r.score_eixo_i >= 3.0).length;
    const pctCritica = ((ufsCriticas / totalUfs) * 100).toFixed(1);

    const corRisco = Number(mediaRC) >= 3.0 ? "var(--error)" : "var(--success)";

    return [
      {
        label: "Risco de Crédito (Eixo I)",
        val: mediaRC,
        change: `${pctCritica}% das UFs sob atenção`,
        icon: TrendingDown,
        color: corRisco
      },
      {
        label: "Inclusão PIX (Eixo II)",
        val: mediaIE,
        change: "Média Nacional estável (1 a 5)",
        icon: TrendingUp,
        color: "var(--success)"
      },
      {
        label: "UFs Processadas",
        val: String(totalUfs),
        change: "Consolidado BCB e IBGE",
        icon: MapIcon,
        color: "var(--primary)"
      },
      {
        label: "Mercados Diamante",
        val: String(alertasDiamante),
        change: alertasDiamante > 0 ? "Clusters prontos para expansão" : "Nenhum cluster na matriz",
        icon: AlertCircle,
        color: alertasDiamante > 0 ? "var(--warning)" : "var(--gray-400)"
      }
    ];
  }, [dashboardData]);

  return (
    <div className="flex flex-col gap-8 py-6 animate-in fade-in duration-700">

      <section>
        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">
          Painel Estratégico
        </h1>
        <p className="text-gray-500 font-medium italic mt-1">
          Visão consolidada da metodologia cruzada <span className="text-primary font-bold">Risco vs. Inclusão</span>.
        </p>
      </section>

      {isLoading ? (
        <div className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-gray-400 text-xs font-semibold italic animate-pulse">
            Agregando matrizes macroeconômicas...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiIndicators.map((kpi, i) => (
            <KPICard
              key={i}
              label={kpi.label}
              val={kpi.val}
              change={kpi.change}
              icon={kpi.icon}
              color={kpi.color}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 w-full">

        <section className="card-base bg-primary relative overflow-hidden p-8 md:p-12 text-white shadow-2xl shadow-primary/20 rounded-3xl">
          <div className="relative z-10 md:px-20">
            <h2 className="md:text-3xl font-black uppercase mb-4 flex items-center gap-3 tracking-tight">
              <Info size={28} className="text-secondary" />
              Matriz de Oportunidades
            </h2>
            <p className="text-white/80 font-medium mb-8 leading-relaxed text-sm">
              Nossa modelagem cruza o <strong>Eixo I (Risco de Crédito)</strong>, indicando vulnerabilidade e inadimplência,
              com o <strong>Eixo II (Inclusão e Expansão)</strong>, medindo a tração tecnológica (PIX) e o crescimento demográfico.
              Acesse os gráficos para visualizar os perfis de agrupamento resultantes.
            </p>
            <Button link="/app/graficos" className="bg-secondary text-primary px-10 py-4 font-black rounded-2xl transition-transform duration-300 hover:scale-103 w-fit flex items-center gap-2 shadow-lg shadow-secondary/10">
              EXPLORAR OS GRÁFICOS <MapIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <InsightCard
            title="Atenção ao Eixo I (Risco)"
            desc="Estados com Score próximo a 5 exigem políticas de 'Fomento' ou 'Defesa' devido à alta volatilidade financeira ou fragilidade de renda."
            type="error"
          />
          <InsightCard
            title="Foco no Eixo II (Expansão)"
            desc="Mercados de alta maturidade digital (PIX consolidado) mitigam atritos na liquidação física e aceleram a adesão regional."
            type="success"
          />
        </div>

      </div>
    </div>
  );
}