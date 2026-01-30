import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/schemas/contact/contact.schema';
import ContactForm from '../forms/ContactForm';
import useCreateContact from '@/features/contacts/hooks/useCreateContact';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useEffect } from 'react';

interface CreateContactModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => void;
}

export default function CreateContactModal({ open, onClose, onSubmit }: CreateContactModalProps) {
    const activeCompany = useActiveCompany();
    const { handleCreateContact, isLoading, isSuccess } = useCreateContact();

    const methods = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            email: '',
            phone: '',
            default: false
        }
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (isSuccess) {
            reset();
            onClose();
        }
    }, [isSuccess, reset, onClose]);

    const handleFormSubmit = async (data: ContactFormData) => {
        if (!activeCompany?.id) return;

        handleCreateContact(activeCompany.id, {
            email: data.email,
            phone: data.phone,
            default: data.default
        });
        onSubmit(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6" component="div" fontWeight={600}>
                        Agregar Nuevo Contacto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ingrese los datos del nuevo contacto
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        mt: 0.5
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mt: 1 }}>
                    <FormProvider {...methods}>
                        <form id="create-contact-form" onSubmit={handleSubmit(handleFormSubmit)}>
                            <ContactForm />
                        </form>
                    </FormProvider>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="create-contact-form"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
