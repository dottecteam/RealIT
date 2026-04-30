import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Helper para buscar dados com filtros e ordenação
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

// Lógica de Cálculo de Score para o Dashboard
export async function calculateDashboardScores(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { uf } = req.query;

    try {
        // Busca os pesos definidos pelo usuário
        const weights = await prisma.filtroScore.findFirst({
            where: { idUsuario: userId }
        });

        if (!weights) return res.status(404).json({ error: 'Pesos de score não configurados para este usuário.' });

        // Busca os dados reais (ex: do último mês disponível)
        const risco = await prisma.riscoCredito.findMany({
            where: { uf: uf ? String(uf) : undefined },
            orderBy: { mesAno: 'desc' }
        });

        const inclusao = await prisma.inclusaoExpansao.findMany({
            where: { uf: uf ? String(uf) : undefined },
            orderBy: { mesAno: 'desc' }
        });

        // Exemplo de cálculo simplificado do Score RC (Risco de Crédito)
        // Score = (Valor * Peso) / Soma dos Pesos
        const scoresCalculados = risco.map(r => {
            const totalWeight = weights.inadiplenciaRealPeso + weights.fragilidadeRendaPeso + weights.agingDividaPeso + weights.vulnerabilidadeSocialPeso;
            const weightedSum =
                (r.inadiplenciaReal * weights.inadiplenciaRealPeso) +
                (r.fragilidadeRenda * weights.fragilidadeRendaPeso) +
                (r.agingDivida * weights.agingDividaPeso) +
                (r.vulnerabilidadeSocial * weights.vulnerabilidadeSocialPeso);

            return {
                mesAno: r.mesAno,
                uf: r.uf,
                scoreFinal: (weightedSum / totalWeight).toFixed(2)
            };
        });

        return res.json(scoresCalculados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao calcular scores' });
    }
}

// Mantém as outras funções (Pix e IBGE) com o padrão findMany
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
        // Realiza todas as buscas em paralelo para otimizar a performance
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
                where: { regiao: String(regiao) } // IBGE geralmente é anual ou estático
            })
        ]);

        // Retorna um objeto único para o Front-end
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