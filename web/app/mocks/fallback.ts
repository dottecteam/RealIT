import {
  UF_BASE,
  REGIAO_DE_UF,
  RANKING_FALLBACK,
  INDICADORES,
  pixVlPerCapita,
  mediasNacionaisZ,
  type RegiaoNome,
  type UfBase,
} from "./baseData";

const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function ultimosMeses(n: number, ano = 2026, mes = 4 /* maio, 0-based */): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    let m = mes - i;
    let a = ano;
    while (m < 0) {
      m += 12;
      a -= 1;
    }
    out.push(`${MESES_PT[m]}/${String(a).slice(2)}`);
  }
  return out;
}

function serieTemporal(base: number, n: number, amplitude = 0.04, tendencia = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const fase = Math.sin((i / Math.max(1, n - 1)) * Math.PI * 1.5);
    const trend = tendencia * (i / Math.max(1, n - 1));
    out.push(Number((base * (1 + fase * amplitude) + base * trend).toFixed(4)));
  }
  return out;
}

const round4 = (x: number) => Number(x.toFixed(4));
const ufsDaRegiao = (regiao: RegiaoNome) => UF_BASE.filter((u) => u.regiao === regiao);
const media = (vals: number[]) =>
  vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(4)) : 0;

function buildDashboardCharts(params: Record<string, any>) {
  const medias = mediasNacionaisZ();
  const indicadorFiltro: string[] | null = params.indicador
    ? String(params.indicador).split(",")
    : null;

  const categories = ultimosMeses(6);
  const series = INDICADORES.filter(
    (ind) => !indicadorFiltro || indicadorFiltro.includes(ind.id)
  ).map((ind) => ({
    name: ind.name,
    data: serieTemporal(medias[ind.id], categories.length, 0.05),
  }));

  return {
    filtros: { ...params, _fallback: true },
    ranking: RANKING_FALLBACK,
    history: { categories, series },
  };
}

// Usa inad direto (não inad/carteiraTotal) para manter ordenação correta por estado.
function taxaInadExibivel(u: UfBase): number {
  return round4(u.inad);
}

function buildRegionalCharts(params: Record<string, any>) {
  const regiao = (params.regiao as RegiaoNome) || "Norte";
  const ufsRegiao = ufsDaRegiao(regiao);

  const rankingInadimplencia = ufsRegiao
    .map((u) => ({ uf: u.uf, taxa: taxaInadExibivel(u) }))
    .sort((a, b) => b.taxa - a.taxa);

  const rankingAging = ufsRegiao
    .map((u) => ({ uf: u.uf, aging: round4(u.aging) }))
    .sort((a, b) => b.aging - a.aging);

  const rankingEscolaridade = ufsRegiao
    .map((u) => ({ uf: u.uf, taxa: round4(u.escol) }))
    .sort((a, b) => b.taxa - a.taxa);

  return {
    filtros: { ...params, _fallback: true },
    regiao,
    referencias: {
      taxaInadNacional: media(UF_BASE.map(taxaInadExibivel)),
      taxaInadRegiao: media(ufsRegiao.map(taxaInadExibivel)),
      agingNacional: media(UF_BASE.map((u) => u.aging)),
      agingRegiao: media(ufsRegiao.map((u) => u.aging)),
      escolaridadeNacional: media(UF_BASE.map((u) => u.escol)),
      escolaridadeRegiao: media(ufsRegiao.map((u) => u.escol)),
    },
    rankingInadimplencia,
    rankingAging,
    rankingEscolaridade,
  };
}

const CLASSES = ["a", "b", "c", "d", "e"];

function buildEstadualCharts(params: Record<string, any>) {
  const ufSigla = (params.uf as string) || UF_BASE[0].uf;
  const u = UF_BASE.find((x) => x.uf === ufSigla) ?? UF_BASE[0];
  const regiao = REGIAO_DE_UF[u.uf];
  const ufsRegiao = ufsDaRegiao(regiao);

  const maturidadePix = {
    qtPerCapita: {
      uf: round4(u.pixQt),
      regiao: media(ufsRegiao.map((x) => x.pixQt)),
      nacional: media(UF_BASE.map((x) => x.pixQt)),
    },
    vlPerCapita: {
      uf: pixVlPerCapita(u),
      regiao: media(ufsRegiao.map(pixVlPerCapita)),
      nacional: media(UF_BASE.map(pixVlPerCapita)),
    },
  };

  const composicaoRegiao = CLASSES.map((_, i) => media(ufsRegiao.map((x) => x.classes[i])));
  const composicaoNacional = CLASSES.map((_, i) => media(UF_BASE.map((x) => x.classes[i])));

  const categories = ultimosMeses(12);
  const taxaUF = taxaInadExibivel(u);
  const taxaRegiao = media(ufsRegiao.map(taxaInadExibivel));
  const taxaNacional = media(UF_BASE.map(taxaInadExibivel));
  const carteiraBase = u.pop * 1000;

  const evolucaoCarteira = {
    categories,
    carteiraAtiva: serieTemporal(carteiraBase, categories.length, 0.02, 0.06).map((v) =>
      Number(v.toFixed(2))
    ),
    taxaInadimplencia: serieTemporal(taxaUF, categories.length, 0.06),
    taxaInadRegiao: serieTemporal(taxaRegiao, categories.length, 0.03),
    taxaInadNacional: serieTemporal(taxaNacional, categories.length, 0.02),
  };

  return {
    filtros: { ...params, _fallback: true },
    uf: u.uf,
    maturidadePix,
    composicaoCarteira: {
      classes: CLASSES,
      uf: u.classes.map(round4),
      regiao: composicaoRegiao,
      nacional: composicaoNacional,
    },
    evolucaoCarteira,
  };
}

export function resolveFallback(
  endpoint: string,
  params: Record<string, any> = {}
): any | null {
  switch (endpoint) {
    case "/data/dashboard-charts":
      return buildDashboardCharts(params);
    case "/data/regional-charts":
      return buildRegionalCharts(params);
    case "/data/estadual-charts":
      return buildEstadualCharts(params);
    default:
      return null;
  }
}
