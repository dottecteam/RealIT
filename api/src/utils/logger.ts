import { prisma } from '../lib/prisma';

const operationMessages: Record<string, string> = {
  'USER_LOGIN': 'Usuário realizou login no sistema.',
  'USER_LOGOUT': 'Usuário encerrou a sessão.',
  'CREATE_USER': 'Um novo usuário foi cadastrado.',
  'UPDATE_USER': 'Dados de usuário foram atualizados.'
};

export async function logOperation(sessionId: string, operationCode: string) {
  const message = operationMessages[operationCode] || `Operação realizada: ${operationCode}`;
  
  await prisma.log.create({
    data: {
      sessionId,
      operation: message
    }
  });
}