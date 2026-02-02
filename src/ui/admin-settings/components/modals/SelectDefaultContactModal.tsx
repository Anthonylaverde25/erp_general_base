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
import { Contact } from '@/types/company.types';
import { Email, Phone } from '@mui/icons-material';
import { useChangeDefaultContact } from '@/features/companies/hooks/useChangeDefaultContact';

type SelectDefaultContactModalProps = {
    open: boolean;
    onClose: () => void;
    items: Contact[];
    currentDefaultId?: number;
    onSelect: (id: number) => void;
};

export default function SelectDefaultContactModal({
    open,
    onClose,
    items,
    currentDefaultId,
    onSelect
}: SelectDefaultContactModalProps) {
    const [selectedId, setSelectedId] = useState<number | undefined>(currentDefaultId);

    const { handleChangeDefaultContact } = useChangeDefaultContact();

    const handleSave = async () => {
        if (selectedId !== undefined) {
            try {
                await handleChangeDefaultContact(selectedId);
                onSelect(selectedId);
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
                    Seleccionar Contacto Predeterminado
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
                                                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {item.email}
                                                    </Typography>
                                                </Stack>
                                                {item.phone && (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.phone}
                                                        </Typography>
                                                    </Stack>
                                                )}
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
