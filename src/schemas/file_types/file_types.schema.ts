import { z } from 'zod';

export const createFileTypeSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre debe tener máximo 100 caracteres'),
    description: z.string().max(255, 'La descripción debe tener máximo 255 caracteres').optional(),
    is_active: z.boolean().default(true)
});

export const updateFileTypeSchema = createFileTypeSchema;

export type CreateFileTypeFormType = z.infer<typeof createFileTypeSchema>;
export type UpdateFileTypeFormType = z.infer<typeof updateFileTypeSchema>;
