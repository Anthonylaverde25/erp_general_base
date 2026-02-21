import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    Chip,
    Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { IContact } from '@/types/company.types';
import { Email, Phone } from '@mui/icons-material';
import { useChangeDefaultContact } from '@/features/companies/hooks/useChangeDefaultContact';

type SelectDefaultContactModalProps = {
    open: boolean;
    onClose: () => void;
    items: IContact[];
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
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title="Seleccionar Contacto Predeterminado"
            onConfirm={handleSave}
            isConfirmDisabled={selectedId === undefined}
        >
            <Box sx={{ mt: 2 }}>
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
            </Box>
        </AppFormModal>
    );
}
