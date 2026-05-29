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
export async function getRegionalCharts(req: Request, res: Response) {
    try {
        const { regiao } = req.query;
        const regiaoStr = regiao ? String(regiao) : undefined;

        const [riscoRaw, ibgeRaw] = await Promise.all([
            prisma.riscoCredito.findMany({
                where: { regiao: regiaoStr },
                orderBy: { mesAno: 'asc' },
            }),
            prisma.estruturaIBGE.findMany({
                where: { regiao: regiaoStr },
            }),
        ]);

        const ufs = [...new Set(riscoRaw.map(r => r.uf))];

        const maisRecentePorUf: Record<string, typeof riscoRaw[0]> = {};
        for (const r of riscoRaw) {
            if (!maisRecentePorUf[r.uf] || r.mesAno > maisRecentePorUf[r.uf].mesAno) {
                maisRecentePorUf[r.uf] = r;
            }
        }

        const totalCarteiraNacional = riscoRaw.reduce((acc, r) => acc + r.inadiplenciaReal + r.fragilidadeRenda, 0);
        const totalInadNacional = riscoRaw.reduce((acc, r) => acc + r.inadiplenciaReal, 0);
        const taxaInadNacional = totalCarteiraNacional > 0 ? Number((totalInadNacional / totalCarteiraNacional).toFixed(4)) : 0;

        const agingNacional = riscoRaw.length > 0
            ? Number((riscoRaw.reduce((acc, r) => acc + r.agingDivida, 0) / riscoRaw.length).toFixed(4))
            : 0;

        const escolaridadeNacional = ibgeRaw.length > 0
            ? Number((ibgeRaw.reduce((acc, r) => acc + r.taxa_escolarizacao, 0) / ibgeRaw.length).toFixed(4))
            : 0;

        const regiaoAtual = regiaoStr ?? 'Brasil';
        const totalCarteiraRegiao = Object.values(maisRecentePorUf).reduce((acc, r) => acc + r.inadiplenciaReal + r.fragilidadeRenda, 0);
        const totalInadRegiao = Object.values(maisRecentePorUf).reduce((acc, r) => acc + r.inadiplenciaReal, 0);
        const taxaInadRegiao = totalCarteiraRegiao > 0 ? Number((totalInadRegiao / totalCarteiraRegiao).toFixed(4)) : 0;

        const agingRegiao = Object.values(maisRecentePorUf).length > 0
            ? Number((Object.values(maisRecentePorUf).reduce((acc, r) => acc + r.agingDivida, 0) / Object.values(maisRecentePorUf).length).toFixed(4))
            : 0;

        const escolaridadeRegiao = ibgeRaw.length > 0
            ? Number((ibgeRaw.reduce((acc, r) => acc + r.taxa_escolarizacao, 0) / ibgeRaw.length).toFixed(4))
            : 0;

        const rankingInadimplencia = ufs.map(uf => {
            const r = maisRecentePorUf[uf];
            const totalUF = r.inadiplenciaReal + r.fragilidadeRenda;
            const taxa = totalUF > 0 ? Number((r.inadiplenciaReal / totalUF).toFixed(4)) : 0;
            return { uf, taxa };
        }).sort((a, b) => b.taxa - a.taxa);

        const rankingAging = ufs.map(uf => ({
            uf,
            aging: Number(maisRecentePorUf[uf].agingDivida.toFixed(4)),
        })).sort((a, b) => b.aging - a.aging);

        const rankingEscolaridade = ufs.map(uf => {
            const ibgeUf = ibgeRaw.find(i => i.uf === uf);
            return { uf, taxa: ibgeUf ? Number(ibgeUf.taxa_escolarizacao.toFixed(4)) : 0 };
        }).sort((a, b) => b.taxa - a.taxa);

        return res.json({
            regiao: regiaoAtual,
            referencias: {
                taxaInadNacional,
                taxaInadRegiao,
                agingNacional,
                agingRegiao,
                escolaridadeNacional,
                escolaridadeRegiao,
            },
            rankingInadimplencia,
            rankingAging,
            rankingEscolaridade,
        });
    } catch (error) {
        console.error('Erro no getRegionalCharts:', error);
        return res.status(500).json({ error: 'Erro ao carregar dados regionais' });
    }
}

export async function getEstadualCharts(req: Request, res: Response) {
    try {
        const { uf } = req.query;
        if (!uf) return res.status(400).json({ error: 'Parâmetro uf é obrigatório' });
        const ufStr = String(uf);

        const [riscoUF, inclusaoUF, pixUF, riscoTodos, inclusaoTodos] = await Promise.all([
            prisma.riscoCredito.findMany({ where: { uf: ufStr }, orderBy: { mesAno: 'asc' } }),
            prisma.inclusaoExpansao.findMany({ where: { uf: ufStr }, orderBy: { mesAno: 'asc' } }),
            prisma.estruturaSrcPix.findMany({ where: { uf: ufStr }, orderBy: { ano_mes: 'asc' } }),
            prisma.riscoCredito.findMany(),
            prisma.inclusaoExpansao.findMany(),
        ]);

        const maisRecenteRiscoUF = riscoUF[riscoUF.length - 1];

        const maisRecentePorUfNacional: Record<string, typeof riscoTodos[0]> = {};
        for (const r of riscoTodos) {
            if (!maisRecentePorUfNacional[r.uf] || r.mesAno > maisRecentePorUfNacional[r.uf].mesAno) {
                maisRecentePorUfNacional[r.uf] = r;
            }
        }

        const maisRecenteRiscoRegiao = Object.values(maisRecentePorUfNacional).filter(
            r => r.regiao === maisRecenteRiscoUF?.regiao
        );

        const pixPorMes = pixUF.reduce((acc: Record<string, any>, p) => {
            if (!acc[p.ano_mes]) acc[p.ano_mes] = { qt_pagador: 0, vl_pagador: 0, qt_pes_pagador: 0 };
            if (p.metrica === 'qt_pagador') acc[p.ano_mes].qt_pagador += p.valor;
            if (p.metrica === 'vl_pagador') acc[p.ano_mes].vl_pagador += p.valor;
            if (p.metrica === 'qt_pes_pagador') acc[p.ano_mes].qt_pes_pagador += p.valor;
            return acc;
        }, {});

        const mesesPix = Object.keys(pixPorMes).sort();
        const maisRecenteMesPix = mesesPix[mesesPix.length - 1];
        const pixUFRecente = maisRecenteMesPix ? pixPorMes[maisRecenteMesPix] : null;

        const qtPerCapitaUF = pixUFRecente && pixUFRecente.qt_pes_pagador > 0
            ? Number((pixUFRecente.qt_pagador / pixUFRecente.qt_pes_pagador).toFixed(4)) : 0;
        const vlPerCapitaUF = pixUFRecente && pixUFRecente.qt_pes_pagador > 0
            ? Number((pixUFRecente.vl_pagador / pixUFRecente.qt_pes_pagador).toFixed(4)) : 0;

        const pixTodosRecente = pixUF.filter(p => p.ano_mes === maisRecenteMesPix);
        const pixNacionalTodos = await prisma.estruturaSrcPix.findMany({ where: { ano_mes: maisRecenteMesPix } });

        const calcPixMedias = (rows: typeof pixNacionalTodos) => {
            const total = { qt: 0, vl: 0, pes: 0 };
            rows.forEach(p => {
                if (p.metrica === 'qt_pagador') total.qt += p.valor;
                if (p.metrica === 'vl_pagador') total.vl += p.valor;
                if (p.metrica === 'qt_pes_pagador') total.pes += p.valor;
            });
            return {
                qtPerCapita: total.pes > 0 ? Number((total.qt / total.pes).toFixed(4)) : 0,
                vlPerCapita: total.pes > 0 ? Number((total.vl / total.pes).toFixed(4)) : 0,
            };
        };

        const pixNacionalMedias = calcPixMedias(pixNacionalTodos);
        const pixRegiaoTodos = pixNacionalTodos.filter(p => {
            const regiaoUF = maisRecenteRiscoUF?.regiao;
            return regiaoUF && p.uf && maisRecentePorUfNacional[p.uf]?.regiao === regiaoUF;
        });
        const pixRegiaoMedias = calcPixMedias(pixRegiaoTodos);

        const classes = ['a', 'b', 'c', 'd', 'e'];
        const pixClasses = pixUF.filter(p => p.tipo === 'pf' && p.metrica === 'vl_pagador' && p.ano_mes === maisRecenteMesPix);
        const totalCarteiraUF = pixClasses.reduce((acc, p) => acc + p.valor, 0);
        const composicaoUF = classes.map(cls => {
            const row = pixClasses.find(p => p.classe === cls);
            return totalCarteiraUF > 0 ? Number(((row?.valor ?? 0) / totalCarteiraUF).toFixed(4)) : 0;
        });

        const pixClassesRegiao = pixRegiaoTodos.filter(p => p.tipo === 'pf' && p.metrica === 'vl_pagador');
        const totalCarteiraRegiao2 = pixClassesRegiao.reduce((acc, p) => acc + p.valor, 0);
        const composicaoRegiao = classes.map(cls => {
            const total = pixClassesRegiao.filter(p => p.classe === cls).reduce((acc, p) => acc + p.valor, 0);
            return totalCarteiraRegiao2 > 0 ? Number((total / totalCarteiraRegiao2).toFixed(4)) : 0;
        });

        const pixClassesNacional = pixNacionalTodos.filter(p => p.tipo === 'pf' && p.metrica === 'vl_pagador');
        const totalCarteiraNacional2 = pixClassesNacional.reduce((acc, p) => acc + p.valor, 0);
        const composicaoNacional = classes.map(cls => {
            const total = pixClassesNacional.filter(p => p.classe === cls).reduce((acc, p) => acc + p.valor, 0);
            return totalCarteiraNacional2 > 0 ? Number((total / totalCarteiraNacional2).toFixed(4)) : 0;
        });

        const categories = riscoUF.map(r => r.mesAno);
        const regiaoMesAno = [...new Set(maisRecenteRiscoRegiao.map(r => r.mesAno))];

        const taxaInadUFSerie = riscoUF.map(r => {
            const total = r.inadiplenciaReal + r.fragilidadeRenda;
            return total > 0 ? Number((r.inadiplenciaReal / total).toFixed(4)) : 0;
        });

        const carteiraAtivaSerie = inclusaoUF.map(i => Number(i.populacaoAbsoluta.toFixed(2)));

        const taxaInadRegioSerie = categories.map(mes => {
            const rows = riscoTodos.filter(r => r.mesAno === mes && r.regiao === maisRecenteRiscoUF?.regiao);
            if (!rows.length) return null;
            const totalInad = rows.reduce((acc, r) => acc + r.inadiplenciaReal, 0);
            const totalCart = rows.reduce((acc, r) => acc + r.inadiplenciaReal + r.fragilidadeRenda, 0);
            return totalCart > 0 ? Number((totalInad / totalCart).toFixed(4)) : null;
        });

        const taxaInadNacionalSerie = categories.map(mes => {
            const rows = riscoTodos.filter(r => r.mesAno === mes);
            if (!rows.length) return null;
            const totalInad = rows.reduce((acc, r) => acc + r.inadiplenciaReal, 0);
            const totalCart = rows.reduce((acc, r) => acc + r.inadiplenciaReal + r.fragilidadeRenda, 0);
            return totalCart > 0 ? Number((totalInad / totalCart).toFixed(4)) : null;
        });

        return res.json({
            uf: ufStr,
            maturidadePix: {
                qtPerCapita: { uf: qtPerCapitaUF, regiao: pixRegiaoMedias.qtPerCapita, nacional: pixNacionalMedias.qtPerCapita },
                vlPerCapita: { uf: vlPerCapitaUF, regiao: pixRegiaoMedias.vlPerCapita, nacional: pixNacionalMedias.vlPerCapita },
            },
            composicaoCarteira: {
                classes,
                uf: composicaoUF,
                regiao: composicaoRegiao,
                nacional: composicaoNacional,
            },
            evolucaoCarteira: {
                categories,
                carteiraAtiva: carteiraAtivaSerie,
                taxaInadimplencia: taxaInadUFSerie,
                taxaInadRegiao: taxaInadRegioSerie,
                taxaInadNacional: taxaInadNacionalSerie,
            },
        });
    } catch (error) {
        console.error('Erro no getEstadualCharts:', error);
        return res.status(500).json({ error: 'Erro ao carregar dados estaduais' });
    }
}
