import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Chip,
    Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useChangeDefaultAddress } from '@/features/companies/hooks/useChangeDefaultAddress';
import { Address } from '@/types/company.types';
import { LocationOn, Map as MapIcon } from '@mui/icons-material';
import { toast } from 'sonner';

type SelectDefaultAddressModalProps = {
    open: boolean;
    onClose: () => void;
    items: Address[];
    currentDefaultId?: number;
    onSelect: (id: number) => void;
};

export default function SelectDefaultAddressModal({
    open,
    onClose,
    items,
    currentDefaultId,
    onSelect
}: SelectDefaultAddressModalProps) {
    const [selectedId, setSelectedId] = useState<number | undefined>(currentDefaultId);
    const { handleChangeDefaultAddress } = useChangeDefaultAddress();

    const handleSave = async () => {
        if (selectedId !== undefined) {
            try {
                await handleChangeDefaultAddress(selectedId);
                onSelect(selectedId); // We might want to pass the ID back even if we don't use the response message
                onClose();
            } catch (error) {
                console.error(error);
            }
        } else {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Seleccionar Dirección Predeterminada
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <FuseSvgIcon size={20}>heroicons-outline:x-mark</FuseSvgIcon>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, mt: 2 }}>
                <List sx={{ py: 0 }}>
                    {items.map((item, index) => {
                        const isSelected = selectedId === item.id;
                        const isCurrentDefault = currentDefaultId === item.id;

                        // Use fieldId as key if available (from useFieldArray), otherwise fallback to id or index
                        // We must cast to any because Address type might not have fieldId defined explicitly
                        const key = (item as any).fieldId || item.id || index;

                        return (
                            <ListItem
                                key={key}
                                disablePadding
                                sx={{
                                    borderBottom: index < items.length - 1 ? 1 : 0,
                                    borderColor: 'divider'
                                }}
                            >
                                <ListItemButton
                                    onClick={() => setSelectedId(item.id)}
                                    selected={isSelected}
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        bgcolor: isSelected ? 'primary.50' : 'transparent',
                                        borderLeft: 4,
                                        borderLeftColor: isSelected ? 'primary.main' : 'transparent',
                                        '&:hover': {
                                            bgcolor: isSelected ? 'primary.100' : 'action.hover'
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.50',
                                            '&:hover': {
                                                bgcolor: 'primary.100'
                                            }
                                        }
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                        {isSelected && (
                                            <FuseSvgIcon size={20} color="primary">
                                                heroicons-outline:check-circle
                                            </FuseSvgIcon>
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {item.street}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <MapIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.city}, {item.state} - {item.postal_code}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                        {isCurrentDefault && (
                                            <Chip
                                                label="Actual"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: 1,
                    borderColor: 'divider'
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={selectedId === undefined}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
