import { mockDadosMediaRegiao } from "./score"

export const ORDEM_REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]

export const dadosOrdenados = ORDEM_REGIOES.map(
  (r) => mockDadosMediaRegiao.find((d) => d.regiao === r)!
)

export const dadosEixoI_Score = [
  {
    name: "Inadimplência Real",
    data: dadosOrdenados.map((d) => d.media_inadimplencia),
  },
  {
    name: "Fragilidade de Renda",
    data: dadosOrdenados.map((d) => d.media_fragilidade),
  },
  {
    name: "Aging da Dívida",
    data: dadosOrdenados.map((d) => d.media_aging_divida),
  },
  {
    name: "Vulnerabilidade Social",
    data: dadosOrdenados.map((d) => d.media_escolarizacao),
  },
]

export const dadosEixoII_Score = [
  {
    name: "Maturidade Pix",
    data: dadosOrdenados.map((d) => d.media_maturidade),
  },
  {
    name: "Crescimento Populacional",
    data: dadosOrdenados.map((d) => d.media_crescimento),
  },
  {
    name: "População Absoluta",
    data: dadosOrdenados.map((d) => d.media_populacao),
  },
]

export const dadosEixoI_Ranking = [
  {
    name: "Inadimplência Real",
    data: [0.35,0.40,0.41,0.35,0.60,0.49,0.46,0.42,0.61,0.45,0.79,0.44,0.50,0.48,0.41,0.51,0.39,0.69,0.91,0.41,0.38,0.35,0.64,0.56,0.38,1.75,0.38],
  },
  {
    name: "Fragilidade de Renda",
    data: [1.05,1.06,1.03,1.08,1.03,1.03,1.00,1.03,1.02,1.04,1.01,1.02,1.01,1.02,1.05,1.04,1.06,1.01,1.00,1.06,1.04,1.07,1.02,1.02,1.05,0.99,1.03],
  },
  {
    name: "Aging da Dívida",
    data: [0.37,0.41,0.25,0.42,0.37,0.43,1.00,0.23,0.36,0.32,0.28,0.28,0.20,0.21,0.58,0.34,0.55,0.26,0.56,0.54,0.20,0.37,0.27,0.32,0.47,0.31,0.26],
  },
  {
    name: "Vulnerabilidade Social",
    data: [0.44,0.37,0.42,0.45,0.39,0.35,0.52,0.38,0.38,0.35,0.36,0.41,0.39,0.41,0.40,0.35,0.42,0.39,0.42,0.40,0.39,0.42,0.41,0.39,0.38,0.37,0.40],
  },
]

export const dadosEixoII_Ranking = [
  {
    name: "Maturidade Pix",
    data: [0.47,0.47,0.45,0.72,0.50,0.44,1.50,0.73,0.99,0.41,0.62,0.83,1.12,0.51,0.42,0.47,0.30,0.65,0.69,0.52,0.92,0.81,0.53,0.60,0.59,0.87,0.83],
  },
  {
    name: "Crescimento Populacional",
    data: [0.60,0.25,0.60,0.51,0.27,0.36,0.50,0.49,0.71,0.33,0.38,0.58,0.78,0.44,0.40,0.33,0.38,0.50,0.25,0.36,0.28,1.25,0.29,0.81,0.44,0.45,0.50],
  },
  {
    name: "População Absoluta",
    data: [0.28,0.25,0.39,0.27,0.29,0.36,0.33,0.35,0.58,0.31,0.55,0.35,0.45,0.42,0.31,0.33,0.30,0.57,0.27,0.29,0.25,0.31,0.31,0.68,0.29,1.25,0.29],
  },
  {
    name: "Bônus Demográfico",
    data: [0.47,0.47,0.45,0.72,0.50,0.44,1.50,0.73,0.99,0.41,0.62,0.83,1.12,0.51,0.42,0.47,0.30,0.65,0.69,0.52,0.92,0.81,0.53,0.60,0.59,0.87,0.83],
  },
]