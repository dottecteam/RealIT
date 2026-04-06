import e, {Request, Response} from 'express'
import {prisma} from '../lib/prisma'

export async function criarDadosScore(request: Request, response: Response) {
    const { uf, score_inadimplencia, score_fragilidade, score_aging_divida, score_escolarizacao, score_eixo_i, score_maturidade, score_crescimento, score_populacao, score_eixo_ii } = request.body

    if(!uf || !score_eixo_i || !score_eixo_ii){
        return response.status(400).json({error: 'Campos obrigatórios faltando'})
    }

    try{
        const dado = await prisma.scoreUf.create({
            data: {
                uf, 
                score_inadimplencia, 
                score_fragilidade, 
                score_aging_divida, 
                score_escolarizacao, 
                score_eixo_i, 
                score_maturidade, 
                score_crescimento,
                score_populacao, 
                score_eixo_ii
            }
        })

        return response.status(201).json({message: 'Dado do Score recebido e cadastrado com sucesso', dado})
    }

    catch(error){
        console.error(error)
        return response.status(500).json({error: 'Erro ao receber dados'})
    }
}


export async function criarDadosMediaRegiao(request: Request, response: Response) {
    const { regiao, media_inadimplencia, media_fragilidade, media_aging_divida, media_escolarizacao, media_score_eixo_i, media_maturidade, media_crescimento, media_populacao, media_score_eixo_ii } = request.body

    if(!regiao || !media_score_eixo_i || !media_score_eixo_ii){
        return response.status(400).json({error: 'Campos obrigatórios faltando'})
    }

    try{
        const dado = await prisma.mediaRegiao.create({
            data: {
                regiao, 
                media_inadimplencia, 
                media_fragilidade, 
                media_aging_divida, 
                media_escolarizacao, 
                media_score_eixo_i, 
                media_maturidade, 
                media_crescimento, 
                media_populacao, 
                media_score_eixo_ii
            }
        })

        return response.status(201).json({message: 'Dado da Media Regiao recebido e cadastrado com sucesso', dado})
    }

    catch(error){
        console.error(error)
        return response.status(500).json({error: 'Erro ao receber dados'})
    }
}


export async function listarDados(request: Request, response: Response) {
  try {
    const [dadosScore, dadosMediaRegiao] = await Promise.all([
      prisma.scoreUf.findMany(),
      prisma.mediaRegiao.findMany()
    ])

    return response.json({
      dadosScore,
      dadosMediaRegiao
    })
  } catch (error) {
    console.error("Erro ao listar dados:", error)
    return response.status(500).json({ error: 'Erro ao buscar dados' })
  }
}
