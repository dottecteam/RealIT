import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { logOperation } from '../utils/logger'

export async function register(request: Request, response: Response) {
    const { name, email, password, status } = request.body
    const sessionId = (request as any).sessionId

    try {
        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) return response.status(400).json({ error: 'Usuário já existe' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status: status || 'ACTIVE'
            }
        })


        if (sessionId) await logOperation(sessionId, 'CREATE_USER')

        return response.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, email: user.email } })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao cadastrar usuário' })
    }
}

export async function listAll(request: Request, response: Response) {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, status: true, createdAt: true }
        })
        return response.json(users)
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao listar usuários' })
    }
}

export async function getProfile(request: Request, response: Response) {
    const userId = (request as any).userId

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, status: true }
        })
        return response.json(user)
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar perfil' })
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

export async function update(request: Request, response: Response) {
    const { id } = request.params
    const data = request.body
    const sessionId = (request as any).sessionId

    if (Object.keys(data).length === 0) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' })
    }

    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: data
        })

        await logOperation(sessionId, 'UPDATE_USER')

        if (data.status === 'INACTIVE') {
            await prisma.session.updateMany({
                where: { userId: user.id, isActive: true },
                data: { isActive: false, logoutAt: new Date() }
            })
        }

        return response.json({
            message: 'Usuário atualizado',
            user: { id: user.id, status: user.status }
        })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
}

export async function softDelete(request: Request, response: Response) {
    const { id } = request.params
    const sessionId = (request as any).sessionId

    try {
        await prisma.user.update({
            where: { id: Number(id) },
            data: { status: 'INACTIVE' }
        })


        await prisma.session.updateMany({
            where: { userId: Number(id) },
            data: { isActive: false, logoutAt: new Date() }
        })

        await logOperation(sessionId, 'UPDATE_USER')
        return response.json({ message: 'Usuário inativado com sucesso' })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao inativar usuário' })
    }
}

export async function hardDelete(request: Request, response: Response) {
    const { id } = request.params

    try {
        await prisma.log.deleteMany({ where: { session: { userId: Number(id) } } })
        await prisma.session.deleteMany({ where: { userId: Number(id) } })
        await prisma.user.delete({ where: { id: Number(id) } })

        return response.json({ message: 'Usuário removido permanentemente' })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao excluir usuário' })
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
                status: true
            }
        });

        return response.json(users);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar usuários pelo nome' });
    }
}