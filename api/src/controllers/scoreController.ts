import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
 
const GRANULARIDADES_VALIDAS = ['macro', 'micro'] as const
type Granularidade = typeof GRANULARIDADES_VALIDAS[number]

const INDICADORES_RISCO = [
  'inadimplenciaReal',
  'fragilidadeRenda',
  'agingDivida',
  'vulnerabilidadeSocial',
] as const
const INDICADORES_INCLUSAO = [
  'maturidadePix',
  'crescimentoPopulacional',
  'populacaoAbsoluta',
  'bonusDemografico',
] as const
const INDICADORES_VALIDOS = [...INDICADORES_RISCO, ...INDICADORES_INCLUSAO] as const
type Indicador = typeof INDICADORES_VALIDOS[number]

const INDICADOR_PARA_CAMPO_DB: Record<Indicador, string> = {
  inadimplenciaReal:       'inadiplenciaReal',
  fragilidadeRenda:        'fragilidadeRenda',
  agingDivida:             'agingDivida',
  vulnerabilidadeSocial:   'vulnerabilidadeSocial',
  maturidadePix:           'maturidadePix',
  crescimentoPopulacional: 'crescimentoPopulacional',
  populacaoAbsoluta:       'populacaoAbsoluta',
  bonusDemografico:        'bonusDemografico',
}

function parseListParam(value: unknown): string[] | null {
  if (value === undefined || value === null || value === '') return null
  const bruto = Array.isArray(value) ? value.map(String) : String(value).split(',')
  const itens = bruto.map((s) => s.trim()).filter(Boolean)
  return itens.length > 0 ? itens : null
}
 
export async function criarCreditRisk(request: Request, response: Response) {
  const d = request.body
 
  try {
    const registro = await prisma.riscoCredito.create({
      data: {
        mesAno:                d.ano_mes,
        uf:                    d.uf,
        regiao:                d.regiao,
        inadiplenciaReal:      d.inadimplenciaReal,   
        fragilidadeRenda:      d.fragilidadeRenda,
        agingDivida:           d.agingDivida,
        vulnerabilidadeSocial: d.vulnerabilidadeSocial,
      }
    })
 
    return response.status(201).json({
      message: 'Risco de Crédito registrado com sucesso.',
      id: registro.id
    })
  } catch (error) {
    console.error('Erro ao registrar credit-risk:', error)
    return response.status(500).json({ error: 'Erro ao registrar dados de Risco de Crédito' })
  }
}
 
export async function criarInclusionExpansion(request: Request, response: Response) {
  const d = request.body
 
  try {
    const registro = await prisma.inclusaoExpansao.create({
      data: {
        mesAno:                  d.ano_mes,
        uf:                      d.uf,
        regiao:                  d.regiao,
        maturidadePix:           d.maturidadePix,
        crescimentoPopulacional: d.crescimentoPopulacional,
        populacaoAbsoluta:       d.totalHabitantes,  
      }
    })
 
    return response.status(201).json({
      message: 'Inclusão/Expansão registrada com sucesso.',
      id: registro.id
    })
  } catch (error) {
    console.error('Erro ao registrar inclusion-expansion:', error)
    return response.status(500).json({ error: 'Erro ao registrar dados de Inclusão/Expansão' })
  }
}
 
export async function criarPixStructure(request: Request, response: Response) {
  const d = request.body
 
  try {
    const registro = await prisma.estruturaSrcPix.create({
      data: {
        ano_mes: d.ano_mes,
        regiao:  d.regiao,
        uf:      d.uf,
        tipo:    d.tipo,
        classe:  d.classe ?? '',
        metrica: d.metrica,
        origem:  d.origem,
        valor:   d.valor,
      }
    })
 
    return response.status(201).json({
      message: 'Estrutura SCR/Pix registrada com sucesso.',
      id: registro.id
    })
  } catch (error) {
    console.error('Erro ao registrar pix-structure:', error)
    return response.status(500).json({ error: 'Erro ao registrar estrutura SCR/Pix' })
  }
}
 
export async function criarIbgeStructure(request: Request, response: Response) {
  const d = request.body
 
  try {
    const registro = await prisma.estruturaIBGE.create({
      data: {
        ano:                 d.ano,
        regiao:              d.regiao,
        uf:                  d.uf,
        taxa_escolarizacao:  d.taxa_escolarizacao,
        populacao_residente: Math.round(d.populacao_residente),   // DB espera Int
        taxa_crescimento:    d.taxa_crescimento,
        variacao_populacao:  Math.round(d.variacao_populacao),    // DB espera Int
        // d.index é ignorado intencionalmente
      }
    })
 
    return response.status(201).json({
      message: 'Estrutura IBGE registrada com sucesso.',
      id: registro.id
    })
  } catch (error) {
    console.error('Erro ao registrar ibge-structure:', error)
    return response.status(500).json({ error: 'Erro ao registrar estrutura IBGE' })
  }
}
 
export async function listarDados(request: Request, response: Response) {
  const { granularidade } = request.query

  if (granularidade !== undefined && !GRANULARIDADES_VALIDAS.includes(granularidade as Granularidade)) {
    return response.status(400).json({
      error: `Parâmetro 'granularidade' inválido: "${granularidade}". Valores aceitos: ${GRANULARIDADES_VALIDAS.join(', ')}.`
    })
  }

  const indicadorParam = parseListParam(request.query.indicador)
  const regiaoParam    = parseListParam(request.query.regiao)
  const ufParam        = parseListParam(request.query.uf)

  if (indicadorParam) {
    const invalidos = indicadorParam.filter((i) => !INDICADORES_VALIDOS.includes(i as Indicador))
    if (invalidos.length > 0) {
      return response.status(400).json({
        error: `Indicador(es) inválido(s): ${invalidos.join(', ')}. Valores aceitos: ${INDICADORES_VALIDOS.join(', ')}.`
      })
    }
  }

  if (ufParam) {
    const invalidos = ufParam.filter((u) => u.length !== 2)
    if (invalidos.length > 0) {
      return response.status(400).json({
        error: `UF inválido(s): ${invalidos.join(', ')}. Cada UF deve ter exatamente 2 caracteres.`
      })
    }
  }

  const indicadoresSelecionados = (indicadorParam ?? [...INDICADORES_VALIDOS]) as Indicador[]
  const indicadoresRisco    = indicadoresSelecionados.filter((i) => (INDICADORES_RISCO as readonly string[]).includes(i))
  const indicadoresInclusao = indicadoresSelecionados.filter((i) => (INDICADORES_INCLUSAO as readonly string[]).includes(i))

  const ufNormalizado = ufParam?.map((u) => u.toUpperCase())

  const whereFiltro: { regiao?: { in: string[] }; uf?: { in: string[] } } = {}
  if (regiaoParam && regiaoParam.length > 0)         whereFiltro.regiao = { in: regiaoParam }
  if (ufNormalizado && ufNormalizado.length > 0)     whereFiltro.uf     = { in: ufNormalizado }

  const filtrosAplicados = {
    indicador: indicadorParam,
    regiao:    regiaoParam,
    uf:        ufNormalizado ?? null,
  }

  try {

    if (granularidade === 'macro') {
      const [riscoCredito, inclusaoExpansao] = await Promise.all([
        indicadoresRisco.length > 0
          ? prisma.riscoCredito.groupBy({
              by: ['regiao'],
              where: whereFiltro,
              _avg: Object.fromEntries(
                indicadoresRisco.map((i) => [INDICADOR_PARA_CAMPO_DB[i], true])
              ) as any,
              orderBy: { regiao: 'asc' }
            })
          : Promise.resolve([] as any[]),

        indicadoresInclusao.length > 0
          ? prisma.inclusaoExpansao.groupBy({
              by: ['regiao'],
              where: whereFiltro,
              _avg: Object.fromEntries(
                indicadoresInclusao.map((i) => [INDICADOR_PARA_CAMPO_DB[i], true])
              ) as any,
              orderBy: { regiao: 'asc' }
            })
          : Promise.resolve([] as any[])
      ])

      const riscoFormatado = riscoCredito.map((r: any) => ({
        regiao: r.regiao,
        _avg: Object.fromEntries(
          indicadoresRisco.map((i) => [i, r._avg?.[INDICADOR_PARA_CAMPO_DB[i]] ?? null])
        )
      }))

      const inclusaoFormatado = inclusaoExpansao.map((r: any) => ({
        regiao: r.regiao,
        _avg: Object.fromEntries(
          indicadoresInclusao.map((i) => [i, r._avg?.[INDICADOR_PARA_CAMPO_DB[i]] ?? null])
        )
      }))

      return response.json({
        granularidade: 'macro',
        descricao: 'Médias dos scores por macrorregião (escala 1–5)',
        filtros: filtrosAplicados,
        riscoCredito: riscoFormatado,
        inclusaoExpansao: inclusaoFormatado
      })
    }

    if (granularidade === 'micro') {
      const [riscoCredito, inclusaoExpansao] = await Promise.all([
        indicadoresRisco.length > 0
          ? prisma.riscoCredito.groupBy({
              by: ['uf', 'regiao'],
              where: whereFiltro,
              _avg: Object.fromEntries(
                indicadoresRisco.map((i) => [INDICADOR_PARA_CAMPO_DB[i], true])
              ) as any,
              orderBy: { uf: 'asc' }
            })
          : Promise.resolve([] as any[]),

        indicadoresInclusao.length > 0
          ? prisma.inclusaoExpansao.groupBy({
              by: ['uf', 'regiao'],
              where: whereFiltro,
              _avg: Object.fromEntries(
                indicadoresInclusao.map((i) => [INDICADOR_PARA_CAMPO_DB[i], true])
              ) as any,
              orderBy: { uf: 'asc' }
            })
          : Promise.resolve([] as any[])
      ])

      const riscoFormatado = riscoCredito.map((r: any) => ({
        uf:     r.uf,
        regiao: r.regiao,
        _avg: Object.fromEntries(
          indicadoresRisco.map((i) => [i, r._avg?.[INDICADOR_PARA_CAMPO_DB[i]] ?? null])
        )
      }))

      const inclusaoFormatado = inclusaoExpansao.map((r: any) => ({
        uf:     r.uf,
        regiao: r.regiao,
        _avg: Object.fromEntries(
          indicadoresInclusao.map((i) => [i, r._avg?.[INDICADOR_PARA_CAMPO_DB[i]] ?? null])
        )
      }))

      return response.json({
        granularidade: 'micro',
        descricao: 'Médias dos scores por UF com macrorregião de contexto (escala 1–5)',
        filtros: filtrosAplicados,
        riscoCredito: riscoFormatado,
        inclusaoExpansao: inclusaoFormatado
      })
    }

    const [riscoCredito, inclusaoExpansao] = await Promise.all([
      indicadoresRisco.length > 0
        ? prisma.riscoCredito.findMany({
            where: whereFiltro,
            orderBy: [{ regiao: 'asc' }, { uf: 'asc' }, { mesAno: 'asc' }]
          })
        : Promise.resolve([] as any[]),
      indicadoresInclusao.length > 0
        ? prisma.inclusaoExpansao.findMany({
            where: whereFiltro,
            orderBy: [{ regiao: 'asc' }, { uf: 'asc' }, { mesAno: 'asc' }]
          })
        : Promise.resolve([] as any[])
    ])

    return response.json({
      granularidade: null,
      descricao: 'Série temporal completa — todos os registros brutos por UF e período',
      filtros: filtrosAplicados,
      riscoCredito,
      inclusaoExpansao
    })

  } catch (error) {
    console.error('Erro ao listar dados:', error)
    return response.status(500).json({ error: 'Erro ao buscar dados' })
  }
}

//Código antigo, deletar após revisão
// import { Request, Response } from 'express'
// import { prisma } from '../lib/prisma'

// export async function criarDadosScore(request: Request, response: Response) {
//     const dados = request.body // Agora é um array completo do Colab

//     try {
//         const resultado = await prisma.scoreUf.createMany({
//             data: dados
//         })

//         return response.status(201).json({
//             message: `${resultado.count} registros de Score UF cadastrados com sucesso.`
//         })
//     } catch (error) {
//         console.error(error)
//         return response.status(500).json({ error: 'Erro ao cadastrar dados do Score UF' })
//     }
// }


// export async function criarDadosMediaRegiao(request: Request, response: Response) {
//     const dados = request.body // Agora é um array completo do Colab

//     try {
//         const resultado = await prisma.mediaRegiao.createMany({
//             data: dados
//         })

//         return response.status(201).json({
//             message: `${resultado.count} registros de Média Região cadastrados com sucesso.`
//         })
//     } catch (error) {
//         console.error(error)
//         return response.status(500).json({ error: 'Erro ao cadastrar dados da Média Região' })
//     }
// }


// export async function listarDados(request: Request, response: Response) {
//   try {
//     const [dadosScore, dadosMediaRegiao] = await Promise.all([
//       prisma.scoreUf.findMany(),
//       prisma.mediaRegiao.findMany()
//     ])

//     return response.json({
//       dadosScore,
//       dadosMediaRegiao
//     })
//   } catch (error) {
//     console.error("Erro ao listar dados:", error)
//     return response.status(500).json({ error: 'Erro ao buscar dados' })
//   }
// }