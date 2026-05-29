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

export async function updateSelf(request: Request, response: Response) {
    const sessionId = (request as any).sessionId;
    const userId    = (request as any).userId as number;
    const { name, email, currentPassword, newPassword } = request.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return response.status(404).json({ error: 'Usuário não encontrado' });

        // Valida senha atual se quiser trocar a senha
        if (newPassword) {
            if (!currentPassword) {
                return response.status(400).json({ error: 'Informe a senha atual para alterá-la' });
            }
            const senhaCorreta = await bcrypt.compare(currentPassword, user.password);
            if (!senhaCorreta) {
                return response.status(401).json({ error: 'Senha atual incorreta' });
            }
        }

        // Verifica duplicidade de e-mail se mudou
        if (email && email !== user.email) {
            const existe = await prisma.user.findUnique({ where: { email } });
            if (existe) return response.status(409).json({ error: 'Este e-mail já está em uso' });
        }

        const updateData: any = {};
        if (name)        updateData.name     = name;
        if (email)       updateData.email    = email;
        if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

        if (Object.keys(updateData).length === 0) {
            return response.status(400).json({ error: 'Nenhum dado para atualizar' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, status: true, updatedAt: true }
        });

        await logOperation(sessionId, 'UPDATE_USER');

        return response.json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno ao atualizar perfil' });
    }
}

export async function update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, password, status, role } = request.body;
    const sessionId = (request as any).sessionId;

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!currentUser) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        const updateData: any = {};
        if (name)     updateData.name   = name;
        if (email)    updateData.email  = email;
        if (status)   updateData.status = status;
        if (role)     updateData.role   = role;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        if (Object.keys(updateData).length === 0) {
            return response.status(400).json({ error: 'Nenhum dado para atualizar' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData
        });

        const statusChangedToInactive = status === 'INACTIVE' && currentUser.status !== 'INACTIVE';
        const roleChanged = role && role !== currentUser.role;

        if (statusChangedToInactive || roleChanged) {
            await prisma.session.updateMany({
                where: { userId: updatedUser.id, isActive: true },
                data: { isActive: false, logoutAt: new Date() }
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
        return response.status(500).json({ error: 'Erro ao ativar usuário' });
    }
}

export async function turnAdmin(request: Request, response: Response) {
    const { id } = request.params;
    const sessionId = (request as any).sessionId;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: 'ADMIN' }
        });

        await prisma.session.updateMany({
            where: { userId: updatedUser.id, isActive: true },
            data: { isActive: false, logoutAt: new Date() }
        });

        await logOperation(sessionId, 'UPDATE_USER');
        return response.json({ message: 'Cargo atualizado com sucesso', role: updatedUser.role });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao atualizar cargo' });
    }
}

export async function turnUser(request: Request, response: Response) {
    const { id } = request.params;
    const sessionId = (request as any).sessionId;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: 'USER' }
        });

        await prisma.session.updateMany({
            where: { userId: updatedUser.id, isActive: true },
            data: { isActive: false, logoutAt: new Date() }
        });

        await logOperation(sessionId, 'UPDATE_USER');
        return response.json({ message: 'Cargo atualizado com sucesso', role: updatedUser.role });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao atualizar cargo' });
    }
}

export async function turnDev(request: Request, response: Response) {
    const { id } = request.params;
    const sessionId = (request as any).sessionId;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: 'DEV' }
        });

        await prisma.session.updateMany({
            where: { userId: updatedUser.id, isActive: true },
            data: { isActive: false, logoutAt: new Date() }
        });

        await logOperation(sessionId, 'UPDATE_USER');
        return response.json({ message: 'Promovido a Desenvolvedor', role: updatedUser.role });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao atualizar cargo' });
    }
}