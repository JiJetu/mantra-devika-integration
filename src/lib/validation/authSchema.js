import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email' })
    .trim(),

  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters' }),

  remember: z.boolean().optional().default(false),
});

