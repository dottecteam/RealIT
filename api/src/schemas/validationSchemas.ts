import { z } from 'zod'

export const userSchema = z.object({
  email: z.email('E-mail inválido'),
  name: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export const creditRiskSchema = z.object({
  ano_mes:               z.string().min(1, 'ano_mes é obrigatório'),
  regiao:                z.string().min(1, 'regiao é obrigatória'),
  uf:                    z.string().length(2, 'UF deve ter exatamente 2 caracteres'),
  inadimplenciaReal:     z.number(),
  fragilidadeRenda:      z.number(),
  agingDivida:           z.number(),
  vulnerabilidadeSocial: z.number(),
})

export const inclusionExpansionSchema = z.object({
  ano_mes:                 z.string().min(1, 'ano_mes é obrigatório'),
  regiao:                  z.string().min(1, 'regiao é obrigatória'),
  uf:                      z.string().length(2, 'UF deve ter exatamente 2 caracteres'),
  maturidadePix:           z.number(),
  crescimentoPopulacional: z.number(),
  totalHabitantes:         z.number().min(1,'Deve ser maior que zero'),
  bonusDemografico:        z.number(),
})

export const pixStructureSchema = z.object({
  ano_mes: z.string().min(1, 'ano_mes é obrigatório'),
  regiao:  z.string().min(1, 'regiao é obrigatória'),
  uf:      z.string().length(2, 'UF deve ter exatamente 2 caracteres'),
  tipo:    z.enum(['pf', 'pj'] as const, { error: 'tipo deve ser "pf" ou "pj"' }),
  classe:  z.string().nullable().optional(),
  metrica: z.string().min(1, 'metrica é obrigatória'),
  origem:  z.enum(['scr', 'pix']),
  valor:   z.number().min(0, 'valor deve ser um número positivo'),
})

export const ibgeStructureSchema = z.object({
  index:                z.number().optional(),  
  ano:                  z.string().min(1, 'ano é obrigatório'),
  regiao:               z.string().min(1, 'regiao é obrigatória'),
  uf:                   z.string().length(2, 'UF deve ter exatamente 2 caracteres'),
  taxa_escolarizacao:   z.number(),
  populacao_residente:  z.number(),
  taxa_crescimento:     z.number(),
  variacao_populacao:   z.number(),
})

// Código antigo, deletar após revisão
// import { z } from 'zod'

// export const userSchema = z.object({
//   email: z.email('E-mail inválido'),
//   name: z.string().optional(),
//   password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
// })

// export const scoreUf = z.object({
//   uf: z.string(),
//   score_inadimplencia: z.number(), 
//   score_fragilidade: z.number(), 
//   score_aging_divida: z.number(), 
//   score_escolarizacao: z.number(), 
//   score_eixo_i: z.number(), 
//   score_maturidade: z.number(), 
//   score_crescimento: z.number(),
//   score_populacao: z.number(), 
//   score_eixo_ii: z.number()
// })

// export const mediaRegiao = z.object({
//   regiao: z.string(), 
//   media_inadimplencia: z.number(), 
//   media_fragilidade: z.number(), 
//   media_aging_divida: z.number(), 
//   media_escolarizacao: z.number(), 
//   media_score_eixo_i: z.number(), 
//   media_maturidade: z.number(), 
//   media_crescimento: z.number(), 
//   media_populacao: z.number(), 
//   media_score_eixo_ii: z.number()
// })

// export const scoreUfArray = z.array(scoreUf)
// export const mediaRegiaoArray = z.array(mediaRegiao)