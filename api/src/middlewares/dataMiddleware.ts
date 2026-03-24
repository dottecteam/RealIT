import { Request, Response, NextFunction } from 'express'

function checarCampos(dados: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const faltando = dados.filter(dados => !request.body[dados])

    if (faltando.length > 0) {
      return response.status(400).json({
        error: 'Campos obrigatórios faltando',
        campos: faltando
      })
    }

    next()
  }
}

export default checarCampos