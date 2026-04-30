/**
 * Fórmulas baseadas no documento SCORE:
 * z = 1 + ((x - min) / (max - min)) * 4
 * Score = sum(z * W)
 */

export function normalize(x: number, min: number, max: number): number {
    if (max === min) return 1.0;
    const z = 1 + ((x - min) / (max - min)) * 4;
    return Number(z.toFixed(2));
}

export function calculateWeightedScore(values: number[], weights: number[]): number {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const score = values.reduce((acc, val, i) => acc + (val * weights[i]), 0) / totalWeight;
    return Number(score.toFixed(2));
}

export function getStrategicCategory(scoreRC: number, scoreIE: number): string {
    if (scoreRC <= 2 && scoreIE <= 2) return "DIAMANTE BRUTO";
    if (scoreRC <= 2 && scoreIE >= 4) return "MERCADO MADURO";
    if (scoreRC >= 4 && scoreIE <= 2) return "FOMENTO SOCIAL";
    if (scoreRC >= 4 && scoreIE >= 4) return "SATURAÇÃO";
    return "INTERMEDIÁRIO";
}