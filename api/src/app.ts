import express from 'express'
import { prisma } from './lib/prisma'

export const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})


// ---- ROTAS DE EXEMPLO ----
// Utilizei para testar a instância do Prisma


// POST /users
app.post('/users', async (req, res) => {
  const { email, name } = req.body

  const user = await prisma.user.create({
    data: { email, name }
  })

  res.status(201).json(user)
})

// GET /users
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany()

  res.json(users)
})