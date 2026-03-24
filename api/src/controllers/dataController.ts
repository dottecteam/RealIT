import e, {Request, Response} from 'express'
import {prisma} from '../lib/prisma'

export async function criarDados(request: Request, response: Response) {
    const {data_base, uf, cliente, cnae_ocupacao, porte, carteira_inadiplencia} = request.body

    if(!data_base || !uf || !cliente){
        return response.status(400).json({error: 'Campos obrigatórios faltando'})
    }

    try{
        const dado = await prisma.dados.create({
            data: {
                data_base, 
                uf, 
                cliente, 
                cnae_ocupacao, 
                porte, 
                carteira_inadiplencia
            }
        })

        return response.status(201).json({message: 'Dado recebido e cadastrado com sucesso', dado})
    }

    catch(error){
        console.error(error)
        return response.status(500).json({error: 'Erro ao receber dados'})
    }
}

export async function criarDadosPIX(request: Request, response: Response) {
    const {ano_mes, municipio_ibge, municipio, estado_ibge, estado, sigla_regiao, vl_pagador_pf, qt_pagador_pf, vl_recebedor_pf, qt_recebedor_pf, qt_pes_pagador_pf, qt_pes_recebedor_pf } = request.body

    if(!ano_mes || !sigla_regiao || !municipio_ibge){
        return response.status(400).json({error: 'Campos obrigatórios faltando'})
    }

    try{
        const dado = await prisma.dadosPix.create({
            data: {
                ano_mes, 
                municipio_ibge, 
                municipio, 
                estado_ibge, 
                estado, 
                sigla_regiao, 
                vl_pagador_pf, 
                qt_pagador_pf, 
                vl_recebedor_pf, 
                qt_recebedor_pf, 
                qt_pes_pagador_pf, 
                qt_pes_recebedor_pf 
            }
        })

        return response.status(201).json({message: 'Dado PIX recebido e cadastrado com sucesso', dado})
    }

    catch(error){
        console.error(error)
        return response.status(500).json({error: 'Erro ao receber dados PIX'})
    }
}

export async function listarDados(request: Request, response: Response) {
  try {
    const dados = await prisma.dados.findMany()
    return response.json(dados)
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar dados' })
  }
}

export async function listarDadosPIX(request: Request, response: Response) {
  try {
    const dadosPIX = await prisma.dadosPix.findMany()
    return response.json(dadosPIX)
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar dados PIX' })
  }
}