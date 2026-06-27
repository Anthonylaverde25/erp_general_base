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
    List,
    ListItem,
    ListItemText,
    Chip,
} from '@mui/material';
import { Plus, Trash2, X, ClipboardList } from 'lucide-react';
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

        setSerials(prev => [...prev, cleanSerial]);
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
        setSerials(prev => prev.filter((_, i) => i !== index));
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

    const isComplete = serials.length === requiredQty;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 480,
                    borderRadius: '4px', // Sharp Edges: as per AGENTS.md
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 800,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <ClipboardList size={18} color="#005483" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Registrar Números de Serie
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                    <X size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Header Information (No Card) */}
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>
                        {lineItem.code || 'Artículo'} - {lineItem.description || 'Sin descripción'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Cantidad requerida:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#005483', fontSize: '0.75rem' }}>
                            {requiredQty} Uds.
                        </Typography>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" variant="standard" sx={{ borderRadius: '4px', py: 0.5 }}>
                        {error}
                    </Alert>
                )}

                {/* Available Serials Picker */}
                {lineItem.available_serial_numbers && lineItem.available_serial_numbers.length > 0 && (
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            fontWeight: 600,
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            bgcolor: isSelected ? '#005483' : 'transparent',
                                            color: isSelected ? '#ffffff' : 'text.primary',
                                            borderColor: isSelected ? '#005483' : '#cbd5e1',
                                            '&:hover': {
                                                bgcolor: isSelected ? '#004066' : '#f1f5f9',
                                                borderColor: isSelected ? '#004066' : '#94a3b8',
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
                    {lineItem.available_serial_numbers && lineItem.available_serial_numbers.length > 0 && (
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            O agregar manualmente
                        </Typography>
                    )}
                    <Box display="flex" gap={1} alignItems="flex-start">
                        <TextField
                            inputRef={inputRef}
                            label="Escanear o escribir número de serie..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={serials.length >= requiredQty}
                            placeholder={serials.length >= requiredQty ? "Completado" : "Presione Enter para agregar"}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '4px',
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleAddSerial(inputValue)}
                            disabled={!inputValue.trim() || serials.length >= requiredQty}
                            sx={{
                                minWidth: 40,
                                height: 40,
                                borderRadius: '4px',
                                bgcolor: '#005483',
                                '&:hover': { bgcolor: '#004066' }
                            }}
                        >
                            <Plus size={18} />
                        </Button>
                    </Box>
                </Box>

                {/* Selected Serials List */}
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Series Seleccionadas ({serials.length} de {requiredQty})
                        </Typography>
                        {isComplete ? (
                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800 }}>
                                ✓ Completado
                            </Typography>
                        ) : (
                            <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 800 }}>
                                Faltan {requiredQty - serials.length}
                            </Typography>
                        )}
                    </Box>

                    {serials.length === 0 ? (
                        <Box py={2.5} textAlign="center" color="text.secondary" border="1px dashed #e2e8f0" sx={{ borderRadius: '4px' }}>
                            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>Ninguna serie seleccionada aún</Typography>
                        </Box>
                    ) : (
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {serials.map((serial, index) => (
                                <Chip
                                    key={serial}
                                    label={serial}
                                    onDelete={() => handleRemoveSerial(index)}
                                    sx={{
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        bgcolor: '#f1f5f9',
                                        color: '#334155',
                                        border: '1px solid #e2e8f0',
                                        '& .MuiChip-deleteIcon': {
                                            color: '#ef4444',
                                            '&:hover': { color: '#dc2626' }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ textTransform: 'none', px: 3, fontSize: '13px', borderRadius: '4px' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '4px',
                        bgcolor: '#005483',
                        '&:hover': { bgcolor: '#004066' }
                    }}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
