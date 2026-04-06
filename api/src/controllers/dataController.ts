// import e, {Request, Response} from 'express'
// import {prisma} from '../lib/prisma'

// export async function criarDados(request: Request, response: Response) {
//     const {data_base, uf, cliente, cnae_ocupacao, porte, carteira_inadiplencia, carteira_vencida, carteira_ativa, carteira_acima_de_90_dias} = request.body

//     if(!data_base || !uf || !cliente){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.dados.create({
//             data: {
//                 data_base, 
//                 uf, 
//                 cliente, 
//                 cnae_ocupacao, 
//                 porte, 
//                 carteira_inadiplencia,
//                 carteira_vencida,
//                 carteira_ativa,
//                 carteira_acima_de_90_dias
//             }
//         })

//         return response.status(201).json({message: 'Dado recebido e cadastrado com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber dados'})
//     }
// }

// export async function criarDadosPIX(request: Request, response: Response) {
//     const {ano_mes, municipio_ibge, municipio, estado_ibge, estado, sigla_regiao, vl_pagador_pf, qt_pagador_pf, qt_pes_pagador_pf } = request.body

//     if(!ano_mes || !sigla_regiao || !municipio_ibge){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.dadosPix.create({
//             data: {
//                 ano_mes, 
//                 municipio_ibge, 
//                 municipio, 
//                 estado_ibge, 
//                 estado, 
//                 sigla_regiao, 
//                 vl_pagador_pf, 
//                 qt_pagador_pf, 
//                 qt_pes_pagador_pf
//             }
//         })

//         return response.status(201).json({message: 'Dado PIX recebido e cadastrado com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber dados PIX'})
//     }
// }

// export async function criarDadosTaxaEscolarizacao(request: Request, response: Response) {
//     const { nn, v, d1n, d3n, d5n } = request.body

//     if(!nn || !v || !d5n){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.taxaEscolarizacao.create({
//             data: {
//                 nn, 
//                 v, 
//                 d1n, 
//                 d3n, 
//                 d5n
//             }
//         })

//         return response.status(201).json({message: 'Taxa de escolarização recebida e cadastrada com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber taxa de escolarização'})
//     }
// }

// export async function criarDadosCresPopulacional(request: Request, response: Response) {
//     const { d1n, d2n, v } = request.body

//     if(!d1n || !v || !d2n){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.crescimentoPopulacional.create({
//             data: {
//                 d1n,
//                 d2n,
//                 v
//             }
//         })

//         return response.status(201).json({message: 'Crescimento populacional recebido e cadastrado com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber crescimento populacional'})
//     }
// }

// export async function criarDadosPopAbsoluta(request: Request, response: Response) {
//     const { d1n, d2n, v } = request.body

//     if(!d1n || !v || !d2n){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.populacaoAbsoluta.create({
//             data: {
//                 d1n,
//                 d2n,
//                 v
//             }
//         })

//         return response.status(201).json({message: 'População Absoluta recebida e cadastrada com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber população absoluta'})
//     }
// }

// export async function criarDadosBonusDemografico(request: Request, response: Response) {
//     const { brasilGrandeRegiaoUf, total, xy_anos } = request.body

//     if(!brasilGrandeRegiaoUf || !total || !xy_anos){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try{
//         const dado = await prisma.bonusDemografico.create({
//             data: {
//                 brasilGrandeRegiaoUf, 
//                 total, 
//                 xy_anos
//             }
//         })

//         return response.status(201).json({message: 'Bônus Demográfico recebido e cadastrado com sucesso', dado})
//     }

//     catch(error){
//         console.error(error)
//         return response.status(500).json({error: 'Erro ao receber Bônus Demográfico'})
//     }
// }

// export async function criarDadosRiscoCredito(request: Request, response: Response) {
//     const { inadimplenciaReal, FragilidadeRenda, AgingDivida, VulnerabilidadeSocial } = request.body
    
//     if(!inadimplenciaReal || !FragilidadeRenda || !AgingDivida || !VulnerabilidadeSocial){
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try {
//         const dado = await prisma.riscoCredito.create({
//             data: { inadimplenciaReal, FragilidadeRenda, AgingDivida, VulnerabilidadeSocial }
//         })
//         return response.status(201).json({ message: 'Risco de Crédito cadastrado com sucesso', dado })
//     } catch (error) {
//         console.error(error)
//         return response.status(500).json({ error: 'Erro ao receber Risco de Crédito' })
//     }
// }

// export async function criarDadosInclusaoDemografica(request: Request, response: Response) {
//     const { MaturidadePix, CrescimentoPopulacional, PopulacaoAbsoluta, BonusDemografico } = request.body
    
//     if(!MaturidadePix || !CrescimentoPopulacional || !PopulacaoAbsoluta || !BonusDemografico) {
//         return response.status(400).json({error: 'Campos obrigatórios faltando'})
//     }

//     try {
//         const dado = await prisma.inclusaoDemografica.create({
//             data: { MaturidadePix, CrescimentoPopulacional, PopulacaoAbsoluta, BonusDemografico }
//         })
//         return response.status(201).json({ message: 'Inclusão Demográfica cadastrada com sucesso', dado })
//     } catch (error) {
//         console.error(error)
//         return response.status(500).json({ error: 'Erro ao receber Inclusão Demográfica' })
//     }
// }

// export async function listarDados(request: Request, response: Response) {
//   try {
//     const dados = await prisma.dados.findMany()
//     return response.json(dados)
//   } catch (error) {
//      console.error("ERRO LISTAR DADOS:", error)
//     return response.status(500).json({ error: 'Erro ao buscar dados' })
//   }
// }

// export async function listarDadosPIX(request: Request, response: Response) {
//   try {
//     const dadosPIX = await prisma.dadosPix.findMany()
//     return response.json(dadosPIX)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar dados PIX' })
//   }
// }

// export async function listarTaxaEscolarizacao(request: Request, response: Response) {
//   try {
//     const taxaEsc = await prisma.taxaEscolarizacao.findMany()
//     return response.json(taxaEsc)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar Taxa de Escolarização' })
//   }
// }

// export async function listarCrescimentoPopulacional(request: Request, response: Response) {
//   try {
//     const cresPop = await prisma.crescimentoPopulacional.findMany()
//     return response.json(cresPop)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar Crescimento Populacional' })
//   }
// }

// export async function listarPopAbsoluta(request: Request, response: Response) {
//   try {
//     const popAbs = await prisma.populacaoAbsoluta.findMany()
//     return response.json(popAbs)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar População Absoluta' })
//   }
// }

// export async function listarBonusDemografico(request: Request, response: Response) {
//   try {
//     const bonus = await prisma.bonusDemografico.findMany()
//     return response.json(bonus)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar Bônus Demográfico' })
//   }
// }

// export async function listarRiscoCredito(request: Request, response: Response) {
//   try {
//     const dados = await prisma.riscoCredito.findMany()
//     return response.json(dados)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar Risco de Crédito' })
//   }
// }

// export async function listarInclusaoDemografica(request: Request, response: Response) {
//   try {
//     const dados = await prisma.inclusaoDemografica.findMany()
//     return response.json(dados)
//   } catch (error) {
//     return response.status(500).json({ error: 'Erro ao buscar Inclusão Demográfica' })
//   }
// }