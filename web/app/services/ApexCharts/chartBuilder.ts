import { ApexOptions } from "apexcharts";
import { makeLegendMarkers } from "../../utils/chartUtils";

interface ChartBuilderParams {
    baseConfig: any;
    categorias?: string[];
    cores: string[];
    dashes?: number[];
    markerSizes?: number[];
    overrides?: Record<string, any>;
}

export function buildChartOptions({
    baseConfig,
    categorias = [],
    cores,
    dashes = [0],
    markerSizes = [0],
    overrides = {}
}: ChartBuilderParams): ApexOptions {
    const options: ApexOptions = {
        chart: {
            ...baseConfig.chart,
            ...overrides.chart,
        } as ApexOptions["chart"],

        colors: cores,

        stroke: {
            ...baseConfig.stroke,
            dashArray: dashes,
            ...overrides.stroke,
        } as ApexOptions["stroke"],

        markers: {
            size: markerSizes as any,
            ...overrides.markers,
        },

        plotOptions: {
            ...baseConfig.plotOptions,
            bar: {
                ...baseConfig.plotOptions?.bar,
                ...overrides.plotOptions?.bar,
            },
            ...overrides.plotOptions,
        } as ApexOptions["plotOptions"],

        dataLabels: {
            ...baseConfig.dataLabels,
            ...overrides.dataLabels
        },

        xaxis: {
            ...baseConfig.xaxis,
            categories: categorias.length > 0 ? categorias : (overrides.xaxis?.categories || []),
            ...overrides.xaxis,
        } as ApexOptions["xaxis"],

        yaxis: {
            ...baseConfig.yaxis,
            ...overrides.yaxis,
            labels: {
                ...baseConfig.yaxis?.labels,
                ...overrides.yaxis?.labels,
            }
        } as ApexOptions["yaxis"],

        legend: {
            ...baseConfig.legend,
            markers: makeLegendMarkers(cores, dashes),
            ...overrides.legend,
        } as ApexOptions["legend"],

        grid: {
            ...baseConfig.grid,
            ...overrides.grid,
        } as ApexOptions["grid"],

        tooltip: {
            ...baseConfig.tooltip,
            ...overrides.tooltip,
        } as ApexOptions["tooltip"],

        fill: {
            ...baseConfig.fill,
            ...overrides.fill
        },

        annotations: {
            ...overrides.annotations
        }
    };

    return options;
}