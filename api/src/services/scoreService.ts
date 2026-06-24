import { prisma } from '../lib/prisma';
import type { FiltrosParseados } from '../utils/filterParser';

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

export type ScoreFilters = Partial<FiltrosParseados> & {
    uf?: string | string[] | null
    regiao?: string | string[] | null
    mesAno?: string | null
    scoreRCMin?: number | null
    scoreRCMax?: number | null
    scoreIEMin?: number | null
    scoreIEMax?: number | null
}

function asLista(v: string | string[] | null | undefined): string[] | null {
    if (v == null) return null
    if (Array.isArray(v)) return v.length > 0 ? v : null
    return [v]
}

export async function processAllScores(userId: number, filters: ScoreFilters) {
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

    // Pega apenas o mês mais recente por UF para evitar dados repetidos no ranking
    const maisRecentePorUf = new Map<string, typeof riscoTotal[0]>();
    for (const r of riscoTotal) {
        const atual = maisRecentePorUf.get(r.uf);
        if (!atual || r.mesAno > atual.mesAno) {
            maisRecentePorUf.set(r.uf, r);
        }
    }
    const ufList     = asLista(filters.uf)
    const regiaoList = asLista(filters.regiao)
    const base = [...maisRecentePorUf.values()].filter((r) => {
        if (ufList     && !ufList.includes(r.uf))         return false
        if (regiaoList && !regiaoList.includes(r.regiao)) return false
        return true
    });

    const rcMin = filters.scoreRCMin ?? null
    const rcMax = filters.scoreRCMax ?? null
    const ieMin = filters.scoreIEMin ?? null
    const ieMax = filters.scoreIEMax ?? null
    const dentroDoRange = (v: number, min: number | null, max: number | null) =>
        (min == null || v >= min) && (max == null || v <= max)

    const resultados = base.map(r => {
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

    return resultados.filter(x =>
        dentroDoRange(x.score_eixo_i, rcMin, rcMax) &&
        dentroDoRange(x.score_eixo_ii, ieMin, ieMax)
    );
}