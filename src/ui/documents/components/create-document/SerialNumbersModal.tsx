import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { X, Trash2, Barcode, Save } from 'lucide-react';
import type { DocumentLineItem } from './types';

interface SerialNumbersModalProps {
    open: boolean;
    onClose: () => void;
    lineItem: DocumentLineItem | null;
    onSave?: (serials: string[]) => void;
}

export default function SerialNumbersModal({ open, onClose, lineItem, onSave }: SerialNumbersModalProps) {
    const [serials, setSerials] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const requiredQty = lineItem ? Math.max(1, Math.floor(Number(lineItem.quantity) || 1)) : 1;

    // Load initial serials when modal opens
    useEffect(() => {
        if (open && lineItem) {
            setSerials(lineItem.serial_numbers || []);
            setInputValue('');
            setError(null);
            // Focus input field after dialog transition
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        }
    }, [open, lineItem]);

    if (!lineItem) return null;

    const handleAddSerial = (serial: string) => {
        const cleanSerial = serial.trim();
        if (!cleanSerial) return;

        setError(null);

        // Prevent duplicate serials in the current list
        if (serials.includes(cleanSerial)) {
            setError(`El número de serie "${cleanSerial}" ya está en la lista.`);
            return;
        }

        // Limit count to required quantity
        if (serials.length >= requiredQty) {
            setError(`Ya has ingresado la cantidad necesaria de series (${requiredQty}).`);
            return;
        }

        setSerials((prev) => [...prev, cleanSerial]);
        setInputValue('');
        
        // Re-focus input for continuous scanning
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSerial(inputValue);
        }
    };

    const handleRemoveSerial = (index: number) => {
        setSerials((prev) => prev.filter((_, i) => i !== index));
        setError(null);
    };

    const handleSave = () => {
        if (onSave) {
            onSave(serials);
        } else {
            // Dispatch custom event to update the line item in AG Grid / Form
            const updatedRow: DocumentLineItem = {
                ...lineItem,
                serial_numbers: serials,
            };
            document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
        }
        onClose();
    };

    const isComplete = serials.length >= requiredQty;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    bgcolor: 'background.paper',
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)'
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    p: 3,
                    pb: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
                }}
            >
                <Typography variant="subtitle1" fontWeight={750} sx={{ fontSize: '1.15rem', color: 'text.primary' }}>
                    Despachar Números de Serie
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: '#4b5563' }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>
            <Divider />

            {/* Body */}
            <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Item and Status Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6b7280',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                display: 'block',
                                mb: 0.5
                            }}
                        >
                            Ítem en Despacho
                        </Typography>
                        <Typography
                            variant="body2"
							fontWeight={750}
                            sx={{
                                color: 'text.primary',
                                fontSize: '1rem',
                                lineHeight: 1.3
                            }}
                        >
                            {lineItem.code || 'Artículo'} - {lineItem.description || 'Sin descripción'}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6b7280',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                letterSpacing: '0.5px',
                                display: 'block',
                                mb: 0.5
                            }}
                        >
                            Series Requeridas
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={800}
                            sx={{
                                fontSize: '1.25rem',
                                color: 'text.primary'
                            }}
                        >
                            {serials.length} / {requiredQty}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {error && (
                    <Alert severity="error" sx={{ borderRadius: 0, py: 0.2 }}>
                        {error}
                    </Alert>
                )}

                {/* Available Serials Picker */}
                {lineItem.available_serial_numbers && lineItem.available_serial_numbers.length > 0 && (
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6b7280',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }}
                        >
                            Series Disponibles en Almacén ({lineItem.available_serial_numbers.length})
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {lineItem.available_serial_numbers.map((serial) => {
                                const isSelected = serials.includes(serial);
                                return (
                                    <Chip
                                        key={serial}
                                        label={serial}
                                        variant={isSelected ? "filled" : "outlined"}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSerials(prev => prev.filter(s => s !== serial));
                                                setError(null);
                                            } else {
                                                if (serials.length >= requiredQty) {
                                                    setError(`Ya has ingresado la cantidad necesaria de series (${requiredQty}).`);
                                                    return;
                                                }
                                                setSerials(prev => [...prev, serial]);
                                                setError(null);
                                            }
                                        }}
                                        sx={{
                                            borderRadius: 0,
                                            fontFamily: 'monospace',
                                            fontWeight: 600,
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            bgcolor: isSelected ? '#000000' : 'transparent',
                                            color: isSelected ? '#ffffff' : 'text.primary',
                                            borderColor: isSelected ? '#000000' : '#d1d5db',
                                            '&:hover': {
                                                bgcolor: isSelected ? '#1f2937' : '#f3f4f6',
                                                borderColor: isSelected ? '#1f2937' : '#9ca3af',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    />
                                );
							})}
                        </Box>
                    </Box>
                )}

                {/* Input Area */}
                <Box display="flex" flexDirection="column" gap={1}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#374151',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    >
                        {lineItem.available_serial_numbers && lineItem.available_serial_numbers.length > 0
                            ? "O agregar manualmente"
                            : "Escanear o escribir número de serie"}
                    </Typography>
                    <TextField
                        inputRef={inputRef}
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isComplete}
                        placeholder="SN-XXXX-XXXX"
                        InputProps={{
                            sx: {
                                borderRadius: 0,
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db'
                                }
                            },
                            endAdornment: (
                                <Barcode size={20} style={{ color: '#9ca3af', marginRight: '4px' }} />
                            )
                        }}
                    />
                </Box>

                {/* Table list of selected serials */}
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: '#e5e7eb',
                        borderRadius: 0,
                        overflow: 'hidden',
                        mt: 0.5
                    }}
                >
                    {/* Table Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            bgcolor: '#d1d5db',
                            py: 0.75,
                            px: 2,
                            borderBottom: '1px solid',
                            borderColor: '#e5e7eb'
                        }}
                    >
                        <Typography variant="caption" sx={{ width: '15%', fontWeight: 700, color: '#4b5563', fontSize: '0.75rem' }}>
                            #
                        </Typography>
                        <Typography variant="caption" sx={{ width: '70%', fontWeight: 700, color: '#4b5563', fontSize: '0.75rem' }}>
							Número de Serie
                        </Typography>
                        <Typography variant="caption" sx={{ width: '15%', fontWeight: 700, color: '#4b5563', fontSize: '0.75rem', textAlign: 'right' }}>
                            Acción
                        </Typography>
                    </Box>

                    {/* Table Rows */}
                    <Box
                        sx={{
                            maxHeight: 180,
                            overflowY: 'auto',
                            minHeight: '60px',
                            bgcolor: 'background.paper'
                        }}
                    >
                        {serials.length === 0 ? (
                            <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                    Ninguna serie seleccionada aún.
                                </Typography>
                            </Box>
                        ) : (
                            serials.map((serial, index) => {
                                const isEven = index % 2 === 1;
                                return (
                                    <Box
                                        key={serial}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            py: 0.75,
                                            px: 2,
                                            bgcolor: isEven ? '#f3f4f6' : '#ffffff',
                                            borderBottom: index < serials.length - 1 ? '1px solid' : 'none',
                                            borderColor: '#e5e7eb'
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                width: '15%',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                width: '70%',
                                                fontFamily: 'monospace',
                                                fontWeight: 600,
                                                color: '#1f2937',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {serial}
                                        </Typography>
                                        <Box sx={{ width: '15%', display: 'flex', justifyContent: 'flex-end' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveSerial(index)}
                                                sx={{ color: '#dc2626', p: 0.25 }}
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </Box>
            </DialogContent>

            {/* Footer */}
            <DialogActions
                sx={{
                    p: 3,
                    bgcolor: '#f3f4f6',
                    borderTop: '1px solid',
                    borderColor: '#e5e7eb',
                    display: 'flex',
                    justifyContent: 'end',
                    gap: 2
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 0,
                        bgcolor: '#ffffff',
						color: '#374151',
						borderColor: '#d1d5db',
                        px: 3,
                        py: 0.75,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
						'&:hover': {
							bgcolor: '#f9fafb',
							borderColor: '#c5c9d1'
						}
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        borderRadius: 0,
                        bgcolor: '#000000',
                        color: '#ffffff',
                        px: 3,
                        py: 0.75,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        '&:hover': {
                            bgcolor: '#1f2937'
                        }
                    }}
                    startIcon={<Save size={14} />}
                >
                    Despachar Series
                </Button>
            </DialogActions>
        </Dialog>
    );
}
