export type RegiaoNome = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export interface UfBase {
  uf: string;
  regiao: RegiaoNome;
  /** População residente em milhões (Censo 2022). */
  pop: number;
  /** Taxa de inadimplência real (fração da carteira / adultos negativados). */
  inad: number;
  /** Aging da dívida: proporção do saldo vencido há mais de 90 dias (0-1). */
  aging: number;
  /** Taxa de escolarização: adultos 25+ com ensino básico completo (0-1). */
  escol: number;
  /** Transações Pix per capita por mês (QT_Pagador / QT_PES_Pagador). */
  pixQt: number;
  /** Ticket médio do Pix em R$ (VL_Pagador / QT_Pagador). */
  pixTicket: number;
  /** Taxa de crescimento populacional geométrico (% a.a., 2010-2022). */
  cresc: number;
  /** Idade média estimada da população (anos). */
  idade: number;
  /** Composição da carteira PF por classe social [A, B, C, D, E] (soma = 1). */
  classes: [number, number, number, number, number];
}

export const UF_BASE: UfBase[] = [
  { uf: "AC", regiao: "Norte",        pop: 0.83,  inad: 0.43, aging: 0.37, escol: 0.50, pixQt: 39, pixTicket: 145, cresc: 1.20, idade: 28, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "AL", regiao: "Nordeste",     pop: 3.13,  inad: 0.45, aging: 0.40, escol: 0.41, pixQt: 36, pixTicket: 148, cresc: 0.10, idade: 31, classes: [0.04, 0.12, 0.29, 0.31, 0.24] },
  { uf: "AM", regiao: "Norte",        pop: 3.94,  inad: 0.45, aging: 0.33, escol: 0.48, pixQt: 48, pixTicket: 120, cresc: 0.70, idade: 29, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "AP", regiao: "Norte",        pop: 0.73,  inad: 0.45, aging: 0.42, escol: 0.52, pixQt: 42, pixTicket: 150, cresc: 1.00, idade: 28, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "BA", regiao: "Nordeste",     pop: 14.14, inad: 0.45, aging: 0.37, escol: 0.43, pixQt: 37, pixTicket: 151, cresc: -0.05, idade: 33, classes: [0.04, 0.12, 0.29, 0.31, 0.24] },
  { uf: "CE", regiao: "Nordeste",     pop: 8.79,  inad: 0.43, aging: 0.43, escol: 0.44, pixQt: 38, pixTicket: 150, cresc: 0.30, idade: 33, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "DF", regiao: "Centro-Oeste", pop: 2.82,  inad: 0.42, aging: 0.50, escol: 0.68, pixQt: 36, pixTicket: 255, cresc: 0.90, idade: 33, classes: [0.14, 0.26, 0.34, 0.18, 0.08] },
  { uf: "ES", regiao: "Sudeste",      pop: 3.83,  inad: 0.39, aging: 0.23, escol: 0.55, pixQt: 30, pixTicket: 210, cresc: 0.60, idade: 34, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "GO", regiao: "Centro-Oeste", pop: 7.06,  inad: 0.43, aging: 0.36, escol: 0.55, pixQt: 34, pixTicket: 235, cresc: 0.90, idade: 33, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "MA", regiao: "Nordeste",     pop: 6.78,  inad: 0.46, aging: 0.32, escol: 0.38, pixQt: 37, pixTicket: 140, cresc: 0.20, idade: 30, classes: [0.04, 0.12, 0.29, 0.31, 0.24] },
  { uf: "MG", regiao: "Sudeste",      pop: 20.54, inad: 0.40, aging: 0.28, escol: 0.52, pixQt: 30, pixTicket: 208, cresc: 0.40, idade: 35, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "MS", regiao: "Centro-Oeste", pop: 2.76,  inad: 0.40, aging: 0.28, escol: 0.56, pixQt: 34, pixTicket: 240, cresc: 0.80, idade: 33, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "MT", regiao: "Centro-Oeste", pop: 3.66,  inad: 0.41, aging: 0.20, escol: 0.54, pixQt: 35, pixTicket: 245, cresc: 1.20, idade: 32, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "PA", regiao: "Norte",        pop: 8.12,  inad: 0.46, aging: 0.31, escol: 0.42, pixQt: 40, pixTicket: 147, cresc: 0.50, idade: 30, classes: [0.04, 0.12, 0.29, 0.31, 0.24] },
  { uf: "PB", regiao: "Nordeste",     pop: 3.97,  inad: 0.41, aging: 0.58, escol: 0.43, pixQt: 36, pixTicket: 149, cresc: 0.20, idade: 34, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "PE", regiao: "Nordeste",     pop: 9.06,  inad: 0.44, aging: 0.34, escol: 0.46, pixQt: 37, pixTicket: 151, cresc: 0.25, idade: 33, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "PI", regiao: "Nordeste",     pop: 3.27,  inad: 0.39, aging: 0.55, escol: 0.44, pixQt: 35, pixTicket: 142, cresc: 0.10, idade: 32, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "PR", regiao: "Sul",          pop: 11.44, inad: 0.38, aging: 0.26, escol: 0.58, pixQt: 28, pixTicket: 222, cresc: 0.50, idade: 35, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "RJ", regiao: "Sudeste",      pop: 16.06, inad: 0.46, aging: 0.56, escol: 0.60, pixQt: 30, pixTicket: 209, cresc: 0.20, idade: 37, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "RN", regiao: "Nordeste",     pop: 3.30,  inad: 0.42, aging: 0.54, escol: 0.46, pixQt: 36, pixTicket: 150, cresc: 0.40, idade: 33, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "RO", regiao: "Norte",        pop: 1.58,  inad: 0.42, aging: 0.30, escol: 0.49, pixQt: 38, pixTicket: 150, cresc: 0.60, idade: 31, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "RR", regiao: "Norte",        pop: 0.64,  inad: 0.41, aging: 0.37, escol: 0.52, pixQt: 40, pixTicket: 150, cresc: 2.10, idade: 28, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
  { uf: "RS", regiao: "Sul",          pop: 10.88, inad: 0.39, aging: 0.27, escol: 0.57, pixQt: 27, pixTicket: 224, cresc: 0.10, idade: 37, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "SC", regiao: "Sul",          pop: 7.61,  inad: 0.34, aging: 0.32, escol: 0.60, pixQt: 25, pixTicket: 226, cresc: 1.10, idade: 34, classes: [0.10, 0.22, 0.34, 0.22, 0.12] },
  { uf: "SE", regiao: "Nordeste",     pop: 2.21,  inad: 0.43, aging: 0.47, escol: 0.45, pixQt: 37, pixTicket: 149, cresc: 0.50, idade: 32, classes: [0.05, 0.14, 0.31, 0.30, 0.20] },
  { uf: "SP", regiao: "Sudeste",      pop: 44.41, inad: 0.41, aging: 0.31, escol: 0.62, pixQt: 31, pixTicket: 209, cresc: 0.45, idade: 36, classes: [0.14, 0.26, 0.34, 0.18, 0.08] },
  { uf: "TO", regiao: "Norte",        pop: 1.51,  inad: 0.40, aging: 0.36, escol: 0.50, pixQt: 38, pixTicket: 148, cresc: 0.65, idade: 31, classes: [0.07, 0.18, 0.33, 0.27, 0.15] },
];

export const REGIAO_DE_UF: Record<string, RegiaoNome> = Object.fromEntries(
  UF_BASE.map((u) => [u.uf, u.regiao])
) as Record<string, RegiaoNome>;

export function fragilidadeRenda(u: UfBase): number {
  return Number((u.classes[3] + u.classes[4]).toFixed(4));
}

export function vulnerabilidadeSocial(u: UfBase): number {
  return Number((1 - u.escol).toFixed(4));
}

export function pixVlPerCapita(u: UfBase): number {
  return Number((u.pixQt * u.pixTicket).toFixed(2));
}

export function maturidadePix(u: UfBase): number {
  return Number((u.pixQt * 0.6 + (pixVlPerCapita(u) / 100) * 0.4).toFixed(4));
}

const IDADE_MAX = Math.max(...UF_BASE.map((u) => u.idade));

export function bonusDemografico(u: UfBase): number {
  return Number((IDADE_MAX - u.idade).toFixed(4));
}

export const PESOS_PADRAO = {
  inad: 0.35,
  renda: 0.35,
  aging: 0.2,
  vulner: 0.1,
  pix: 0.35,
  cresc: 0.25,
  pop: 0.25,
  bonus: 0.15,
};

function normalize(x: number, min: number, max: number): number {
  if (max === min) return 1.0;
  return Number((1 + ((x - min) / (max - min)) * 4).toFixed(2));
}

function weighted(values: number[], weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const score = values.reduce((acc, v, i) => acc + v * weights[i], 0) / total;
  return Number(score.toFixed(2));
}

function getStrategicCategory(scoreRC: number, scoreIE: number): string {
  if (scoreRC <= 2 && scoreIE <= 2) return "DIAMANTE BRUTO";
  if (scoreRC <= 2 && scoreIE >= 4) return "MERCADO MADURO";
  if (scoreRC >= 4 && scoreIE <= 2) return "FOMENTO SOCIAL";
  if (scoreRC >= 4 && scoreIE >= 4) return "SATURAÇÃO";
  return "INTERMEDIÁRIO";
}

function minMax(vals: number[]) {
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

export interface RankingItem {
  uf: string;
  regiao: RegiaoNome;
  mesAno: string;
  score_eixo_i: number;
  score_eixo_ii: number;
  categoria: string;
}

const MES_REFERENCIA = "2026-05";

export function calcularRanking(): RankingItem[] {
  const lim = {
    inad: minMax(UF_BASE.map((u) => u.inad)),
    renda: minMax(UF_BASE.map(fragilidadeRenda)),
    aging: minMax(UF_BASE.map((u) => u.aging)),
    vulner: minMax(UF_BASE.map(vulnerabilidadeSocial)),
    pix: minMax(UF_BASE.map(maturidadePix)),
    cresc: minMax(UF_BASE.map((u) => u.cresc)),
    pop: minMax(UF_BASE.map((u) => u.pop)),
    bonus: minMax(UF_BASE.map(bonusDemografico)),
  };

  return UF_BASE.map((u) => {
    const z = {
      inad: normalize(u.inad, lim.inad.min, lim.inad.max),
      renda: normalize(fragilidadeRenda(u), lim.renda.min, lim.renda.max),
      aging: normalize(u.aging, lim.aging.min, lim.aging.max),
      vulner: normalize(vulnerabilidadeSocial(u), lim.vulner.min, lim.vulner.max),
      pix: normalize(maturidadePix(u), lim.pix.min, lim.pix.max),
      cresc: normalize(u.cresc, lim.cresc.min, lim.cresc.max),
      pop: normalize(u.pop, lim.pop.min, lim.pop.max),
      bonus: normalize(bonusDemografico(u), lim.bonus.min, lim.bonus.max),
    };

    const scoreRC = weighted(
      [z.inad, z.renda, z.aging, z.vulner],
      [PESOS_PADRAO.inad, PESOS_PADRAO.renda, PESOS_PADRAO.aging, PESOS_PADRAO.vulner]
    );
    const scoreIE = weighted(
      [z.pix, z.cresc, z.pop, z.bonus],
      [PESOS_PADRAO.pix, PESOS_PADRAO.cresc, PESOS_PADRAO.pop, PESOS_PADRAO.bonus]
    );

    return {
      uf: u.uf,
      regiao: u.regiao,
      mesAno: MES_REFERENCIA,
      score_eixo_i: scoreRC,
      score_eixo_ii: scoreIE,
      categoria: getStrategicCategory(scoreRC, scoreIE),
    };
  });
}

export const RANKING_FALLBACK = calcularRanking();

export type IndicadorId =
  | "inadimplenciaReal"
  | "fragilidadeRenda"
  | "agingDivida"
  | "vulnerabilidadeSocial"
  | "maturidadePix"
  | "crescimentoPopulacional"
  | "populacaoAbsoluta"
  | "bonusDemografico";

export const INDICADORES: { id: IndicadorId; name: string }[] = [
  { id: "inadimplenciaReal", name: "Inadimplência Real" },
  { id: "fragilidadeRenda", name: "Fragilidade Renda" },
  { id: "agingDivida", name: "Aging da Dívida" },
  { id: "vulnerabilidadeSocial", name: "Vulnerabilidade" },
  { id: "maturidadePix", name: "Maturidade PIX" },
  { id: "crescimentoPopulacional", name: "Cresc. Populacional" },
  { id: "populacaoAbsoluta", name: "População Absoluta" },
  { id: "bonusDemografico", name: "Bônus Demográfico" },
];

export function indicadoresNormalizados(): Record<IndicadorId, Record<string, number>> {
  const lim = {
    inadimplenciaReal: minMax(UF_BASE.map((u) => u.inad)),
    fragilidadeRenda: minMax(UF_BASE.map(fragilidadeRenda)),
    agingDivida: minMax(UF_BASE.map((u) => u.aging)),
    vulnerabilidadeSocial: minMax(UF_BASE.map(vulnerabilidadeSocial)),
    maturidadePix: minMax(UF_BASE.map(maturidadePix)),
    crescimentoPopulacional: minMax(UF_BASE.map((u) => u.cresc)),
    populacaoAbsoluta: minMax(UF_BASE.map((u) => u.pop)),
    bonusDemografico: minMax(UF_BASE.map(bonusDemografico)),
  };
  const cru: Record<IndicadorId, (u: UfBase) => number> = {
    inadimplenciaReal: (u) => u.inad,
    fragilidadeRenda: fragilidadeRenda,
    agingDivida: (u) => u.aging,
    vulnerabilidadeSocial: vulnerabilidadeSocial,
    maturidadePix: maturidadePix,
    crescimentoPopulacional: (u) => u.cresc,
    populacaoAbsoluta: (u) => u.pop,
    bonusDemografico: bonusDemografico,
  };

  const out = {} as Record<IndicadorId, Record<string, number>>;
  for (const { id } of INDICADORES) {
    out[id] = {};
    for (const u of UF_BASE) {
      out[id][u.uf] = normalize(cru[id](u), lim[id].min, lim[id].max);
    }
  }
  return out;
}

export function mediasNacionaisZ(): Record<IndicadorId, number> {
  const norm = indicadoresNormalizados();
  const out = {} as Record<IndicadorId, number>;
  for (const { id } of INDICADORES) {
    const vals = Object.values(norm[id]);
    out[id] = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }
  return out;
}
