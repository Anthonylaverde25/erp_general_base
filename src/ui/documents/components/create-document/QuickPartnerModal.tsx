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
    Stack,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { CreatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import { Plus } from 'lucide-react';

const quickPartnerSchema = z.object({
    name: z.string().min(1, 'El nombre completo o razón social es requerido'),
    cif: z.string().optional().or(z.literal('')),
    type: z.enum(['company', 'person']),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
});

type QuickPartnerForm = z.infer<typeof quickPartnerSchema>;

interface QuickPartnerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newPartner: PartnerEntity) => void;
    initialName?: string;
    partnerType?: 'customer' | 'supplier' | 'vendor';
}

export function QuickPartnerModal({
    open,
    onClose,
    onSuccess,
    initialName = '',
    partnerType = 'customer'
}: QuickPartnerModalProps) {
    const { handleCreatePartner, isLoading } = useCreatePartner();
    const activeCompany = useActiveCompany();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<QuickPartnerForm>({
        resolver: zodResolver(quickPartnerSchema),
        defaultValues: { name: initialName, cif: '', type: 'company', email: '', phone: '' }
    });

    React.useEffect(() => {
        if (open) {
            reset({ name: initialName, cif: '', type: 'company', email: '', phone: '' });
        }
    }, [open, initialName, reset]);

    const onSubmit = async (values: QuickPartnerForm) => {
        if (!activeCompany) return;

        // Construct minimal payload for creating a partner
        const payload = {
            company_id: activeCompany.id,
            name: values.name,
            cif: values.cif || '',
            role: (partnerType === 'supplier' || partnerType === 'vendor') ? 'supplier' : 'client',
            type: values.type,
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
                reset();
                onSuccess(result.partner);
            } else if (result && result.id) {
                // Fallback in case response is just the partner entity directly
                reset();
                onSuccess(result as PartnerEntity);
            }
        } catch (error) {
            console.error('Error creating partner', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isSupplier = partnerType === 'supplier' || partnerType === 'vendor';
    const title = isSupplier ? 'Crear Proveedor Rápido' : 'Crear Cliente Rápido';
    const subtitle = isSupplier 
        ? 'Añade rápidamente los datos básicos del nuevo proveedor para seleccionarlo en el documento.' 
        : 'Añade rápidamente los datos básicos del nuevo cliente para seleccionarlo en el documento.';

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} mt={1}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Tipo de Persona</FormLabel>
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="company" control={<Radio color="secondary" />} label="Empresa / Razón Social" />
                                        <FormControlLabel value="person" control={<Radio color="secondary" />} label="Persona Física" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />

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
                                    variant="filled"
                                />
                            )}
                        />

                        <Controller
                            name="cif"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Identificación Fiscal (CIF / NIF / RUT)"
                                    error={!!errors.cif}
                                    helperText={errors.cif?.message}
                                    fullWidth
                                    variant="filled"
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
                                    variant="filled"
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
                                    variant="filled"
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={isLoading} color="inherit">
                        Cancelar
                    </Button>
                    {/* <Button type="submit" variant="contained" color="secondary" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Crear y Usar'}
                    </Button> */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<Plus size={18} />}
                        sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
                    >
                        {isLoading ? 'Guardando...' : 'Crear y Usar'}

                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
