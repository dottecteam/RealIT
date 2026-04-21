import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(8),
  status: z.enum(['ADMIN', 'ACTIVE', 'INACTIVE']).optional()
});

export const updateUserSchema = createUserSchema.partial();