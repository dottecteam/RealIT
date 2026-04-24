import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function listAll(request: Request, response: Response) {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
        });
        return response.json(users);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao listar usuários' });
    }
}

export async function getProfile(request: Request, response: Response) {
    const userId = (request as any).userId;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, status: true }
        })
        return response.json(user);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar perfil' });
    }
}

export async function getById(request: Request, response: Response) {
    const { id } = request.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        return response.json(user);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}

export async function getByEmail(request: Request, response: Response) {
    const { email } = request.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        return response.json(user);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar usuário por e-mail' });
    }
}

export async function getByName(request: Request, response: Response) {
    const { name } = request.query;

    if (!name) {
        return response.status(400).json({ error: 'O parâmetro nome é obrigatório' });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: String(name),
                    // mode: 'insensitive' // Descomente se usar PostgreSQL para busca independente de maiúsculas
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                role: true
            }
        });

        return response.json(users);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar usuários pelo nome' });
    }
}

export async function getByRole(request: Request, response: Response) {
    const { role } = request.params;
    try {
        const users = await prisma.user.findMany({
            where: { role: role},
            select: { id: true, name: true, email: true, role: true, status: true }
        });
        return response.json(users);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao filtrar por cargo' });
    }
}

export async function getUserLogs(request: Request, response: Response) {
    const { id } = request.params;
    try {
        const logs = await prisma.log.findMany({
            where: { session: { userId: Number(id) } },
            include: { session: { select: { deviceInfo: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return response.json(logs);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar logs do usuário' });
    }
}

export async function getUserSessions(request: Request, response: Response) {
    const { id } = request.params;
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: Number(id) },
            orderBy: { createdAt: 'desc' }
        });
        return response.json(sessions);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar sessões do usuário' });
    }
}