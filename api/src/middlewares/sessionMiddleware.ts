import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const session = await prisma.session.findFirst({
      where: { 
        token,
        isActive: true,
        logoutAt: null 
      },
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({ error: 'Sessão encerrada ou inexistente' });
    }

    if (session.user.status === 'INACTIVE') {
      return res.status(403).json({ error: 'Usuário desativado' });
    }

    (req as any).sessionId = session.id;
    (req as any).userId = decoded.userId;
    
    next();
  } catch (error) {
    await prisma.session.updateMany({
      where: { token, isActive: true },
      data: { isActive: false }
    });

    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}