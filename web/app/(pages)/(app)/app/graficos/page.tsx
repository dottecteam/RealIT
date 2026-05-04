import { RankingChart } from "../../../../components/RankingChart";
import { BrasilMap } from "../../../../components/BrasilMap";
import FilterBar from "../../../../components/FilterBar";
import RegionFilter from "../../../../components/RegionFilter";
import { RankingStates } from "../../../../components/RankingStates";
import { dadosEixoI_Ranking, dadosEixoII_Ranking, dadosEixoI_Score, dadosEixoII_Score } from "../../../../mocks/chartData";
import { EvolucaoScoresChart } from "../../../../components/EvolucaoScoresChart";
import { ProjecaoScoreChart } from "../../../../components/ProjecaoScoreChart";
import { MapProvider } from "../../../../contexts/MapContext";
import { ChartCard } from "../../../../components/ChartCard";
import { Timer } from "lucide-react";

const periodos = ["Jan/22", "Abr/22", "Jul/22", "Out/22", "Jan/23", "Abr/23", "Jul/23", "Out/23", "Jan/24", "Abr/24", "Jul/24"]
const mesesProjecao = ["Jan/23", "Abr/23", "Jul/23", "Out/23", "Jan/24", "Abr/24", "Jul/24", "Out/24", "Jan/25", "Abr/25", "Jul/25"]

export default function AnalyticsPage() {
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
          {/* Widget do Mapa - Destaque Principal */}
          <div className="lg:col-span-8 group">
            <div className="card-base bg-white h-full border border-transparent hover:border-primary/10 transition-all duration-500 shadow-xl">
              <BrasilMap />
            </div>
          </div>

          {/* Widget lateral de Rankings Regionais */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ChartCard
              title="Risco Regional (Eixo I)"
              info="Média ponderada de inadimplência e fragilidade de renda por região."
            >
              <div className="h-[250px] mt-4">
                <RankingChart series={dadosEixoI_Score} title={""} />
              </div>
            </ChartCard>

            <ChartCard
              title="Inclusão Regional (Eixo II)"
              info="Nível de maturidade digital e crescimento populacional regional."
            >
              <div className="h-[250px] mt-4">
                <RankingChart series={dadosEixoII_Score} title={""} />
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Seção de Séries Temporais e Projeções */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Evolução Temporal dos Scores"
            info="Análise do comportamento histórico dos índices RC e IE."
          >
            <div className="p-2 space-y-4">
              <EvolucaoScoresChart categorias={periodos} series={[{ name: "RC — Nacional", data: [2.4, 2.3, 2.1, 2.2, 2.2, 2.0] }]} />
              <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                <Timer className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <strong>Insight:</strong> A estabilidade observada no Eixo I sugere uma recuperação da capacidade de pagamento média nas metrópoles.
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Modelagem Preditiva"
            info="Projeção baseada em regressão linear simples sobre dados do último semestre."
          >
            <div className="p-2">
              <ProjecaoScoreChart categorias={mesesProjecao} marcadorProjecao="Jul/24" series={[
                { name: "RC Histórico", data: [2.0, 2.1, 1.9, 1.8, null, null] },
                { name: "RC Projeção", data: [null, null, null, 1.8, 1.7, 1.6] }
              ]} />
            </div>
          </ChartCard>
        </section>

        {/* Seção Final: Ranking Detalhado UF */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-secondary rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Ranking por Estado</h2>
              <p className="text-sm text-gray-400 font-medium">Comparativo granular de performance entre as 27 unidades federativas.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <ChartCard title="Performance de Crédito por UF (Eixo I)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-50">
                <RankingStates series={dadosEixoI_Ranking} />
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Líder do Eixo</p>
                  <p className="text-xl font-bold text-primary">São Paulo</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menor Inadimplência</p>
                  <p className="text-xl font-bold text-success">Santa Catarina</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maior Fragilidade</p>
                  <p className="text-xl font-bold text-error">Piauí</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Maturidade de Mercado por UF (Eixo II)">
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-50">
                <RankingStates series={dadosEixoII_Ranking} />
              </div>
            </ChartCard>
          </div>
        </section>
      </div>
    </MapProvider>
  )
}