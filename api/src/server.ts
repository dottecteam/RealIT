import { app } from './app'

const PORT = process.env.PORT ?? 3000

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`ERRO CRÍTICO: A variável de ambiente ${envVar} não está definida.`);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log(`O servidor está rodando em http://localhost:${PORT}`)
})