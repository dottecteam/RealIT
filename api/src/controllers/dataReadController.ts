import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as scoreService from '../services/scoreService';
import {
    parseFiltros,
    buildWhereFromFiltros,
    buildRiscoSelect,
    buildInclusaoSelect,
    temIndicadorDeRisco,
    temIndicadorDeInclusao,
    normalizeRiscoRow,
    normalizeRiscoRows,
    INDICADOR_PARA_CAMPO_DB,
    type FiltrosParseados,
} from '../utils/filterParser';

function aplicarFiltros(req: Request, res: Response) {
    const resultado = parseFiltros(req.query as Record<string, unknown>);
    if (resultado.errors.length > 0) {
        res.status(400).json({ error: resultado.errors.join(' | ') });
        return null;
    }
    return resultado;
}

export async function calculateDashboardScores(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        const result = await scoreService.processAllScores((req as any).userId, r.filtros);
        return res.json({ filtros: r.eco, ranking: result });
    } catch (error) {
        return res.status(500).json({ error: 'Erro no motor de cálculo' });
    }
}

export async function getRanking(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    const { orderBy } = req.query;
    try {
        const allScores = await scoreService.processAllScores((req as any).userId, r.filtros);
        const sorted = allScores.sort((a, b) => orderBy === 'RC' ? a.score_eixo_i - b.score_eixo_i : b.score_eixo_ii - a.score_eixo_ii);
        return res.json({ filtros: r.eco, ranking: sorted });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao gerar ranking' });
    }
}

export async function getSummary(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    const where = buildWhereFromFiltros(r.filtros);
    const wherePix = buildWhereFromFiltros(r.filtros, { campoMes: 'ano_mes' });
    const whereIbge = { ...where };
    delete (whereIbge as any).mesAno;

    try {
        const [risco, inclusao, pix, ibge] = await Promise.all([
            prisma.riscoCredito.findMany({ where, select: buildRiscoSelect(r.filtros) }),
            prisma.inclusaoExpansao.findMany({ where, select: buildInclusaoSelect(r.filtros) }),
            prisma.estruturaSrcPix.findMany({ where: wherePix }),
            prisma.estruturaIBGE.findMany({ where: whereIbge })
        ]);
        return res.json({
            filtros: r.eco,
            data: {
                risco: normalizeRiscoRows(risco as any[]),
                inclusao,
                pix,
                ibge,
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar resumo' });
    }
}

export async function getEvolutionHistory(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    const { limit } = req.query;
    const monthsLimit = Number(limit) || 12;
    const where = buildWhereFromFiltros(r.filtros);

    try {
        const historico = await prisma.riscoCredito.findMany({
            where,
            orderBy: { mesAno: 'desc' },
            take: monthsLimit
        });

        const dadosOrdenados = historico.reverse();

        return res.json({
            filtros: r.eco,
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

async function getFilteredData(model: any, filtros: FiltrosParseados, select?: Record<string, true>) {
    const where = buildWhereFromFiltros(filtros);
    return await model.findMany({
        where,
        ...(select ? { select } : {}),
        orderBy: { mesAno: 'asc' }
    });
}

export async function getCreditRisk(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        if (!temIndicadorDeRisco(r.filtros)) {
            return res.json({ filtros: r.eco, data: [] });
        }
        const data = await getFilteredData(prisma.riscoCredito, r.filtros, buildRiscoSelect(r.filtros));
        return res.json({ filtros: r.eco, data: normalizeRiscoRows(data as any[]) });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch credit risk data' });
    }
}

export async function getInclusionExpansion(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        if (!temIndicadorDeInclusao(r.filtros)) {
            return res.json({ filtros: r.eco, data: [] });
        }
        const data = await getFilteredData(prisma.inclusaoExpansao, r.filtros, buildInclusaoSelect(r.filtros));
        return res.json({ filtros: r.eco, data });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch inclusion data' });
    }
}

export async function getPixStructure(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        const where = buildWhereFromFiltros(r.filtros, { campoMes: 'ano_mes' });
        const data = await prisma.estruturaSrcPix.findMany({ where, orderBy: { ano_mes: 'asc' } });
        return res.json({ filtros: r.eco, data });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch PIX data' });
    }
}

export async function getIBGEStructure(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        const where = buildWhereFromFiltros(r.filtros);
        delete (where as any).mesAno;
        const data = await prisma.estruturaIBGE.findMany({ where });
        return res.json({ filtros: r.eco, data });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch IBGE structure data' });
    }
}

export async function getDashboardCharts(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        const where = buildWhereFromFiltros(r.filtros);

        const [allScores, riscoRaw, inclusaoRaw] = await Promise.all([
            scoreService.processAllScores((req as any).userId, r.filtros),
            prisma.riscoCredito.findMany({ where, orderBy: { mesAno: 'asc' } }),
            prisma.inclusaoExpansao.findMany({ where, orderBy: { mesAno: 'asc' } })
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

        const indicadoresPedidos = r.filtros.indicador;
        const querEsseIndicador = (id: string) =>
            !indicadoresPedidos || indicadoresPedidos.includes(id as any);

        const seriesRisco = [
            { id: 'inadimplenciaReal',     name: "Inadimplência Real",    data: riscoOrdenado.map((d: any) => d.inadiplenciaReal || 0) },
            { id: 'fragilidadeRenda',      name: "Fragilidade Renda",     data: riscoOrdenado.map((d: any) => d.fragilidadeRenda || 0) },
            { id: 'agingDivida',           name: "Aging da Dívida",       data: riscoOrdenado.map((d: any) => d.agingDivida || 0) },
            { id: 'vulnerabilidadeSocial', name: "Vulnerabilidade",       data: riscoOrdenado.map((d: any) => d.vulnerabilidadeSocial || 0) },
        ];
        const seriesInclusao = [
            { id: 'maturidadePix',           name: "Maturidade PIX",       data: inclusaoOrdenada.map((d: any) => d.maturidadePix || 0) },
            { id: 'crescimentoPopulacional', name: "Cresc. Populacional",  data: inclusaoOrdenada.map((d: any) => d.crescimentoPopulacional || 0) },
            { id: 'populacaoAbsoluta',       name: "População Absoluta",   data: inclusaoOrdenada.map((d: any) => d.populacaoAbsoluta || 0) },
            { id: 'bonusDemografico',        name: "Bônus Demográfico",    data: inclusaoOrdenada.map((d: any) => d.bonusDemografico || 0) },
        ];

        const series = [...seriesRisco, ...seriesInclusao]
            .filter((s) => querEsseIndicador(s.id))
            .map(({ id, ...rest }) => rest);

        const historyFormatted = { categories, series };

        return res.json({
            filtros: r.eco,
            ranking: allScores,
            history: historyFormatted
        });
    } catch (error) {
        console.error("Erro no getDashboardCharts:", error);
        return res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
    }
}
export async function getRegionalCharts(req: Request, res: Response) {
    const r = aplicarFiltros(req, res);
    if (!r) return;
    try {
        const where = buildWhereFromFiltros(r.filtros);
        const whereIbge = { ...where };
        delete (whereIbge as any).mesAno;

        const filtraPorScore =
            r.filtros.scoreRCMin != null || r.filtros.scoreRCMax != null ||
            r.filtros.scoreIEMin != null || r.filtros.scoreIEMax != null;

        let ufsPermitidas: Set<string> | null = null;
        if (filtraPorScore) {
            const ranking = await scoreService.processAllScores((req as any).userId, r.filtros);
            ufsPermitidas = new Set(ranking.map(x => x.uf));
        }

        const [riscoRawAll, ibgeRawAll] = await Promise.all([
            prisma.riscoCredito.findMany({ where, orderBy: { mesAno: 'asc' } }),
            prisma.estruturaIBGE.findMany({ where: whereIbge }),
        ]);
        const riscoRaw = ufsPermitidas
            ? riscoRawAll.filter(x => ufsPermitidas!.has(x.uf))
            : riscoRawAll;
        const ibgeRaw = ufsPermitidas
            ? ibgeRawAll.filter(x => ufsPermitidas!.has(x.uf))
            : ibgeRawAll;

        const ufs = [...new Set(riscoRaw.map(r => r.uf))];

        const maisRecentePorUf: Record<string, typeof riscoRaw[0]> = {};
        for (const reg of riscoRaw) {
            if (!maisRecentePorUf[reg.uf] || reg.mesAno > maisRecentePorUf[reg.uf].mesAno) {
                maisRecentePorUf[reg.uf] = reg;
            }
        }

        const totalCarteiraNacional = riscoRaw.reduce((acc, x) => acc + x.inadiplenciaReal + x.fragilidadeRenda, 0);
        const totalInadNacional = riscoRaw.reduce((acc, x) => acc + x.inadiplenciaReal, 0);
        const taxaInadNacional = totalCarteiraNacional > 0 ? Number((totalInadNacional / totalCarteiraNacional).toFixed(4)) : 0;

        const agingNacional = riscoRaw.length > 0
            ? Number((riscoRaw.reduce((acc, x) => acc + x.agingDivida, 0) / riscoRaw.length).toFixed(4))
            : 0;

        const escolaridadeNacional = ibgeRaw.length > 0
            ? Number((ibgeRaw.reduce((acc, x) => acc + x.taxa_escolarizacao, 0) / ibgeRaw.length).toFixed(4))
            : 0;

        const regiaoAtual = (r.filtros.regiao && r.filtros.regiao[0]) ?? 'Brasil';
        const totalCarteiraRegiao = Object.values(maisRecentePorUf).reduce((acc, x) => acc + x.inadiplenciaReal + x.fragilidadeRenda, 0);
        const totalInadRegiao = Object.values(maisRecentePorUf).reduce((acc, x) => acc + x.inadiplenciaReal, 0);
        const taxaInadRegiao = totalCarteiraRegiao > 0 ? Number((totalInadRegiao / totalCarteiraRegiao).toFixed(4)) : 0;

        const agingRegiao = Object.values(maisRecentePorUf).length > 0
            ? Number((Object.values(maisRecentePorUf).reduce((acc, x) => acc + x.agingDivida, 0) / Object.values(maisRecentePorUf).length).toFixed(4))
            : 0;

        const escolaridadeRegiao = ibgeRaw.length > 0
            ? Number((ibgeRaw.reduce((acc, x) => acc + x.taxa_escolarizacao, 0) / ibgeRaw.length).toFixed(4))
            : 0;

        const rankingInadimplencia = ufs.map(uf => {
            const x = maisRecentePorUf[uf];
            const totalUF = x.inadiplenciaReal + x.fragilidadeRenda;
            const taxa = totalUF > 0 ? Number((x.inadiplenciaReal / totalUF).toFixed(4)) : 0;
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
            filtros: r.eco,
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
    const r = aplicarFiltros(req, res);
    if (!r) return;

    const ufStr = r.filtros.uf && r.filtros.uf.length > 0 ? r.filtros.uf[0] : undefined;
    if (!ufStr) return res.status(400).json({ error: 'Parâmetro uf é obrigatório' });

    try {
        const where = buildWhereFromFiltros(r.filtros);

        const [riscoUF, inclusaoUF, pixUF, riscoTodos, inclusaoTodos] = await Promise.all([
            prisma.riscoCredito.findMany({ where, orderBy: { mesAno: 'asc' } }),
            prisma.inclusaoExpansao.findMany({ where, orderBy: { mesAno: 'asc' } }),
            prisma.estruturaSrcPix.findMany({ where: { uf: ufStr }, orderBy: { ano_mes: 'asc' } }),
            prisma.riscoCredito.findMany(),
            prisma.inclusaoExpansao.findMany(),
        ]);

        const maisRecenteRiscoUF = riscoUF[riscoUF.length - 1];

        const maisRecentePorUfNacional: Record<string, typeof riscoTodos[0]> = {};
        for (const x of riscoTodos) {
            if (!maisRecentePorUfNacional[x.uf] || x.mesAno > maisRecentePorUfNacional[x.uf].mesAno) {
                maisRecentePorUfNacional[x.uf] = x;
            }
        }

        const maisRecenteRiscoRegiao = Object.values(maisRecentePorUfNacional).filter(
            x => x.regiao === maisRecenteRiscoUF?.regiao
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

        const categories = riscoUF.map(x => x.mesAno);

        const taxaInadUFSerie = riscoUF.map(x => {
            const total = x.inadiplenciaReal + x.fragilidadeRenda;
            return total > 0 ? Number((x.inadiplenciaReal / total).toFixed(4)) : 0;
        });

        const carteiraAtivaSerie = inclusaoUF.map(i => Number(i.populacaoAbsoluta.toFixed(2)));

        const taxaInadRegioSerie = categories.map(mes => {
            const rows = riscoTodos.filter(x => x.mesAno === mes && x.regiao === maisRecenteRiscoUF?.regiao);
            if (!rows.length) return null;
            const totalInad = rows.reduce((acc, x) => acc + x.inadiplenciaReal, 0);
            const totalCart = rows.reduce((acc, x) => acc + x.inadiplenciaReal + x.fragilidadeRenda, 0);
            return totalCart > 0 ? Number((totalInad / totalCart).toFixed(4)) : null;
        });

        const taxaInadNacionalSerie = categories.map(mes => {
            const rows = riscoTodos.filter(x => x.mesAno === mes);
            if (!rows.length) return null;
            const totalInad = rows.reduce((acc, x) => acc + x.inadiplenciaReal, 0);
            const totalCart = rows.reduce((acc, x) => acc + x.inadiplenciaReal + x.fragilidadeRenda, 0);
            return totalCart > 0 ? Number((totalInad / totalCart).toFixed(4)) : null;
        });

        return res.json({
            filtros: r.eco,
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
