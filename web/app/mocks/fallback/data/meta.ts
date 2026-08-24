// Metadados do dataset de fallback (fontes e janela temporal).

export const fallbackMeta = {
  "janela": {
    "inicio": "202206",
    "fim": "202605",
    "meses": 48
  },
  "fontesReais": [
    "IBGE SIDRA t/7138 — Taxa de escolarização por UF",
    "IBGE SIDRA t/6579 — População residente estimada por UF",
    "BCB SGS 21082 — Inadimplência PF (% mensal, nacional)"
  ],
  "estimativas": [
    "Distribuição relativa entre UFs (perfil de web/app/mocks/score.ts)",
    "Curva de adoção do PIX (logística) e volumes per capita",
    "Bônus demográfico por região"
  ],
  "metodologia": "normalização min-max 1..5 por mês (fastapi/main.py) + score ponderado (api/src/services/scoreService.ts)"
} as const;
