import { z } from 'zod'

export const userSchema = z.object({
  email: z.email('E-mail inválido'),
  name: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export const scoreUf = z.object({
  uf: z.number(),
  score_inadimplencia: z.number(), 
  score_fragilidade: z.number(), 
  score_aging_divida: z.number(), 
  score_escolarizacao: z.number(), 
  score_eixo_i: z.number(), 
  score_maturidade: z.number(), 
  score_crescimento: z.number(),
  score_populacao: z.number(), 
  score_eixo_ii: z.number()
})

export const mediaRegiao = z.object({
  regiao: z.number(), 
  media_inadimplencia: z.number(), 
  media_fragilidade: z.number(), 
  media_aging_divida: z.number(), 
  media_escolarizacao: z.number(), 
  media_score_eixo_i: z.number(), 
  media_maturidade: z.number(), 
  media_crescimento: z.number(), 
  media_populacao: z.number(), 
  media_score_eixo_ii: z.number()
})

