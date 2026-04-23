import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export const validateData = (schema: ZodType<any>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const resultado = await schema.safeParseAsync({
      body: request.body,
      query: request.query,
      params: request.params,
    })

    if (!resultado.success) {
      return response.status(400).json({
        error: 'Campos obrigatórios faltando ou com formato inválido',
        detalhes: resultado.error.issues.map(issue => ({
          campo: issue.path.join('.'),
          mensagem: issue.message
        }))
      })
    }

    next()
  }
}