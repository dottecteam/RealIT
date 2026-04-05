import { z } from 'zod'

export const userSchema = z.object({
  email: z.email('E-mail inválido'),
  name: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export const dadosSchema = z.object({
  data_base: z.string().min(1, 'Data base é obrigatória'),
  uf: z.string().length(2, 'UF deve ter exatamente 2 letras'),
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  cnae_ocupacao: z.string().min(1, 'CNAE é obrigatório'),
  porte: z.string().min(1, 'Porte é obrigatório'),
  carteira_inadiplencia: z.number(),
  carteira_vencida: z.number().optional()
})

export const dadosPixSchema = z.object({
  ano_mes: z.number().int('Ano/mês deve ser um número inteiro'),
  municipio_ibge: z.number().int('Código IBGE do município deve ser um número inteiro'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  estado_ibge: z.number().int('Código IBGE do estado deve ser um número inteiro'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  sigla_regiao: z.string().min(1, 'Sigla da região é obrigatória'),
  vl_pagador_pf: z.number({ message: 'Volume pagador deve ser um número e é obrigatório' }),
  qt_pagador_pf: z.number().int('Quantidade pagador deve ser um número inteiro'),
  vl_recebedor_pf: z.number({ message: 'Volume recebedor deve ser um número e é obrigatório' }),
  qt_recebedor_pf: z.number().int('Quantidade recebedor deve ser um número inteiro'),
  qt_pes_pagador_pf: z.number().int('Quantidade de pessoas pagadoras deve ser um número inteiro'),
  qt_pes_recebedor_pf: z.number().int('Quantidade de pessoas recebedoras deve ser um número inteiro')
})

export const taxaEscolarizacaoSchema = z.object({
  nn: z.string().min(1, 'Unidade da Federação (nn) é obrigatória'),
  v: z.number({ message: 'Valor (v) deve ser um número e é obrigatório' }),
  d1n: z.string().min(1, 'Unidade da Federação (d1n) é obrigatória'),
  d3n: z.number().int('Ano (d3n) deve ser um número inteiro'),
  d5n: z.string().min(1, 'Grupo de idade (d5n) é obrigatório')
})

export const crescimentoPopulacionalSchema = z.object({
  d1n: z.string().min(1, 'Unidade da Federação (d1n) é obrigatória'),
  d2n: z.string().min(1, 'Taxa de crescimento (d2n) é obrigatória'),
  v: z.number({ message: 'Valor (v) deve ser um número e é obrigatório' })
})

export const populacaoAbsolutaSchema = z.object({
  d1n: z.string().min(1, 'Unidade da Federação (d1n) é obrigatória'),
  d2n: z.string().min(1, 'População residente (d2n) é obrigatória'),
  v: z.number().int('Valor (v) deve ser um número inteiro')
})

export const bonusDemograficoSchema = z.object({
  brasilGrandeRegiaoUf: z.string().min(1, 'Localidade é obrigatória'),
  total: z.number().int('População total deve ser um número inteiro'),
  xy_anos: z.number().int('População da idade específica deve ser um número inteiro')
})

  

export const inclusaoDemograficaSchema = z.object({
  MaturidadePix: z.number({ message: 'Maturidade Pix deve ser um número' }),
  CrescimentoPopulacional: z.number({ message: 'Crescimento populacional deve ser um número' }),
  PopulacaoAbsoluta: z.number().int('População absoluta deve ser um número inteiro'),
  BonusDemografico: z.number({ message: 'Bônus demográfico deve ser um número' })
})