import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Ingestão em Massa (Bulk Ingestion)
export async function importMonthlyData(req: Request, res: Response) {
  const { creditRisk, inclusionExpansion, pixStructure, ibgeStructure } = req.body;

  try {
    const result = await prisma.$transaction([
      prisma.riscoCredito.createMany({ data: creditRisk }),
      prisma.inclusaoExpansao.createMany({ data: inclusionExpansion }),
      prisma.estruturaSrcPix.createMany({ data: pixStructure }),
      prisma.estruturaIBGE.createMany({ data: ibgeStructure }),
    ]);

    return res.status(201).json({
      message: 'Mensal data imported successfully',
      recordsCreated: {
        creditRisk: result[0].count,
        inclusionExpansion: result[1].count,
        pixStructure: result[2].count,
        ibgeStructure: result[3].count,
      },
    });
  } catch (error) {
    console.error('Bulk Import Error:', error);
    return res.status(500).json({ error: 'Failed to import monthly data' });
  }
}

// Ingestões Separadas
export async function createCreditRisk(req: Request, res: Response) {
  try {
    const result = await prisma.riscoCredito.createMany({ data: req.body });
    return res.status(201).json({ count: result.count });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create credit risk data' });
  }
}

export async function createInclusionExpansion(req: Request, res: Response) {
  try {
    const result = await prisma.inclusaoExpansao.createMany({ data: req.body });
    return res.status(201).json({ count: result.count });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create inclusion expansion data' });
  }
}

export async function createPixStructure(req: Request, res: Response) {
  try {
    const result = await prisma.estruturaSrcPix.createMany({ data: req.body });
    return res.status(201).json({ count: result.count });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create PIX structure data' });
  }
}

export async function createIBGEStructure(req: Request, res: Response) {
  try {
    const result = await prisma.estruturaIBGE.createMany({ data: req.body });
    return res.status(201).json({ count: result.count });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create IBGE structure data' });
  }
}