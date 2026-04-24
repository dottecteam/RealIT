import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { logOperation } from '../utils/logger';

export async function register(request: Request, response: Response) {
    const { name, email, password, status, role } = request.body;
    const sessionId = (request as any).sessionId;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) return response.status(400).json({ error: 'Usuário já existe' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status: status || 'ACTIVE',
                role: role || 'USER'
            }
        });


        if (sessionId) await logOperation(sessionId, 'CREATE_USER');

        return response.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao cadastrar usuário' });
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
                name: updatedUser.name,
                email: updatedUser.email,
                status: updatedUser.status,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno ao atualizar usuário' });
    }
}

export async function inactivate(request: Request, response: Response) {
    const { id } = request.params;
    const sessionId = (request as any).sessionId;

    try {
        await prisma.user.update({
            where: { id: Number(id) },
            data: { status: 'INACTIVE' }
        });


        await prisma.session.updateMany({
            where: { userId: Number(id), isActive: true },
            data: { isActive: false, logoutAt: new Date() }
        });

        await logOperation(sessionId, 'UPDATE_USER');
        return response.json({ message: 'Usuário inativado com sucesso' });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao inativar usuário' });
    }
}

export async function activate(request: Request, response: Response) {
    const { id } = request.params;
    const sessionId = (request as any).sessionId;

    try {
        await prisma.user.update({
            where: { id: Number(id) },
            data: { status: 'ACTIVE' }
        });


        await prisma.session.updateMany({
            where: { userId: Number(id), isActive: true },
            data: { isActive: false, logoutAt: new Date() }
        });

        await logOperation(sessionId, 'UPDATE_USER');
        return response.json({ message: 'Usuário ativado com sucesso' });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao inativar usuário' });
    }
}