import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function criarDadosScore(request: Request, response: Response) {
    const dados = request.body // Agora é um array completo do Colab

    try {
        const resultado = await prisma.scoreUf.createMany({
            data: dados
        })

        return response.status(201).json({
            message: `${resultado.count} registros de Score UF cadastrados com sucesso.`
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({ error: 'Erro ao cadastrar dados do Score UF' })
    }
}


export async function criarDadosMediaRegiao(request: Request, response: Response) {
    const dados = request.body // Agora é um array completo do Colab

    try {
        const resultado = await prisma.mediaRegiao.createMany({
            data: dados
        })

        return response.status(201).json({
            message: `${resultado.count} registros de Média Região cadastrados com sucesso.`
        })
    } catch (error) {
        console.error(error)
        return response.status(500).json({ error: 'Erro ao cadastrar dados da Média Região' })
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