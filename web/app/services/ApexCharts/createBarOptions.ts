import { ApexOptions } from "apexcharts";
import { buildChartOptions } from "./chartBuilder";
import { BAR_DEFAULTS } from "../../constants/charts/chartConfigs";

interface BarOptionsParams {
  categorias?: string[];
  cores?: string[];
  dashes?: number[];
  [key: string]: any;
}

export function createBarOptions({
  categorias,
  cores = ["#FF9A98", "#2cfff1", "#68E699", "#FFE372"],
  dashes,
  ...overrides
}: BarOptionsParams = {}): ApexOptions {
  return buildChartOptions({
    baseConfig: BAR_DEFAULTS,
    categorias,
    cores,
    dashes,
    overrides
  });
}