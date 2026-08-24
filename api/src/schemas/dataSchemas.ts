import { z } from 'zod';
import { baseFiltroQuerySchema } from './filtroSchemas';

export const creditRiskSchema = z.object({
  mesAno: z.string(),
  uf: z.string(),
  regiao: z.string(),
  inadiplenciaReal: z.number(),
  fragilidadeRenda: z.number(),
  agingDivida: z.number(),
  vulnerabilidadeSocial: z.number(),
});

export const inclusionExpansionSchema = z.object({
  mesAno: z.string(),
  uf: z.string(),
  regiao: z.string(),
  maturidadePix: z.number(),
  crescimentoPopulacional: z.number(),
  populacaoAbsoluta: z.number(),
  bonusDemografico: z.number(),
});

export const pixStructureSchema = z.object({
  ano_mes: z.string(),
  regiao: z.string(),
  uf: z.string(),
  tipo: z.string(),
  classe: z.string(),
  metrica: z.string(),
  origem: z.string(),
  valor: z.number(),
});

export const ibgeStructureSchema = z.object({
  ano: z.string(),
  regiao: z.string(),
  uf: z.string(),
  taxa_escolarizacao: z.number(),
  populacao_residente: z.number(),
  taxa_crescimento: z.number(),
  variacao_populacao: z.number(),
});

export const masterDataSchema = z.object({
  body: z.object({
    creditRisk: z.array(creditRiskSchema),
    inclusionExpansion: z.array(inclusionExpansionSchema),
    pixStructure: z.array(pixStructureSchema),
    ibgeStructure: z.array(ibgeStructureSchema),
  }),
});

export const creditRiskArray = z.array(creditRiskSchema);
export const inclusionExpansionArray = z.array(inclusionExpansionSchema);
export const pixStructureArray = z.array(pixStructureSchema);
export const ibgeStructureArray = z.array(ibgeStructureSchema);

export const summaryQuerySchema = z.object({
  query: baseFiltroQuerySchema
    .extend({})
    .refine(data => data.uf || data.regiao, {
      message: "Você deve fornecer ao menos a 'uf' ou a 'regiao' para o resumo.",
      path: ["uf"]
    })
});

export const calculateScoresQuerySchema = z.object({
  query: baseFiltroQuerySchema.extend({})
});

export const evolutionQuerySchema = z.object({
  query: baseFiltroQuerySchema.extend({
    limit: z.string().regex(/^\d+$/).optional().default("12"),
  })
});

export const rankingQuerySchema = z.object({
  query: baseFiltroQuerySchema.extend({
    orderBy: z.enum(['RC', 'IE']).optional().default('RC'),
  })
});

export const filtroQuerySchema = z.object({
  query: baseFiltroQuerySchema
});