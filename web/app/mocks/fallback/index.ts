/**
 * Resolve os dados de fallback dos dashboards quando uma chamada à API falha
 * (backend fora do ar, timeout, sem rede). É importado dinamicamente apenas no
 * caminho de erro, então o dataset não entra no bundle principal.
 */

import { dashboardChartsFallback } from "./data/dashboardCharts";
import { regionalChartsFallback } from "./data/regionalCharts";
import { estadualChartsFallback } from "./data/estadualCharts";
import { fallbackMeta } from "./data/meta";

export { fallbackMeta };

type Params = Record<string, unknown> | undefined;

function getParam(params: Params, key: string): string | undefined {
  const v = params?.[key];
  return v == null ? undefined : String(v);
}

/**
 * Retorna o payload de fallback correspondente a uma URL de dashboard, ou
 * `null` quando não existe fallback para aquela rota (ex.: /users/me).
 *
 * @param url    URL relativa usada na chamada (ex.: "/data/regional-charts").
 * @param params Query params da chamada (ex.: { regiao: "Sul" }).
 */
export function resolveFallback(url: string, params?: Params): unknown | null {
  if (!url) return null;
  const path = url.split("?")[0];

  if (path.includes("/data/dashboard-charts")) {
    return dashboardChartsFallback;
  }

  if (path.includes("/data/regional-charts")) {
    const regiao = getParam(params, "regiao") ?? "Brasil";
    const mapa = regionalChartsFallback as Record<string, unknown>;
    return mapa[regiao] ?? mapa["Brasil"] ?? null;
  }

  if (path.includes("/data/estadual-charts")) {
    const uf = getParam(params, "uf")?.toUpperCase();
    if (!uf) return null;
    const mapa = estadualChartsFallback as Record<string, unknown>;
    return mapa[uf] ?? null;
  }

  return null;
}

/** Indica se existe fallback disponível para a rota informada. */
export function hasFallback(url: string, params?: Params): boolean {
  return resolveFallback(url, params) !== null;
}
