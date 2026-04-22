export const IBGE_TO_REGION: Record<number, string> = {
  11: "Norte", 12: "Norte", 13: "Norte", 14: "Norte", 15: "Norte", 16: "Norte", 17: "Norte",
  21: "Nordeste", 22: "Nordeste", 23: "Nordeste", 24: "Nordeste", 25: "Nordeste", 26: "Nordeste", 27: "Nordeste", 28: "Nordeste", 29: "Nordeste",
  31: "Sudeste", 32: "Sudeste", 33: "Sudeste", 35: "Sudeste",
  41: "Sul", 42: "Sul", 43: "Sul",
  50: "Centro-Oeste", 51: "Centro-Oeste", 52: "Centro-Oeste", 53: "Centro-Oeste",
};

export const STATE_TO_IBGE: Record<string, number> = {
  "RONDÔNIA": 11, "ACRE": 12, "AMAZONAS": 13, "RORAIMA": 14,
  "PARÁ": 15, "AMAPÁ": 16, "TOCANTINS": 17,
  "MARANHÃO": 21, "PIAUÍ": 22, "CEARÁ": 23, "RIO GRANDE DO NORTE": 24,
  "PARAÍBA": 25, "PERNAMBUCO": 26, "ALAGOAS": 27, "SERGIPE": 28, "BAHIA": 29,
  "MINAS GERAIS": 31, "ESPÍRITO SANTO": 32, "RIO DE JANEIRO": 33, "SÃO PAULO": 35,
  "PARANÁ": 41, "SANTA CATARINA": 42, "RIO GRANDE DO SUL": 43,
  "MATO GROSSO DO SUL": 50, "MATO GROSSO": 51, "GOIÁS": 52, "DISTRITO FEDERAL": 53,
};

export const STATE_TO_UF: Record<string, string> = {
  "RONDÔNIA": "RO", "ACRE": "AC", "AMAZONAS": "AM", "RORAIMA": "RR",
  "PARÁ": "PA", "AMAPÁ": "AP", "TOCANTINS": "TO",
  "MARANHÃO": "MA", "PIAUÍ": "PI", "CEARÁ": "CE", "RIO GRANDE DO NORTE": "RN",
  "PARAÍBA": "PB", "PERNAMBUCO": "PE", "ALAGOAS": "AL", "SERGIPE": "SE", "BAHIA": "BA",
  "MINAS GERAIS": "MG", "ESPÍRITO SANTO": "ES", "RIO DE JANEIRO": "RJ", "SÃO PAULO": "SP",
  "PARANÁ": "PR", "SANTA CATARINA": "SC", "RIO GRANDE DO SUL": "RS",
  "MATO GROSSO DO SUL": "MS", "MATO GROSSO": "MT", "GOIÁS": "GO", "DISTRITO FEDERAL": "DF",
};

export const IBGE_TO_UF: Record<number, string> = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR",
  15: "PA", 16: "AP", 17: "TO",
  21: "MA", 22: "PI", 23: "CE", 24: "RN",
  25: "PB", 26: "PE", 27: "AL", 28: "SE", 29: "BA",
  31: "MG", 32: "ES", 33: "RJ", 35: "SP",
  41: "PR", 42: "SC", 43: "RS",
  50: "MS", 51: "MT", 52: "GO", 53: "DF",
};