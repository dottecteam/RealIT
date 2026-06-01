import { useMemo } from 'react';
import { REGIOES } from '../constants/charts/chartOptions';

export const useAnalyticsCalculations = (dashboardData: any) => {
    return useMemo(() => {
        if (!dashboardData?.ranking) {
            return { seriesEixoI: [], seriesEixoII: [], seriesRegiaoI: [], seriesRegiaoII: [] };
        }

        // Cálculos para Eixo I e II (Estados)
        const seriesEixoI = [{
            name: "Risco de Crédito (RC)",
            data: dashboardData.ranking.map((d: any) => d.score_eixo_i)
        }];

        const seriesEixoII = [{
            name: "Inclusão e Expansão (IE)",
            data: dashboardData.ranking.map((d: any) => d.score_eixo_ii)
        }];

        // Cálculos para Médias Regionais
        const calcMedias = REGIOES.map((regiaoNome) => {
            const searchName = regiaoNome === "C-Oeste" ? "Centro-Oeste" : regiaoNome;
            const estados = dashboardData.ranking.filter((d: any) => d.regiao === searchName);

            if (estados.length === 0) return { r: 0, i: 0 };

            const somaI = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_i, 0);
            const somaII = estados.reduce((acc: number, curr: any) => acc + curr.score_eixo_ii, 0);

            return {
                r: Number((somaI / estados.length).toFixed(2)),
                i: Number((somaII / estados.length).toFixed(2)),
            };
        });

        return {
            seriesEixoI,
            seriesEixoII,
            seriesRegiaoI: [{ name: "RC Médio Regional", data: calcMedias.map((m) => m.r) }],
            seriesRegiaoII: [{ name: "IE Médio Regional", data: calcMedias.map((m) => m.i) }],
        };
    }, [dashboardData]);
};