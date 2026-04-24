import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { logOperation } from '../utils/logger'

export async function register(request: Request, response: Response) {
    const { name, email, password, status, role } = request.body
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
                status: status || 'ACTIVE',
                role: role || 'USER'
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
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
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
            select: { id: true, name: true, email: true, role: true, status: true }
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

export async function update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, password, status, role } = request.body;
    const sessionId = (request as any).sessionId;

    try {
        // Busca o usuário atual para comparar mudanças sensíveis
        const currentUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!currentUser) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (status) updateData.status = status;
        if (role) updateData.role = role;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return response.status(400).json({ error: 'Nenhum dado para atualizar' });
        }

        // Executa a atualização
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData
        });

        // Lógica de Invalidação de Sessão
        // Se o status mudou para INACTIVE ou se a ROLE mudou, derrubamos as sessões
        const statusChangedToInactive = status === 'INACTIVE' && currentUser.status !== 'INACTIVE';
        const roleChanged = role && role !== currentUser.role;

        if (statusChangedToInactive || roleChanged) {
            await prisma.session.updateMany({
                where: {
                    userId: updatedUser.id,
                    isActive: true
                },
                data: {
                    isActive: false,
                    logoutAt: new Date()
                }
            });
        }

        await logOperation(sessionId, 'UPDATE_USER');

        return response.json({
            message: 'Usuário atualizado com sucesso',
            user: {
                id: updatedUser.id,
                status: updatedUser.status,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno ao atualizar usuário' });
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
            where: { userId: Number(id), isActive: true },
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