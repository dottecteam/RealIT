import { z } from 'zod'
import { INDICADORES_VALIDOS, REGIOES_VALIDAS, SCORE_MIN, SCORE_MAX } from '../utils/filterParser'

function splitCsv(val: unknown): string[] | undefined {
  if (val === undefined || val === null || val === '') return undefined
  const bruto = Array.isArray(val) ? val.map((v) => String(v)) : String(val).split(',')
  const itens = bruto.map((s) => s.trim()).filter(Boolean)
  return itens.length > 0 ? itens : undefined
}

export const baseFiltroQuerySchema = z.object({
  indicador: z.preprocess(
    splitCsv,
    z.array(z.enum(INDICADORES_VALIDOS as unknown as [string, ...string[]])).optional()
  ),
  regiao: z.preprocess(
    splitCsv,
    z.array(z.enum(REGIOES_VALIDAS as unknown as [string, ...string[]])).optional()
  ),
  uf: z.preprocess(
    (val) => {
      const lista = splitCsv(val)
      return lista ? lista.map((s) => s.toUpperCase()) : undefined
    },
    z.array(z.string().length(2, 'Cada UF deve ter exatamente 2 caracteres')).optional()
  ),
  mesAno:    z.string().regex(/^\d{6}$/, "Formato esperado: AAAAMM").optional(),
  mesInicio: z.string().regex(/^\d{6}$/, "Formato esperado: AAAAMM").optional(),
  mesFim:    z.string().regex(/^\d{6}$/, "Formato esperado: AAAAMM").optional(),
  scoreRCMin: scoreParam('scoreRCMin'),
  scoreRCMax: scoreParam('scoreRCMax'),
  scoreIEMin: scoreParam('scoreIEMin'),
  scoreIEMax: scoreParam('scoreIEMax'),
})

function scoreParam(nome: string) {
  return z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') return undefined
      const txt = String(val).trim().replace(',', '.')
      const num = Number(txt)
      return Number.isFinite(num) ? num : val
    },
    z
      .number({ message: `${nome} deve ser numérico` })
      .min(SCORE_MIN, `${nome} mínimo é ${SCORE_MIN}`)
      .max(SCORE_MAX, `${nome} máximo é ${SCORE_MAX}`)
      .optional()
  )
}
