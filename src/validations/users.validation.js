import { z } from 'zod';

export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

export const updateUserSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    password: z.string().min(8).max(100).optional(),
    role: z.enum(['user', 'admin']).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
});
