import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function adminOnly(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não identificado.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!['ADMIN', 'DEV'].includes(user?.status)) {
    return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
  }

  next();
}

export async function devOnly(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.status !== 'DEV') {
    return res.status(403).json({ error: 'Acesso restrito. Somente desenvolvedores podem acessar esta ferramenta.' });
  }

  next();
}