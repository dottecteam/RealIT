import {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {prisma} from '../lib/prisma'

export async function register(request: Request, response: Response){
    const { name, email, password } = request.body

    if(!name || !email || !password){
        return response.status(400).json({error: 'Todos os campos são obrigatórios'})
    }

    const existing = await prisma.user.findUnique({where: {email}})
    if(existing){
        return response.status(409).json({error: 'Email já cadastrado'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {name, email, password: hashedPassword}
    })

    return response.status(201).json({message: 'Usuario criado com sucesso', user: {id: user.id, name: user.name, email: user.email}})
}



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


export async function userData(request: Request, response: Response){
    //Pega o id do usuario enviado pelo middleware e retorna os dados
    const userId = (request as any).userId

    const user = await prisma.user.findUnique({where: {id: userId}, select: {id: true, name: true, email: true}})

    return response.json({user})
}


export async function listarUsuarios(request: Request, response: Response) {
  try {
    const dados = await prisma.user.findMany()
    return response.json(dados)
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar usuarios' })
  }
}
