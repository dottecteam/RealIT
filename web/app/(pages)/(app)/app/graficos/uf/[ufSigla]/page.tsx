"use client";

import { useParams, useRouter } from "next/navigation";
import { useApiData } from "@/app/hooks/useApiData";
import { ChartCard } from "@/app/components/app/ChartCard";
import { NivelEstadual } from "@/app/components/app/map/NivelEstadual";
import { MaturidadePixChart } from "@/app/components/app/charts/MaturidadePixChart";
import { ComposicaoCarteiraChart } from "@/app/components/app/charts/ComposicaoCarteiraChart";
import { EvolucaoCarteiraChart } from "@/app/components/app/charts/EvolucaoCarteiraChart";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EstadoAnalyticsPage() {
    const { ufSigla } = useParams();
    const router = useRouter();
    const ufUpper = String(ufSigla).toUpperCase();

    const { data: estadualData, isLoading } = useApiData<any>(
        "/data/estadual-charts",
        { uf: ufUpper }
    );

    const handleUFChange = (novaUF: string) => {
        router.push(`/app/graficos/uf/${novaUF.toLowerCase()}`);
    };

    if (isLoading || !estadualData) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <p className="text-xs text-gray-400 italic">Carregando dados de {ufUpper}...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-6 container-responsive">
            {/* Botão de navegação */}
            <button
                onClick={() => router.push("/app/graficos")}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider w-fit"
            >
                <ArrowLeft size={14} /> Voltar ao mapa nacional
            </button>

            {/* 
         NivelEstadual aqui funciona como um "Header de Navegação" 
         Ele renderiza as pílulas (como no seu print) e ao clicar, 
         dispara o handleUFChange que faz o router.push 
      */}
            <NivelEstadual onUFChange={handleUFChange} active={ufUpper}>
                {/* O conteúdo original do print entra aqui */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title="Maturidade Pix" info="Transações e volume per capita de Pix.">
                        <MaturidadePixChart
                            qtPerCapita={estadualData.maturidadePix.qtPerCapita}
                            vlPerCapita={estadualData.maturidadePix.vlPerCapita}
                            ufSigla={ufUpper}
                        />
                    </ChartCard>

                    <ChartCard title="Composição por Classe Social" info="Distribuição da carteira ativa.">
                        <ComposicaoCarteiraChart
                            classes={estadualData.composicaoCarteira.classes}
                            uf={estadualData.composicaoCarteira.uf}
                            regiao={estadualData.composicaoCarteira.regiao}
                            nacional={estadualData.composicaoCarteira.nacional}
                            ufSigla={ufUpper}
                        />
                    </ChartCard>
                </div>

                <div className="w-full">
                    <ChartCard title="Evolução da Carteira Ativa e Inadimplência">
                        <EvolucaoCarteiraChart
                            categories={estadualData.evolucaoCarteira.categories}
                            carteiraAtiva={estadualData.evolucaoCarteira.carteiraAtiva}
                            taxaInadimplencia={estadualData.evolucaoCarteira.taxaInadimplencia}
                            taxaInadRegiao={estadualData.evolucaoCarteira.taxaInadRegiao}
                            taxaInadNacional={estadualData.evolucaoCarteira.taxaInadNacional}
                            ufSigla={ufUpper}
                        />
                    </ChartCard>
                </div>
            </NivelEstadual>
        </div>
    );
}