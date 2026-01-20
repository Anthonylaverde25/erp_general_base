import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    code: z.string().min(1, 'El código es requerido').max(50, 'El código no puede exceder 50 caracteres'),
    description: z.string().min(1, 'La descripción es requerida'),
    status: z.boolean().default(true)
});

export type CreateRoleFormType = z.infer<typeof createRoleSchema>;

export const defaultCreateRoleValues: CreateRoleFormType = {
    name: '',
    code: '',
    description: '',
    status: true
};

export const updateRoleSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'El nombre es requerido'),
    code: z.string().min(1, 'El código es requerido').max(50, 'El código no puede exceder 50 caracteres'),
    description: z.string().min(1, 'La descripción es requerida'),
    status: z.boolean()
});

export type UpdateRoleFormType = z.infer<typeof updateRoleSchema>;

export const defaultUpdateRoleValues = (role?: any): UpdateRoleFormType => ({
    id: role?.id || 0,
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    status: role?.status !== undefined ? role.status : true
});
