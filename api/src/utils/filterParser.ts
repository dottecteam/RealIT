export const REGIOES_VALIDAS = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
] as const

export type RegiaoValida = (typeof REGIOES_VALIDAS)[number]

export const INDICADORES_RISCO = [
  'inadimplenciaReal',
  'fragilidadeRenda',
  'agingDivida',
  'vulnerabilidadeSocial',
] as const

export const INDICADORES_INCLUSAO = [
  'maturidadePix',
  'crescimentoPopulacional',
  'populacaoAbsoluta',
  'bonusDemografico',
] as const

export const INDICADORES_VALIDOS = [
  ...INDICADORES_RISCO,
  ...INDICADORES_INCLUSAO,
] as const

export type IndicadorRisco = (typeof INDICADORES_RISCO)[number]
export type IndicadorInclusao = (typeof INDICADORES_INCLUSAO)[number]
export type Indicador = (typeof INDICADORES_VALIDOS)[number]

export const INDICADOR_PARA_CAMPO_DB: Record<Indicador, string> = {
  inadimplenciaReal:       'inadiplenciaReal',
  fragilidadeRenda:        'fragilidadeRenda',
  agingDivida:             'agingDivida',
  vulnerabilidadeSocial:   'vulnerabilidadeSocial',
  maturidadePix:           'maturidadePix',
  crescimentoPopulacional: 'crescimentoPopulacional',
  populacaoAbsoluta:       'populacaoAbsoluta',
  bonusDemografico:        'bonusDemografico',
}

export const CAMPO_DB_PARA_INDICADOR: Record<string, Indicador> = Object.fromEntries(
  Object.entries(INDICADOR_PARA_CAMPO_DB).map(([publico, db]) => [db, publico as Indicador])
)


export function parseListParam(value: unknown): string[] | null {
  if (value === undefined || value === null || value === '') return null
  const bruto = Array.isArray(value)
    ? value.map((v) => String(v))
    : String(value).split(',')
  const itens = bruto.map((s) => s.trim()).filter(Boolean)
  return itens.length > 0 ? itens : null
}

export interface FiltrosParseados {
  indicador:   Indicador[] | null
  regiao:      string[]    | null
  uf:          string[]    | null
  mesAno:      string      | null
  mesInicio:   string      | null
  mesFim:      string      | null
  scoreRCMin:  number      | null
  scoreRCMax:  number      | null
  scoreIEMin:  number      | null
  scoreIEMax:  number      | null
}

export type FiltrosEco = {
  indicador:   string[] | null
  regiao:      string[] | null
  uf:          string[] | null
  mesAno:      string   | null
  mesInicio:   string   | null
  mesFim:      string   | null
  scoreRCMin:  number   | null
  scoreRCMax:  number   | null
  scoreIEMin:  number   | null
  scoreIEMax:  number   | null
}

export const SCORE_MIN = 1
export const SCORE_MAX = 5

export interface ParseFiltrosResultado {
  filtros: FiltrosParseados
  eco: FiltrosEco
  errors: string[]
}

export function parseFiltros(query: Record<string, unknown>): ParseFiltrosResultado {
  const errors: string[] = []

  const indicadorRaw = parseListParam(query.indicador)
  const regiaoRaw    = parseListParam(query.regiao)
  const ufRaw        = parseListParam(query.uf)
  const mesAno       = query.mesAno    ? String(query.mesAno).trim()    : null
  const mesInicio    = query.mesInicio ? String(query.mesInicio).trim() : null
  const mesFim       = query.mesFim    ? String(query.mesFim).trim()    : null

  const parseScore = (raw: unknown, nome: string): number | null => {
    if (raw === undefined || raw === null || raw === '') return null
    const txt = String(raw).trim().replace(',', '.')
    const num = Number(txt)
    if (!Number.isFinite(num)) {
      errors.push(`Parâmetro '${nome}' inválido: "${raw}". Esperado número entre ${SCORE_MIN} e ${SCORE_MAX}.`)
      return null
    }
    if (num < SCORE_MIN || num > SCORE_MAX) {
      errors.push(`Parâmetro '${nome}' fora do intervalo permitido (${SCORE_MIN}-${SCORE_MAX}): ${num}.`)
      return null
    }
    return Number(num.toFixed(2))
  }

  const scoreRCMin = parseScore(query.scoreRCMin, 'scoreRCMin')
  const scoreRCMax = parseScore(query.scoreRCMax, 'scoreRCMax')
  const scoreIEMin = parseScore(query.scoreIEMin, 'scoreIEMin')
  const scoreIEMax = parseScore(query.scoreIEMax, 'scoreIEMax')

  const validarRange = (min: number | null, max: number | null, prefix: string) => {
    if (min != null && max != null && min > max) {
      errors.push(`'${prefix}Min' (${min}) não pode ser maior que '${prefix}Max' (${max}).`)
    }
  }
  validarRange(scoreRCMin, scoreRCMax, 'scoreRC')
  validarRange(scoreIEMin, scoreIEMax, 'scoreIE')

  let indicador: Indicador[] | null = null
  if (indicadorRaw) {
    const invalidos = indicadorRaw.filter((i) => !INDICADORES_VALIDOS.includes(i as Indicador))
    if (invalidos.length > 0) {
      errors.push(
        `Indicador(es) inválido(s): ${invalidos.join(', ')}. Valores aceitos: ${INDICADORES_VALIDOS.join(', ')}.`
      )
    } else {
      indicador = indicadorRaw as Indicador[]
    }
  }

  let regiao: string[] | null = null
  if (regiaoRaw) {
    const invalidas = regiaoRaw.filter((r) => !REGIOES_VALIDAS.includes(r as RegiaoValida))
    if (invalidas.length > 0) {
      errors.push(
        `Região(ões) inválida(s): ${invalidas.join(', ')}. Valores aceitos: ${REGIOES_VALIDAS.join(', ')}.`
      )
    } else {
      regiao = regiaoRaw
    }
  }

  let uf: string[] | null = null
  if (ufRaw) {
    const normalizadas = ufRaw.map((u) => u.toUpperCase())
    const invalidas = normalizadas.filter((u) => u.length !== 2)
    if (invalidas.length > 0) {
      errors.push(
        `UF(s) inválida(s): ${invalidas.join(', ')}. Cada UF deve ter exatamente 2 caracteres.`
      )
    } else {
      uf = normalizadas
    }
  }

  const validarMes = (raw: string | null, nome: string) => {
    if (!raw) return
    if (!/^\d{6}$/.test(raw)) {
      errors.push(`Parâmetro '${nome}' inválido: "${raw}". Formato esperado: AAAAMM (6 dígitos).`)
    }
  }
  validarMes(mesAno, 'mesAno')
  validarMes(mesInicio, 'mesInicio')
  validarMes(mesFim, 'mesFim')

  const filtros: FiltrosParseados = {
    indicador, regiao, uf,
    mesAno, mesInicio, mesFim,
    scoreRCMin, scoreRCMax, scoreIEMin, scoreIEMax,
  }
  const eco: FiltrosEco = {
    indicador: indicador as string[] | null,
    regiao, uf,
    mesAno, mesInicio, mesFim,
    scoreRCMin, scoreRCMax, scoreIEMin, scoreIEMax,
  }

  return { filtros, eco, errors }
}

export function buildWhereFromFiltros(
  filtros: FiltrosParseados,
  opts: { campoMes?: 'mesAno' | 'ano_mes' | 'ano' } = {}
) {
  const campoMes = opts.campoMes ?? 'mesAno'
  const where: Record<string, any> = {}

  if (filtros.uf && filtros.uf.length > 0) {
    where.uf = filtros.uf.length === 1 ? filtros.uf[0] : { in: filtros.uf }
  }
  if (filtros.regiao && filtros.regiao.length > 0) {
    where.regiao = filtros.regiao.length === 1 ? filtros.regiao[0] : { in: filtros.regiao }
  }

  if (filtros.mesAno) {
    where[campoMes] = filtros.mesAno
  } else if (filtros.mesInicio || filtros.mesFim) {
    const range: Record<string, string> = {}
    if (filtros.mesInicio) range.gte = filtros.mesInicio
    if (filtros.mesFim)    range.lte = filtros.mesFim
    where[campoMes] = range
  }

  return where
}

export function buildRiscoSelect(filtros: FiltrosParseados) {
  if (!filtros.indicador) return undefined
  const select: Record<string, true> = {
    id: true, mesAno: true, uf: true, regiao: true,
  }
  for (const ind of filtros.indicador) {
    if (INDICADORES_RISCO.includes(ind as IndicadorRisco)) {
      select[INDICADOR_PARA_CAMPO_DB[ind]] = true
    }
  }
  return select
}

export function buildInclusaoSelect(filtros: FiltrosParseados) {
  if (!filtros.indicador) return undefined
  const select: Record<string, true> = {
    id: true, mesAno: true, uf: true, regiao: true,
  }
  for (const ind of filtros.indicador) {
    if (INDICADORES_INCLUSAO.includes(ind as IndicadorInclusao)) {
      select[INDICADOR_PARA_CAMPO_DB[ind]] = true
    }
  }
  return select
}

export function temIndicadorDeRisco(filtros: FiltrosParseados): boolean {
  if (!filtros.indicador) return true
  return filtros.indicador.some((i) => INDICADORES_RISCO.includes(i as IndicadorRisco))
}

export function temIndicadorDeInclusao(filtros: FiltrosParseados): boolean {
  if (!filtros.indicador) return true
  return filtros.indicador.some((i) => INDICADORES_INCLUSAO.includes(i as IndicadorInclusao))
}

export function normalizeRiscoRow<T extends Record<string, any>>(row: T): T {
  if (row == null) return row
  if (!('inadiplenciaReal' in row)) return row
  const { inadiplenciaReal, ...rest } = row as any
  return { ...rest, inadimplenciaReal: inadiplenciaReal } as T
}

export function normalizeRiscoRows<T extends Record<string, any>>(rows: T[]): T[] {
  return rows.map(normalizeRiscoRow)
}
