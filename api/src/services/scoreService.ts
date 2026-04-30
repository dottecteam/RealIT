import { prisma } from '../lib/prisma';

export function normalize(x: number, min: number, max: number): number {
    if (max === min) return 1.0;
    const z = 1 + ((x - min) / (max - min)) * 4;
    return Number(z.toFixed(2));
}

export function calculateWeightedScore(values: number[], weights: number[]): number {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const score = values.reduce((acc, val, i) => acc + (val * weights[i]), 0) / totalWeight;
    return Number(score.toFixed(2));
}

export function getStrategicCategory(scoreRC: number, scoreIE: number): string {
    if (scoreRC <= 2 && scoreIE <= 2) return "DIAMANTE BRUTO";
    if (scoreRC <= 2 && scoreIE >= 4) return "MERCADO MADURO";
    if (scoreRC >= 4 && scoreIE <= 2) return "FOMENTO SOCIAL";
    if (scoreRC >= 4 && scoreIE >= 4) return "SATURAÇÃO";
    return "INTERMEDIÁRIO";
}

export async function processAllScores(userId: number, filters: { uf?: string, mesAno?: string }) {
    const userWeights = await prisma.filtroScore.findFirst({ where: { idUsuario: userId } });
    const weights = userWeights || {
        inadiplenciaRealPeso: 0.35, fragilidadeRendaPeso: 0.35, agingDividaPeso: 0.20, vulnerabilidadeSocialPeso: 0.10,
        maturidadePixPeso: 0.35, crescimentoPopulacionalPeso: 0.25, populacaoAbsolutaPeso: 0.25, bonusDemograficoPeso: 0.15
    };

    const [riscoTotal, inclusaoTotal] = await Promise.all([
        prisma.riscoCredito.findMany(),
        prisma.inclusaoExpansao.findMany()
    ]);

    const limits = {
        inad: { min: Math.min(...riscoTotal.map(r => r.inadiplenciaReal)), max: Math.max(...riscoTotal.map(r => r.inadiplenciaReal)) },
        renda: { min: Math.min(...riscoTotal.map(r => r.fragilidadeRenda)), max: Math.max(...riscoTotal.map(r => r.fragilidadeRenda)) },
        aging: { min: Math.min(...riscoTotal.map(r => r.agingDivida)), max: Math.max(...riscoTotal.map(r => r.agingDivida)) },
        vulner: { min: Math.min(...riscoTotal.map(r => r.vulnerabilidadeSocial)), max: Math.max(...riscoTotal.map(r => r.vulnerabilidadeSocial)) },
        pix: { min: Math.min(...inclusaoTotal.map(i => i.maturidadePix)), max: Math.max(...inclusaoTotal.map(i => i.maturidadePix)) },
        cresc: { min: Math.min(...inclusaoTotal.map(i => i.crescimentoPopulacional)), max: Math.max(...inclusaoTotal.map(i => i.crescimentoPopulacional)) },
        pop: { min: Math.min(...inclusaoTotal.map(i => i.populacaoAbsoluta)), max: Math.max(...inclusaoTotal.map(i => i.populacaoAbsoluta)) },
        bonus: { min: Math.min(...inclusaoTotal.map(i => i.bonusDemografico)), max: Math.max(...inclusaoTotal.map(i => i.bonusDemografico)) },
    };

    const base = filters.uf ? riscoTotal.filter(r => r.uf === filters.uf) : riscoTotal;

    return base.map(r => {
        const inc = inclusaoTotal.find(i => i.uf === r.uf && i.mesAno === r.mesAno);
        const z = {
            inad: normalize(r.inadiplenciaReal, limits.inad.min, limits.inad.max),
            renda: normalize(r.fragilidadeRenda, limits.renda.min, limits.renda.max),
            aging: normalize(r.agingDivida, limits.aging.min, limits.aging.max),
            vulner: normalize(r.vulnerabilidadeSocial, limits.vulner.min, limits.vulner.max),
            pix: inc ? normalize(inc.maturidadePix, limits.pix.min, limits.pix.max) : 1,
            cresc: inc ? normalize(inc.crescimentoPopulacional, limits.cresc.min, limits.cresc.max) : 1,
            pop: inc ? normalize(inc.populacaoAbsoluta, limits.pop.min, limits.pop.max) : 1,
            bonus: inc ? normalize(inc.bonusDemografico, limits.bonus.min, limits.bonus.max) : 1,
        };

        const scoreRC = calculateWeightedScore([z.inad, z.renda, z.aging, z.vulner], [weights.inadiplenciaRealPeso, weights.fragilidadeRendaPeso, weights.agingDividaPeso, weights.vulnerabilidadeSocialPeso]);
        const scoreIE = calculateWeightedScore([z.pix, z.cresc, z.pop, z.bonus], [weights.maturidadePixPeso, weights.crescimentoPopulacionalPeso, weights.populacaoAbsolutaPeso, weights.bonusDemograficoPeso]);

        return {
            uf: r.uf, regiao: r.regiao, mesAno: r.mesAno,
            score_eixo_i: scoreRC, score_eixo_ii: scoreIE,
            categoria: getStrategicCategory(scoreRC, scoreIE)
        };
    });
}