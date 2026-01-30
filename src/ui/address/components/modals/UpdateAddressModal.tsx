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
import * as z from 'zod';
import {
    addressSchema,
    AddressFormData,
    defaultUpdateAddressValues
} from '@/schemas/address/address.schema';
import AddressForm from '../forms/AddressForm';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { Address } from '@/types/company.types';
import { useShowAddress } from '@/features/addresses/hooks/useShowAddress';
import useUpdateAddress from '@/features/addresses/hooks/useUpdateAddress';
import { AddressEntity } from '@/domain/entities/addresses/Address';
import { useEffect } from 'react';

interface UpdateAddressModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: AddressFormData) => void;
    addressId: Address['id']
}



export default function UpdateAddressModal({ open, onClose, onSubmit, addressId }: UpdateAddressModalProps) {
    const { data: address, isLoading } = useShowAddress(addressId);
    const { handleUpdateAddress, isLoading: isUpdating } = useUpdateAddress();

    const methods = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: defaultUpdateAddressValues(address),
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (address) {
            reset(defaultUpdateAddressValues(address));
        }
    }, [address, reset]);

    const handleFormSubmit = async (data: AddressFormData) => {
        if (!addressId) return;

        try {
            // Convert to AddressEntity structure if needed, or straight to Partial<AddressEntity>
            // Ideally we'd map fields, but since form matches entity mostly:
            const updateData: Partial<AddressEntity> = {
                street: data.street,
                city: data.city,
                state: data.state,
                postal_code: data.postal_code,
                country: data.country,
                default_address: data.default,
                street_2: null // Form doesn't have street_2 yet, setting to null or undefined is safe if entity allows optional
            };

            await handleUpdateAddress(addressId, updateData);
            onSubmit(data); // Optional: keep if parent needs it, but hook handles invalidation
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
                        Actualizar Dirección
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Modifique los datos de la dirección seleccionada
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
                        <form id="update-address-form" onSubmit={handleSubmit(handleFormSubmit)}>
                            <AddressForm />
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
                    form="update-address-form"
                    variant="contained"
                    color="primary"
                >
                    Actualizar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
