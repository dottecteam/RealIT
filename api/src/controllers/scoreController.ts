import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
 
const GRANULARIDADES_VALIDAS = ['macro', 'micro'] as const
type Granularidade = typeof GRANULARIDADES_VALIDAS[number]
 
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
 
  try {
 
    if (granularidade === 'macro') {
      const [riscoCredito, inclusaoExpansao] = await Promise.all([
 
        prisma.riscoCredito.groupBy({
          by: ['regiao'],
          _avg: {
            inadiplenciaReal:      true,
            fragilidadeRenda:      true,
            agingDivida:           true,
            vulnerabilidadeSocial: true,
          },
          orderBy: { regiao: 'asc' }
        }),
 
        prisma.inclusaoExpansao.groupBy({
          by: ['regiao'],
          _avg: {
            maturidadePix:           true,
            crescimentoPopulacional: true,
            populacaoAbsoluta:       true,
            bonusDemografico:        true,
          },
          orderBy: { regiao: 'asc' }
        })
 
      ])
 
      const riscoFormatado = riscoCredito.map((r: any) => ({
        regiao: r.regiao,
        _avg: {
          inadimplenciaReal:     r._avg.inadiplenciaReal,
          fragilidadeRenda:      r._avg.fragilidadeRenda,
          agingDivida:           r._avg.agingDivida,
          vulnerabilidadeSocial: r._avg.vulnerabilidadeSocial,
        }
      }))
 
      return response.json({
        granularidade: 'macro',
        descricao: 'Médias dos scores por macrorregião (escala 1–5)',
        riscoCredito: riscoFormatado,
        inclusaoExpansao
      })
    }
 
    if (granularidade === 'micro') {
      const [riscoCredito, inclusaoExpansao] = await Promise.all([
 
        prisma.riscoCredito.groupBy({
          by: ['uf', 'regiao'],
          _avg: {
            inadiplenciaReal:      true,
            fragilidadeRenda:      true,
            agingDivida:           true,
            vulnerabilidadeSocial: true,
          },
          orderBy: { uf: 'asc' }
        }),
 
        prisma.inclusaoExpansao.groupBy({
          by: ['uf', 'regiao'],
          _avg: {
            maturidadePix:           true,
            crescimentoPopulacional: true,
            populacaoAbsoluta:       true,
            bonusDemografico:        true,
          },
          orderBy: { uf: 'asc' }
        })
 
      ])
 
      const riscoFormatado = riscoCredito.map((r: typeof riscoCredito[number]) => ({
        uf:     r.uf,
        regiao: r.regiao,
        _avg: {
          inadimplenciaReal:     r._avg.inadiplenciaReal,
          fragilidadeRenda:      r._avg.fragilidadeRenda,
          agingDivida:           r._avg.agingDivida,
          vulnerabilidadeSocial: r._avg.vulnerabilidadeSocial,
        }
      }))
 
      return response.json({
        granularidade: 'micro',
        descricao: 'Médias dos scores por UF com macrorregião de contexto (escala 1–5)',
        riscoCredito: riscoFormatado,
        inclusaoExpansao
      })
    }
 
    const [riscoCredito, inclusaoExpansao] = await Promise.all([
      prisma.riscoCredito.findMany({
        orderBy: [{ regiao: 'asc' }, { uf: 'asc' }, { mesAno: 'asc' }]
      }),
      prisma.inclusaoExpansao.findMany({
        orderBy: [{ regiao: 'asc' }, { uf: 'asc' }, { mesAno: 'asc' }]
      })
    ])
 
    return response.json({
      granularidade: null,
      descricao: 'Série temporal completa — todos os registros brutos por UF e período',
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