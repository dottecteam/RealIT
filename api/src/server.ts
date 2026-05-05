import { app } from './app'

const PORT = process.env.PORT ?? 3000

// Lista de variáveis obrigatórias para o funcionamento mínimo
const requiredEnvVars = [
  'JWT_SECRET', 
  'DATABASE_URL', 
  'GLOBAL_LIMIT_MAX', 
  'AUTH_LIMIT_MAX'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`AVISO: A variável ${envVar} não foi definida. Usando valores padrão.`);
  }
});

app.listen(PORT, () => {
  console.log(`[Real IT API] Servidor ativo em: http://localhost:${PORT}`)
  console.log(`[Ambiente]: ${process.env.NODE_ENV || 'development'}`)
})