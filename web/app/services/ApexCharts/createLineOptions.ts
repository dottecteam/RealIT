import { ApexOptions } from "apexcharts";
import { buildChartOptions } from "./chartBuilder";
import { LINE_DEFAULTS } from "../../constants/charts/chartConfigs";

interface LineOptionsParams {
  categorias: string[];
  cores: string[];
  dashes?: number[];
  markerSizes?: number[];
  [key: string]: any;
}

export function createLineOptions({
  categorias,
  cores,
  dashes,
  markerSizes,
  ...overrides
}: LineOptionsParams): ApexOptions {
  return buildChartOptions({
    baseConfig: LINE_DEFAULTS,
    categorias,
    cores,
    dashes,
    markerSizes,
    overrides
  });
}