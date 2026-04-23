import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { logOperation } from '../utils/logger'

export async function login(request: Request, response: Response) {
    const { email, password } = request.body
    const deviceInfo = request.headers['user-agent'] || 'Unknown Device'

    if (!email || !password) {
        return response.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    
    // Verificação de usuário e status
    if (!user || user.status === 'INACTIVE') {
        return response.status(401).json({ error: 'Credenciais inválidas' })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)
    if (!verifyPassword) {
        return response.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Gera o token JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    )

    // Calcula a expiração (1 dia a partir de agora)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1)

    try {
        // Cria a sessão no banco de dados
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                token,
                deviceInfo,
                expiresAt,
                isActive: true
            }
        })

        // Registra o log de login
        await logOperation(session.id, 'USER_LOGIN')

        return response.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao criar sessão de acesso' })
    }
}

export async function logout(request: Request, response: Response) {
    // O sessionId vem do middleware de sessão
    const sessionId = (request as any).sessionId

    if (!sessionId) {
        return response.status(400).json({ error: 'Sessão não identificada' })
    }

    try {
        // Registra o log de logout antes de fechar a sessão (para manter o vínculo)
        await logOperation(sessionId, 'USER_LOGOUT')

        // Invalida a sessão no banco
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                isActive: false,
                logoutAt: new Date()
            }
        })

        return response.json({ message: 'Logout realizado com sucesso' })
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao encerrar sessão' })
    }
}