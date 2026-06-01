/**
 * Configurações padrão puras e literais para Gráficos de Linha
 */
export const LINE_DEFAULTS = {
    chart: {
        type: "line",
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: { speed: 150 }
        },
        selection: { enabled: false },
    },
    stroke: {
        curve: "smooth",
        width: 2.5
    },
    yaxis: {
        min: 1,
        max: 5,
        tickAmount: 4,
        labels: {
            style: { colors: "var(--gray-400)", fontSize: "11px" },
        },
    },
    grid: {
        borderColor: "var(--gray-100)",
        strokeDashArray: 4
    },
    tooltip: {
        theme: "light",
        shared: true,
        intersect: false,
    },
    legend: {
        position: "bottom",
        fontSize: "11px",
        labels: { colors: "var(--gray-600)" },
    },
} as const;

export const BAR_DEFAULTS = {
    chart: {
        type: "bar",
        stacked: true,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
        animations: {
            enabled: true,
            easing: "easeinout",
            speed: 300,
            animateGradually: { enabled: false }
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 7,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            dataLabels: {
                total: {
                    enabled: true,
                    offsetY: -12,
                    style: { fontSize: "13px", fontWeight: 400 },
                },
            },
        },
    },
    dataLabels: { enabled: false },
    yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
            style: { colors: "#ADADAD", fontSize: "12px" },
        },
    },
    fill: { opacity: 1 },
    grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
    },
    tooltip: { theme: "light", shared: true, intersect: false },
    legend: { position: "bottom", fontSize: "11px" },
} as const;