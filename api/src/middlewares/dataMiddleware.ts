import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export function dataMiddleware(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization

    //Valida se tem algum usuario logado
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return response.status(401).json({error: 'Token não fornecido'})
    }
    
    //Transforma o token num array e pega o valor do token
    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
        (request as any).userId = decoded.userId //Salva o id do usuario logado na request
        next()
    }
    catch{
        return response.status(401).json({error: 'Token inválido ou expirado'})
    }
}