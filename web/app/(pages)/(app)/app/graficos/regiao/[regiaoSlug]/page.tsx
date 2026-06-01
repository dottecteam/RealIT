"use client";

import { useParams, useRouter } from "next/navigation";
import { useApiData } from "@/app/hooks/useApiData";
import { ChartCard } from "@/app/components/app/ChartCard";
import { NivelRegional } from "@/app/components/app/map/NivelRegional";
import { EscolarizacaoChart } from "@/app/components/app/charts/EscolarizacaoChart";
import { AgingDividaChart } from "@/app/components/app/charts/AgingDividaChart";
import { RankingInadimplenciaChart } from "@/app/components/app/charts/RankingInadimplenciaChart";
import { Loader2, ArrowLeft } from "lucide-react";
import { Regiao } from "@/app/constants/map/brasilMapPaths";

export default function RegiaoAnalyticsPage() {
    const { regiaoSlug } = useParams();
    const router = useRouter();

    const formattedRegion = String(regiaoSlug)
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(regiaoSlug.includes("-") && regiaoSlug !== "centro-oeste" ? "" : "-");

    const { data: regionalData, isLoading } = useApiData<any>(
        "/data/regional-charts",
        { regiao: formattedRegion }
    );

    const handleRegiaoChange = (novaRegiao: Regiao) => {
        const slug = novaRegiao.toLowerCase().replace(" ", "-");
        router.push(`/app/graficos/regiao/${slug}`);
    };

    if (isLoading || !regionalData) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                <p className="text-xs text-gray-400 italic">Filtrando dados da região {formattedRegion}...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-6 container-responsive">
            <button
                onClick={() => router.push("/app/graficos")}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider w-fit"
            >
                <ArrowLeft size={14} /> Voltar ao mapa nacional
            </button>

            {/* O componente NivelRegional já gerencia o layout interno */}
            <NivelRegional onRegiaoChange={handleRegiaoChange} active={formattedRegion as Regiao}>
                {/* Removemos o grid-cols-1 rígido aqui, pois o NivelRegional 
                    já aplica o grid necessário para os gráficos */}
                <ChartCard
                    title="Taxa de Escolarização"
                    info="Percentual de adultos (25+) com ensino básico completo."
                >
                    <EscolarizacaoChart
                        ranking={regionalData.rankingEscolaridade}
                        taxaRegiao={regionalData.referencias.escolaridadeRegiao}
                        taxaNacional={regionalData.referencias.escolaridadeNacional}
                        regiao={regionalData.regiao}
                    />
                </ChartCard>

                <ChartCard
                    title="Aging da Dívida"
                    info="Proporção da carteira vencida acima de 90 dias."
                >
                    <AgingDividaChart
                        ranking={regionalData.rankingAging}
                        agingRegiao={regionalData.referencias.agingRegiao}
                        agingNacional={regionalData.referencias.agingNacional}
                        regiao={regionalData.regiao}
                    />
                </ChartCard>
                <div className="sm:col-span-2">
                    <ChartCard
                        title="Ranking de Inadimplência Real"
                        info="Taxa de inadimplência por UF."
                    >
                        <RankingInadimplenciaChart
                            ranking={regionalData.rankingInadimplencia}
                            taxaRegiao={regionalData.referencias.taxaInadRegiao}
                            taxaNacional={regionalData.referencias.taxaInadNacional}
                            regiao={regionalData.regiao}
                        />
                    </ChartCard>
                </div>
            </NivelRegional>
        </div>
    );
}