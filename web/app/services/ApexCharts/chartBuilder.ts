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


export const getRankingInadimplenciaOptions = (
    categories: string[],
    mediaRegiao: number,
    mediaNacional: number
): ApexCharts.ApexOptions => ({
    chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: { enabled: false },
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 4,
            borderRadiusApplication: "end",
            columnWidth: "70%",
        },
    },
    colors: ["#FF9A98"],
    dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: { fontSize: "10px", colors: ["#374151"], fontWeight: 400 },
        offsetX: 28,
    },
    xaxis: {
        categories: categories,
        labels: {
            formatter: (val: string) => `${val}%`,
            style: { colors: "#908f8f", fontSize: "11px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: { style: { colors: "#374151", fontSize: "11px", fontWeight: 600 } },
    },
    grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
    },
    annotations: {
        xaxis: [
            {
                x: mediaRegiao,
                borderColor: "#3B82F6",
                strokeDashArray: 4,
                label: {
                    text: `Reg: ${mediaRegiao.toFixed(1)}%`,
                    style: { color: "#3B82F6", background: "#EFF6FF", fontSize: "9px", fontWeight: "bold" },
                    position: "bottom",
                },
            },
            {
                x: mediaNacional,
                borderColor: "#F59E0B",
                strokeDashArray: 4,
                label: {
                    text: `BR: ${mediaNacional.toFixed(1)}%`,
                    style: { color: "#92400E", background: "#FFFBEB", fontSize: "9px", fontWeight: "bold" },
                    position: "top",
                },
            },
        ],
    },
    tooltip: {
        theme: "light",
        y: {
            formatter: (val: number) => `${val.toFixed(2)}%`,
            title: { formatter: () => "Taxa de inadimplência: " },
        },
    },
    legend: { show: false },
});


export const getMaturidadePixOptions = (): ApexCharts.ApexOptions => ({
    chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: { enabled: false },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 5,
            borderRadiusApplication: "end"
        },
    },
    colors: ["#2cfff1", "#3B82F6", "#F59E0B"],
    dataLabels: { enabled: false },
    xaxis: {
        categories: ["Transações per capita", "Volume per capita (R$)"],
        labels: { style: { colors: "#374151", fontSize: "11px", fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(1),
            style: { colors: "#908f8f", fontSize: "11px" },
        },
    },
    grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
    },
    tooltip: {
        theme: "light",
        shared: true,
        intersect: false,
        y: {
            formatter: (val: number, opts: any) => {
                const isVolume = opts?.dataPointIndex === 1;
                return isVolume
                    ? `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : val.toFixed(2);
            },
        },
    },
    legend: {
        position: "bottom",
        fontSize: "11px",
        labels: { colors: "#374151" },
    },
});

export const getRankingOptions = (
    categories: string[],
    mediaRegiao: number,
    mediaNacional: number,
    color: string,
    suffix: string = "%"
): ApexCharts.ApexOptions => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: "top" } } },
    colors: [color],
    dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}${suffix}`,
        style: { fontSize: "10px", colors: ["#374151"], fontWeight: 400 },
        offsetX: 28,
    },
    xaxis: {
        categories,
        labels: { formatter: (val: string) => `${val}${suffix}`, style: { colors: "#908f8f", fontSize: "11px" } },
        axisBorder: { show: false }, axisTicks: { show: false }
    },
    annotations: {
        xaxis: [
            { x: mediaRegiao, borderColor: "#3B82F6", strokeDashArray: 4, label: { text: `Reg: ${mediaRegiao.toFixed(1)}${suffix}`, style: { color: "#3B82F6", background: "#EFF6FF", fontSize: "9px" }, position: "bottom" } },
            { x: mediaNacional, borderColor: "#F59E0B", strokeDashArray: 4, label: { text: `BR: ${mediaNacional.toFixed(1)}${suffix}`, style: { color: "#92400E", background: "#FFFBEB", fontSize: "9px" }, position: "top" } }
        ]
    },
    tooltip: { theme: "light", y: { formatter: (val: number) => `${val.toFixed(2)}${suffix}` } }
});



export const getEvolucaoCarteiraOptions = (
    categories: string[],
    ufSigla: string
): ApexCharts.ApexOptions => ({
    chart: { type: "line", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
    stroke: { curve: "smooth", width: [2.5, 2.5, 2, 1.5], dashArray: [0, 0, 4, 4] },
    colors: ["#2cfff1", "#FF9A98", "#3B82F6", "#F59E0B"],
    markers: { size: [3, 3, 0, 0] },
    xaxis: {
        categories,
        labels: { rotate: -45, style: { fontSize: "10px", colors: "#908f8f" } },
        axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: [
        {
            seriesName: "Carteira Ativa",
            title: { text: "Carteira Ativa", style: { color: "#2cfff1", fontSize: "10px" } },
            labels: {
                formatter: (val: number) => val >= 1e9 ? `${(val / 1e9).toFixed(1)}B` : val >= 1e6 ? `${(val / 1e6).toFixed(1)}M` : val.toFixed(0),
                style: { colors: "#2cfff1", fontSize: "10px" }
            }
        },
        {
            seriesName: `Inadimplência ${ufSigla}`,
            opposite: true,
            title: { text: "Taxa de Inadimplência", style: { color: "#FF9A98", fontSize: "10px" } },
            labels: {
                formatter: (val: number) => `${(val * 100).toFixed(1)}%`,
                style: { colors: "#FF9A98", fontSize: "10px" }
            }
        },
        { seriesName: "Inadimplência Região", show: false, opposite: true },
        { seriesName: "Inadimplência Brasil", show: false, opposite: true }
    ],
    grid: { borderColor: "#F3F4F6", strokeDashArray: 4 },
    tooltip: {
        theme: "light",
        shared: true,
        intersect: false,
        y: [
            { formatter: (v: number) => v >= 1e9 ? `R$ ${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `R$ ${(v / 1e6).toFixed(2)}M` : `R$ ${v.toFixed(2)}`, title: { formatter: () => "Carteira Ativa: " } },
            { formatter: (v: number) => `${(v * 100).toFixed(2)}%`, title: { formatter: () => `Inad. ${ufSigla}: ` } },
            { formatter: (v: number) => `${(v * 100).toFixed(2)}%`, title: { formatter: () => "Inad. Região: " } },
            { formatter: (v: number) => `${(v * 100).toFixed(2)}%`, title: { formatter: () => "Inad. Brasil: " } }
        ]
    },
    legend: { position: "bottom", fontSize: "11px", labels: { colors: "#374151" } }
});


export const getComposicaoCarteiraOptions = (categories: string[]): ApexCharts.ApexOptions => ({
    chart: {
        type: "bar",
        stacked: true,
        stackType: "100%",
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: { enabled: false },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "40%",
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
        },
    },
    colors: ["#2cfff1", "#68E699", "#FFE372", "#FF9A98", "#FF6B6B"],
    dataLabels: {
        enabled: true,
        formatter: (val: number) => (val > 8 ? `${val.toFixed(0)}%` : ""),
        style: { fontSize: "10px", fontWeight: 600, colors: ["#1F2937"] },
    },
    xaxis: {
        categories,
        labels: { style: { colors: "#374151", fontSize: "12px", fontWeight: 700 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            formatter: (val: number) => `${val.toFixed(0)}%`,
            style: { colors: "#908f8f", fontSize: "11px" },
        },
    },
    grid: { borderColor: "#F3F4F6", strokeDashArray: 4 },
    tooltip: {
        theme: "light",
        shared: true,
        intersect: false,
        y: { formatter: (val: number) => `${val.toFixed(1)}%` },
    },
    legend: { position: "bottom", fontSize: "11px", labels: { colors: "#374151" } },
});