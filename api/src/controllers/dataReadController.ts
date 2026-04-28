import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Lista todos os dados de Risco de Crédito
export async function getCreditRisk(req: Request, res: Response) {
  try {
    const data = await prisma.riscoCredito.findMany();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch credit risk data' });
  }
}

// Lista todos os dados de Inclusão e Expansão
export async function getInclusionExpansion(req: Request, res: Response) {
  try {
    const data = await prisma.inclusaoExpansao.findMany();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch inclusion expansion data' });
  }
}

// Lista todos os dados da Estrutura PIX
export async function getPixStructure(req: Request, res: Response) {
  try {
    const data = await prisma.estruturaSrcPix.findMany();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch PIX structure data' });
  }
}

// Lista todos os dados da Estrutura IBGE
export async function getIBGEStructure(req: Request, res: Response) {
  try {
    const data = await prisma.estruturaIBGE.findMany();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch IBGE structure data' });
  }
}

// Busca todos os indicadores de uma vez (útil para o dashboard inicial)
export async function getAllIndicators(req: Request, res: Response) {
  try {
    const [risco, inclusao, pix, ibge] = await Promise.all([
      prisma.riscoCredito.findMany(),
      prisma.inclusaoExpansao.findMany(),
      prisma.estruturaSrcPix.findMany(),
      prisma.estruturaIBGE.findMany()
    ]);

    return res.json({
      creditRisk: risco,
      inclusionExpansion: inclusao,
      pixStructure: pix,
      ibgeStructure: ibge
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch all indicators' });
  }
}