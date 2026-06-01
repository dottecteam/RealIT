export interface DashboardData {
    ranking: Array<{
        uf: string;
        regiao: string;
        score_eixo_i: number;
        score_eixo_ii: number;
    }>;
    history: {
        categories: string[];
        series: Array<{ name: string; data: number[] }>;
    };
}