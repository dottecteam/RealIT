import jwt from 'jsonwebtoken'
import {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import {prisma} from '../lib/prisma'

export async function login(request: Request, response: Response){
    const {email, password} = request.body

    if(!email || !password){
        return response.status(400).json({error: 'Todos os campos são obrigratórios'})
    }

    const user = await prisma.user.findUnique({where: {email}})
    if(!user){
        return response.status(401).json({error: 'Usuário não encontrado'})
    }

    //Criptografa a senha, compara com a senha cadastrada e valida se ela existe
    const verifyPassword = await bcrypt.compare(password, user.password)
    if(!verifyPassword){
        return response.status(401).json({error: 'Usuário não encontrado'})
    }

    //Gera um token com base nas informacoes do usuario e poe a validade de um dia
    const token = jwt.sign(
        {userId: user.id, email: user.email},
        process.env.JWT_SECRET as string,
        {expiresIn: '1d'}
    )

    return response.json({message: 'Login realizado com sucesso', token, user: {id: user.id, name: user.name, email: user.email}})
}