import express from 'express'

export const app = express()

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'API está funcionando!' })
})