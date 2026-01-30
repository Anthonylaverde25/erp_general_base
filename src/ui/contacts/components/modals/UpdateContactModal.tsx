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
import {
    contactSchema,
    ContactFormData,
    defaultUpdateContactValues
} from '@/schemas/contact/contact.schema';
import ContactForm from '../forms/ContactForm';
import { Contact } from '@/types/company.types';
import { useShowContact } from '@/features/contacts/hooks/useShowContact';
import useUpdateContact from '@/features/contacts/hooks/useUpdateContact';
import { ContactEntity } from '@/domain/entities/contacts/Contact';
import { useEffect } from 'react';

interface UpdateContactModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => void;
    contactId: Contact['id']
}

export default function UpdateContactModal({ open, onClose, onSubmit, contactId }: UpdateContactModalProps) {
    const { data: contact, isLoading } = useShowContact(contactId);
    const { handleUpdateContact, isLoading: isUpdating } = useUpdateContact();

    const methods = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: defaultUpdateContactValues(contact),
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (contact) {
            reset(defaultUpdateContactValues(contact));
        }
    }, [contact, reset]);

    const handleFormSubmit = async (data: ContactFormData) => {
        if (!contactId) return;

        try {
            const updateData: Partial<ContactEntity> = {
                email: data.email,
                phone: data.phone,
                default_contact: data.default,
            };

            await handleUpdateContact(contactId, updateData);
            onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
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
                        Actualizar Contacto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Modifique los datos del contacto seleccionado
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
                        <form id="update-contact-form" onSubmit={handleSubmit(handleFormSubmit)}>
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
                    form="update-contact-form"
                    variant="contained"
                    color="primary"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
