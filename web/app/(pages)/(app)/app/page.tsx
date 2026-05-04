import { Button } from "../../../components/Button";
import { Map as MapIcon } from "lucide-react";
import { KPICard } from "../../../components/KPICard";
import { InsightCard } from "../../../components/InsightCard";
import { HOME_KPIS, RECENT_ACTIVITIES } from "../../../mocks/homeData";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-8 py-6">
      <section>
        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">Painel Estratégico</h1>
        <p className="text-gray-500 font-medium mt-1">Bem-vindo de volta. Dados atualizados para <span className="text-primary font-bold">Maio/2026</span>.</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HOME_KPIS.map((kpi, i) => <KPICard key={i} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Banner Principal */}
          <section className="card-base bg-primary relative overflow-hidden p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
            <div className="relative z-10 max-w-md">
              <h2 className="text-3xl font-black uppercase mb-4">Explore o Mapa da Inadimplência</h2>
              <p className="text-white/70 font-medium mb-8 leading-relaxed">Analise o crescimento projetado e movimentos de mercado por região.</p>
              <Button link="/app/graficos" className="bg-secondary text-primary px-10 py-4 font-black rounded-2xl hover:scale-105">
                ACESSAR ANÁLISES <MapIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          </section>

          {/* Destaques Regionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightCard title="Melhor Performance: Sul" desc="Score IE atingiu pico histórico de 4.2." type="success" />
            <InsightCard title="Atenção Requerida: SE" desc="Sergipe apresenta elevação atípica no Aging." type="error" />
          </div>
        </div>

        {/* Sidebar de Atividade */}
        <aside className="card-base bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="font-black text-primary uppercase text-sm tracking-widest mb-6">Atividade Recente</h3>
          <div className="space-y-6">
            {RECENT_ACTIVITIES.map((act, i) => (
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