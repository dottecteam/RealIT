import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export async function resetDatabase(req: Request, res: Response) {
    try {
        // A ordem de exclusão importa por conta das chaves estrangeiras
        await prisma.log.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        return res.json({ message: 'Banco de dados limpo com sucesso.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao limpar banco.' });
    }
}

export async function seedAdmin(req: Request, res: Response) {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const user = await prisma.user.upsert({
            where: { email: 'admin@teste.com' },
            update: {},
            create: {
                email: 'admin@teste.com',
                name: 'Administrador de Teste',
                password: hashedPassword,
                status: 'ACTIVE',
                role: 'ADMIN'
            }
        });

        return res.status(201).json({ message: 'Usuário admin criado.', user: { email: user.email } });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar seed.' });
    }
}

export async function seedDev(req: Request, res: Response) {
    try {
        const hashedPassword = await bcrypt.hash('dev123', 10);
        
        const user = await prisma.user.upsert({
            where: { email: 'DEV@teste.com' },
            update: {},
            create: {
                email: 'dev@teste.com',
                name: 'Desenvolvedor de Teste',
                password: hashedPassword,
                status: 'ACTIVE',
                role: 'DEV'
            }
        });

        return res.status(201).json({ message: 'Usuário admin criado.', user: { email: user.email } });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar seed.' });
    }
}





