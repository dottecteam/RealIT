"use client";

import { useMemo } from "react";
import { Button } from "../../../components/Button";
import { Map as MapIcon, TrendingDown, TrendingUp, AlertCircle, Map, Loader2, Info } from "lucide-react";
import { KPICard } from "../../../components/KPICard";
import { InsightCard } from "../../../components/InsightCard";

// Importando nosso hook real
import { useApiData } from "../../../hooks/useApiData";

export default function DashboardHome() {
  // Puxando os dados reais da API agregadora!
  const { data: dashboardData, isLoading } = useApiData<any>('/data/dashboard-charts');

  // Construindo os KPIs com base na metodologia Eixo I e Eixo II
  const kpis = useMemo(() => {
    if (!dashboardData?.ranking || dashboardData.ranking.length === 0) {
      return [
        { label: "Risco de Crédito Médio (Eixo I)", val: "0.00", change: "-", icon: TrendingDown, color: "var(--gray-400)" },
        { label: "Inclusão Média (Eixo II)", val: "0.00", change: "-", icon: TrendingUp, color: "var(--gray-400)" },
        { label: "Cobertura (UFs)", val: "0", change: "-", icon: Map, color: "var(--gray-400)" },
        { label: "Oportunidades ('Diamante')", val: "0", change: "-", icon: AlertCircle, color: "var(--gray-400)" }
      ];
    }

    const ranking = dashboardData.ranking;
    const totalUfs = ranking.length;
    
    // Média Nacional do Eixo I (Quanto MAIOR, PIOR - Inadimplência, Renda, Aging e Vulnerabilidade)
    const somaRC = ranking.reduce((acc: number, curr: any) => acc + curr.score_eixo_i, 0);
    const mediaRC = (somaRC / totalUfs).toFixed(2);

    // Média Nacional do Eixo II (Quanto MAIOR, MELHOR - Maturidade Pix e Demografia)
    const somaIE = ranking.reduce((acc: number, curr: any) => acc + curr.score_eixo_ii, 0);
    const mediaIE = (somaIE / totalUfs).toFixed(2);

    // Identificação de UFs "DIAMANTE BRUTO" (Risco Baixo < 2 e Inclusão Baixa < 2, prontas para exploração)
    const alertasDiamante = ranking.filter((r: any) => r.categoria === "DIAMANTE BRUTO").length;

    // Lógica visual: Se a média de Risco passou de 3 (médio/alto), a cor fica alerta/warning
    const corRC = Number(mediaRC) >= 3 ? "var(--error)" : "var(--success)";

    return [
      { label: "Risco de Crédito (Eixo I)", val: mediaRC, change: "Média Nacional (Escala 1 a 5)", icon: TrendingDown, color: corRC },
      { label: "Inclusão PIX (Eixo II)", val: mediaIE, change: "Média Nacional (Escala 1 a 5)", icon: TrendingUp, color: "var(--tertiary)" },
      { label: "UFs Processadas", val: String(totalUfs), change: "Dados consolidados do BCB e IBGE", icon: Map, color: "var(--primary)" },
      { label: "Mercados Diamante", val: String(alertasDiamante), change: "Regiões de baixo risco para expansão", icon: AlertCircle, color: "var(--warning)" }
    ];
  }, [dashboardData]);

  // Atividades recentes (Mantido fixo pois requer uma rota própria de logs futuramente)
  const recentActivities = [
    { title: "Sincronização BCB/IBGE", desc: "Variáveis macroeconômicas atualizadas", time: "Há pouco" },
    { title: "Matriz de Decisão", desc: "Scores e Categorias reprocessados", time: "Hoje" },
  ];

  return (
    <div className="flex flex-col gap-8 py-6 animate-in fade-in duration-700">
      <section>
        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">Painel Estratégico</h1>
        <p className="text-gray-500 font-medium mt-1">Visão consolidada da metodologia cruzada <span className="text-primary font-bold">Risco vs. Inclusão</span>.</p>
      </section>

      {/* Renderização condicional para exibir o Loader enquanto a API trabalha */}
      {isLoading ? (
        <div className="w-full flex justify-center py-10">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => <KPICard key={i} {...kpi} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Banner Principal Explicativo */}
          <section className="card-base bg-primary relative overflow-hidden p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl font-black uppercase mb-4 flex items-center gap-3">
                <Info size={28} className="text-secondary" />
                Matriz de Oportunidades
              </h2>
              <p className="text-white/80 font-medium mb-8 leading-relaxed text-sm">
                Nossa modelagem cruza o <strong>Eixo I (Risco de Crédito)</strong>, indicando vulnerabilidade e inadimplência, 
                com o <strong>Eixo II (Inclusão e Expansão)</strong>, medindo a tração tecnológica (PIX) e o crescimento demográfico. 
                Acesse os gráficos para visualizar os perfis resultantes (ex: Diamante, Orgânico, Maduro).
              </p>
              <Button link="/app/graficos" className="bg-secondary text-primary px-10 py-4 font-black rounded-2xl hover:scale-105 w-fit">
                EXPLORAR O MAPA TÉRMICO <MapIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          </section>

          {/* Destaques Regionais Atualizados com base na documentação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightCard 
              title="Atenção ao Eixo I (Risco)" 
              desc="Estados com Score próximo a 5 exigem políticas de 'Fomento' ou 'Defesa' devido a alta inadimplência ou fragilidade de renda." 
              type="error" 
            />
            <InsightCard 
              title="Foco no Eixo II (Expansão)" 
              desc="Mercados de alta maturidade digital (PIX consolidado) reduzem custos operacionais e aceleram a adesão." 
              type="success" 
            />
          </div>
        </div>

        {/* Sidebar de Atividade */}
        <aside className="card-base bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-black text-primary uppercase text-sm tracking-widest mb-6">Atividade do Sistema</h3>
          <div className="space-y-6 flex-1">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex gap-4 group cursor-default">
                <div className="w-1 bg-gray-100 group-hover:bg-primary transition-colors rounded-full" />
                <div>
                  <p className="text-sm font-bold text-gray-800">{act.title}</p>
                  <p className="text-xs text-gray-400">{act.desc}</p>
                  <p className="text-[10px] text-gray-300 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}