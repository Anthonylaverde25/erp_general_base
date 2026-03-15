import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { CreatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';

const quickProspectSchema = z.object({
    name: z.string().min(1, 'El nombre completo o razón social es requerido'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
});

type QuickProspectForm = z.infer<typeof quickProspectSchema>;

interface QuickProspectModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newPartner: PartnerEntity) => void;
    initialName?: string;
}

export function QuickProspectModal({ open, onClose, onSuccess, initialName = '' }: QuickProspectModalProps) {
    const { handleCreatePartner, isLoading } = useCreatePartner();
    const activeCompany = useActiveCompany();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<QuickProspectForm>({
        resolver: zodResolver(quickProspectSchema),
        defaultValues: { name: initialName, email: '', phone: '' }
    });

    React.useEffect(() => {
        if (open) {
            reset({ name: initialName, email: '', phone: '' });
        }
    }, [open, initialName, reset]);

    const onSubmit = async (values: QuickProspectForm) => {
        if (!activeCompany) return;

        // Construct minimal payload
        const payload = {
            company_id: activeCompany.id,
            name: values.name,
            role: 'prospect',
            type: 'company', // default to company, could be person but required
            credit_available: false,
            grouped_billing: false,
            contact: (values.email || values.phone) ? [{ 
                email: values.email || '', 
                phone: values.phone || '',
                default: true
            }] : [],
        } as unknown as CreatePartnerDTO;

        try {
            const result: any = await handleCreatePartner(payload);
            if (result && result.partner) {
                reset(); // clear form
                onSuccess(result.partner);
            } else if (result && result.id) {
                // Fallback in case the response is just the partner entity directly
                reset(); // clear form
                onSuccess(result as PartnerEntity);
            }
        } catch (error) {
            console.error('Error creating prospect', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">Crear Prospecto Rápido</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Añade rápidamente los datos básicos para cotizarle a un nuevo cliente potencial. Luego podrás convertirlo en cliente.
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} mt={1}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre Completo / Razón Social *"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Correo Electrónico (Opcional)"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Teléfono (Opcional)"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={isLoading} color="inherit">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="secondary" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Crear y Usar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
