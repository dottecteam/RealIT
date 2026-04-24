import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, "O nome não pode ser nulo ou vazio")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome não deve conter caracteres especiais ou números"),

    email: z.email("E-mail inválido (deve conter @ e conteúdo antes e depois)")
      .min(1, "O e-mail é obrigatório"),

    password: z.string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(72, "A senha deve ter no máximo 72 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
      
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),

    role: z.enum(['ADMIN', 'DEV', 'USER']).optional()
  })
});

const idParam = z.object({
  id: z.string().regex(/^\d+$/, "O ID deve ser um número")
});

export const getByIdSchema = z.object({
  params: idParam
});

export const updateUserSchema = z.object({
  params: idParam,
  body: createUserSchema.shape.body.partial()
});

export const searchUserSchema = z.object({
  query: z.object({
    name: z.string()
      .min(1, "O nome para busca não pode estar vazio")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome não deve conter caracteres especiais ou números")
  })
});

export const getByEmailSchema = z.object({
  params: z.object({
    email: z.email("Formato de e-mail inválido")
  })
});
