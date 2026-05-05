import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as scoreService from '../services/scoreService';

export async function calculateDashboardScores(req: Request, res: Response) {
    try {
        const result = await scoreService.processAllScores((req as any).userId, req.query);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Erro no motor de cálculo' });
    }
}

export async function getRanking(req: Request, res: Response) {
    const { orderBy } = req.query;
    try {
        const allScores = await scoreService.processAllScores((req as any).userId, req.query);
        const sorted = allScores.sort((a, b) => orderBy === 'RC' ? a.score_eixo_i - b.score_eixo_i : b.score_eixo_ii - a.score_eixo_ii);
        return res.json(sorted);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao gerar ranking' });
    }
}

export async function getSummary(req: Request, res: Response) {
    const { uf, regiao, mesAno } = req.query;
    try {
        const [risco, inclusao, pix, ibge] = await Promise.all([
            prisma.riscoCredito.findMany({ where: { uf: uf as string, regiao: regiao as string, mesAno: mesAno as string } }),
            prisma.inclusaoExpansao.findMany({ where: { uf: uf as string, regiao: regiao as string, mesAno: mesAno as string } }),
            prisma.estruturaSrcPix.findMany({ where: { uf: uf as string, regiao: regiao as string, ano_mes: mesAno as string } }),
            prisma.estruturaIBGE.findMany({ where: { uf: uf as string, regiao: regiao as string } })
        ]);
        return res.json({ uf, regiao, data: { risco, inclusao, pix, ibge } });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar resumo' });
    }
}

export async function getEvolutionHistory(req: Request, res: Response) {
    const { uf, regiao, limit } = req.query;
    const monthsLimit = Number(limit) || 12;

    try {
        const historico = await prisma.riscoCredito.findMany({
            where: {
                uf: uf ? String(uf) : undefined,
                regiao: regiao ? String(regiao) : undefined,
            },
            orderBy: { mesAno: 'desc' },
            take: monthsLimit
        });

        const dadosOrdenados = historico.reverse();

        return res.json({
            categories: dadosOrdenados.map(d => d.mesAno),
            series: [
                { name: "Inadimplência Real", data: dadosOrdenados.map(d => d.inadiplenciaReal) },
                { name: "Fragilidade de Renda", data: dadosOrdenados.map(d => d.fragilidadeRenda) }
            ]
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar histórico temporal' });
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

export async function getDashboardCharts(req: Request, res: Response) {
    try {
        const { uf, regiao } = req.query;
        const ufStr = uf ? String(uf) : undefined;
        const regiaoStr = regiao ? String(regiao) : undefined;

        const [allScores, riscoRaw, inclusaoRaw] = await Promise.all([
            scoreService.processAllScores((req as any).userId, req.query),
            prisma.riscoCredito.findMany({
                where: { uf: ufStr, regiao: regiaoStr },
                orderBy: { mesAno: 'asc' }
            }),
            prisma.inclusaoExpansao.findMany({
                where: { uf: ufStr, regiao: regiaoStr },
                orderBy: { mesAno: 'asc' }
            })
        ]);


        const agruparPorMes = (dados: any[]) => {
            const agrupado = dados.reduce((acc: any, curr: any) => {
                if (!acc[curr.mesAno]) {
                    acc[curr.mesAno] = { count: 0, ...curr };
                } else {
                    Object.keys(curr).forEach(key => {
                        if (typeof curr[key] === 'number' && key !== 'id') {
                            acc[curr.mesAno][key] += curr[key];
                        }
                    });
                }
                acc[curr.mesAno].count += 1;
                return acc;
            }, {});

            return Object.values(agrupado).map((item: any) => {
                const result: any = { mesAno: item.mesAno };
                Object.keys(item).forEach(key => {
                    if (typeof item[key] === 'number' && key !== 'count') {
                        result[key] = Number((item[key] / item.count).toFixed(2));
                    }
                });
                return result;
            }).slice(-6); 
        };

        const riscoOrdenado = agruparPorMes(riscoRaw);
        const inclusaoOrdenada = agruparPorMes(inclusaoRaw);

        const categories = riscoOrdenado.map((d: any) => d.mesAno);

        const historyFormatted = {
            categories: categories,
            series: [
                { name: "Inadimplência Real", data: riscoOrdenado.map((d: any) => d.inadiplenciaReal || 0) },
                { name: "Fragilidade Renda", data: riscoOrdenado.map((d: any) => d.fragilidadeRenda || 0) },
                { name: "Aging da Dívida", data: riscoOrdenado.map((d: any) => d.agingDivida || 0) },
                { name: "Vulnerabilidade", data: riscoOrdenado.map((d: any) => d.vulnerabilidadeSocial || 0) },
                
                { name: "Maturidade PIX", data: inclusaoOrdenada.map((d: any) => d.maturidadePix || 0) },
                { name: "Cresc. Populacional", data: inclusaoOrdenada.map((d: any) => d.crescimentoPopulacional || 0) },
                { name: "População Absoluta", data: inclusaoOrdenada.map((d: any) => d.populacaoAbsoluta || 0) },
                { name: "Bônus Demográfico", data: inclusaoOrdenada.map((d: any) => d.bonusDemografico || 0) }
            ]
        };

        return res.json({
            ranking: allScores,
            history: historyFormatted
        });
    } catch (error) {
        console.error("Erro no getDashboardCharts:", error);
        return res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
    }
}