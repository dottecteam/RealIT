import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as scoreService from '../services/scoreService';

export async function calculateDashboardScores(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { uf } = req.query;

    try {
        // Busca Pesos do Usuário ou define o Padrão (Metodologia)
        const userWeights = await prisma.filtroScore.findFirst({ where: { idUsuario: userId } });

        const weights = userWeights || {
            inadiplenciaRealPeso: 0.35,
            fragilidadeRendaPeso: 0.35,
            agingDividaPeso: 0.20,
            vulnerabilidadeSocialPeso: 0.10,
            maturidadePixPeso: 0.35,
            crescimentoPopulacionalPeso: 0.25,
            populacaoAbsolutaPeso: 0.25,
            bonusDemograficoPeso: 0.15
        };

        // Busca todos os dados para calcular Min-Max global (essencial para a normalização)
        const [riscoTotal, inclusaoTotal] = await Promise.all([
            prisma.riscoCredito.findMany(),
            prisma.inclusaoExpansao.findMany()
        ]);

        if (riscoTotal.length === 0 || inclusaoTotal.length === 0) {
            return res.status(404).json({ error: 'Dados insuficientes para calcular o score.' });
        }

        // Mapeia os limites globais (Min e Max de cada coluna)
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

        // Filtra apenas os dados que o usuário quer ver (ou todos se não passar UF)
        const riscoBase = uf ? riscoTotal.filter(r => r.uf === String(uf)) : riscoTotal;

        const scoresProcessados = riscoBase.map(r => {
            const inc = inclusaoTotal.find(i => i.uf === r.uf && i.mesAno === r.mesAno);

            const zInad = scoreService.normalize(r.inadiplenciaReal, limits.inad.min, limits.inad.max);
            const zRenda = scoreService.normalize(r.fragilidadeRenda, limits.renda.min, limits.renda.max);
            const zAging = scoreService.normalize(r.agingDivida, limits.aging.min, limits.aging.max);
            const zVulner = scoreService.normalize(r.vulnerabilidadeSocial, limits.vulner.min, limits.vulner.max);

            const zPix = inc ? scoreService.normalize(inc.maturidadePix, limits.pix.min, limits.pix.max) : 1;
            const zCresc = inc ? scoreService.normalize(inc.crescimentoPopulacional, limits.cresc.min, limits.cresc.max) : 1;
            const zPop = inc ? scoreService.normalize(inc.populacaoAbsoluta, limits.pop.min, limits.pop.max) : 1;
            const zBonus = inc ? scoreService.normalize(inc.bonusDemografico, limits.bonus.min, limits.bonus.max) : 1;

            const scoreRC = scoreService.calculateWeightedScore(
                [zInad, zRenda, zAging, zVulner],
                [weights.inadiplenciaRealPeso, weights.fragilidadeRendaPeso, weights.agingDividaPeso, weights.vulnerabilidadeSocialPeso]
            );

            const scoreIE = scoreService.calculateWeightedScore(
                [zPix, zCresc, zPop, zBonus],
                [weights.maturidadePixPeso, weights.crescimentoPopulacionalPeso, weights.populacaoAbsolutaPeso, weights.bonusDemograficoPeso]
            );

            return {
                uf: r.uf,
                mesAno: r.mesAno,
                regiao: r.regiao,
                score_eixo_i: scoreRC,
                score_eixo_ii: scoreIE,
                categoria: scoreService.getStrategicCategory(scoreRC, scoreIE),
                detalhes_normalizados: {
                    inadimplencia: zInad,
                    crescimento: zCresc,

                }
            };
        });

        return res.json(scoresProcessados);
    } catch (error) {
        console.error("Erro no motor de cálculo:", error);
        return res.status(500).json({ error: 'Falha interna ao processar o Score.' });
    }
}

async function getFilteredData(model: any, req: Request) {
    const { uf, regiao, mesAno } = req.query;
    return await model.findMany({
        where: {
            uf: uf ? String(uf) : undefined,
            regiao: regiao ? String(regiao) : undefined,
            mesAno: mesAno ? String(mesAno) : undefined,
        },
        orderBy: { mesAno: 'asc' }
    });
}

export async function getCreditRisk(req: Request, res: Response) {
    try {
        const data = await getFilteredData(prisma.riscoCredito, req);
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch credit risk data' });
    }
}

export async function getInclusionExpansion(req: Request, res: Response) {
    try {
        const data = await getFilteredData(prisma.inclusaoExpansao, req);
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch inclusion data' });
    }
}

export async function getPixStructure(req: Request, res: Response) {
    try {
        const data = await prisma.estruturaSrcPix.findMany({ orderBy: { ano_mes: 'asc' } });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch PIX data' });
    }
}

export async function getIBGEStructure(req: Request, res: Response) {
    try {
        const data = await prisma.estruturaIBGE.findMany();
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch IBGE structure data' });
    }
}

export async function getRegionSummary(req: Request, res: Response) {
    const { regiao, mesAno } = req.query;

    if (!regiao) {
        return res.status(400).json({ error: 'O parâmetro regiao é obrigatório.' });
    }

    try {
        const [risco, inclusao, pix, ibge] = await Promise.all([
            prisma.riscoCredito.findMany({
                where: {
                    regiao: String(regiao),
                    mesAno: mesAno ? String(mesAno) : undefined
                }
            }),
            prisma.inclusaoExpansao.findMany({
                where: {
                    regiao: String(regiao),
                    mesAno: mesAno ? String(mesAno) : undefined
                }
            }),
            prisma.estruturaSrcPix.findMany({
                where: {
                    regiao: String(regiao),
                    ano_mes: mesAno ? String(mesAno) : undefined
                }
            }),
            prisma.estruturaIBGE.findMany({
                where: { regiao: String(regiao) }
            })
        ]);

        return res.json({
            regiao,
            periodo: mesAno || "Todos os períodos",
            data: {
                creditRisk: risco,
                inclusionExpansion: inclusao,
                pixStructure: pix,
                ibgeStructure: ibge
            }
        });
    } catch (error) {
        console.error("Erro ao buscar resumo regional:", error);
        return res.status(500).json({ error: 'Falha ao processar dados regionais' });
    }
}

export async function getUFSummary(req: Request, res: Response) {
    const { uf, mesAno } = req.query;

    try {
        const [risco, inclusao, pix, ibge] = await Promise.all([
            prisma.riscoCredito.findMany({
                where: { uf: String(uf), mesAno: mesAno ? String(mesAno) : undefined }
            }),
            prisma.inclusaoExpansao.findMany({
                where: { uf: String(uf), mesAno: mesAno ? String(mesAno) : undefined }
            }),
            prisma.estruturaSrcPix.findMany({
                where: { uf: String(uf), ano_mes: mesAno ? String(mesAno) : undefined }
            }),
            prisma.estruturaIBGE.findFirst({
                where: { uf: String(uf) }
            })
        ]);

        return res.json({
            uf,
            periodo: mesAno || "Todos os períodos",
            data: {
                creditRisk: risco,
                inclusionExpansion: inclusao,
                pixStructure: pix,
                ibgeDetails: ibge
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar resumo do estado' });
    }
}