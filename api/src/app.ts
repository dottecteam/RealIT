import express from 'express'
import 'dotenv/config'
import { prisma } from './lib/prisma'
 
//Rotas 
import routerUser from './routes/auth'
import routerDados from './routes/data'
 
export const app = express()
 
app.use(express.json())
app.use('/auth', routerUser)
app.use('/data', routerDados)
 
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// // ---- ROTAS DE EXEMPLO ----
// // Utilizei para testar a instância do Prisma


// // POST /users
// app.post('/users', async (req, res) => {
//   const { email, name } = req.body

//   const user = await prisma.user.create({
//     data: { email, name }
//   })

//   res.status(201).json(user)
// })

// // GET /users
// app.get('/users', async (_req, res) => {
//   const users = await prisma.user.findMany()

//   res.json(users)
// })