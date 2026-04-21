import {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
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
