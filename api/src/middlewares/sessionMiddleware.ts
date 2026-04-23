import {Request, Response, NextFunction} from 'express'
import {prisma} from '../lib/prisma'

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  const session = await prisma.session.findFirst({
    where: { 
      token,
      isActive: true,
      logoutAt: null 
    },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Sessão inválida, expirada ou encerrada' });
  }

  if (session.user.status === 'INACTIVE') {
    return res.status(403).json({ error: 'Usuário desativado' });
  }

  // Injeta na requisição para uso nos controllers
  (req as any).sessionId = session.id;
  (req as any).userId = session.userId;
  
  next();
}