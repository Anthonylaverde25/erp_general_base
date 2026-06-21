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

            <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                    p={1.5}
                    border="1px solid #e2e8f0"
                    borderLeft="4px solid #005483"
                    bgcolor="#f8fafc"
                    sx={{ borderRadius: '4px' }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {lineItem.code || 'Artículo'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {lineItem.description || 'Sin descripción'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={1} pt={1} sx={{ borderTop: '1px dashed #e2e8f0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Cantidad Requerida:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#005483' }}>
                            {requiredQty} Uds.
                        </Typography>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" variant="standard" sx={{ borderRadius: '4px', py: 0.5 }}>
                        {error}
                    </Alert>
                )}

                {/* Input Area */}
                <Box display="flex" gap={1} alignItems="flex-start">
                    <TextField
                        inputRef={inputRef}
                        label="Escanear o escribir número de serie..."
                        variant="filled"
                        size="small"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={serials.length >= requiredQty}
                        placeholder={serials.length >= requiredQty ? "Completado" : "Presione Enter para agregar"}
                        sx={{
                            '& .MuiFilledInput-root': {
                                borderRadius: '4px 4px 0 0',
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleAddSerial(inputValue)}
                        disabled={!inputValue.trim() || serials.length >= requiredQty}
                        sx={{
                            minWidth: 42,
                            height: 40,
                            borderRadius: '4px',
                            bgcolor: '#005483',
                            '&:hover': { bgcolor: '#004066' }
                        }}
                    >
                        <Plus size={20} />
                    </Button>
                </Box>

                {/* Serials List */}
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            Series Ingresadas ({serials.length} de {requiredQty})
                        </Typography>
                        {isComplete ? (
                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800 }}>
                                ✓ Completado
                            </Typography>
                        ) : (
                            <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 800 }}>
                                ⚠️ Faltan {requiredQty - serials.length}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        border="1px solid #e2e8f0"
                        sx={{
                            maxHeight: 180,
                            overflowY: 'auto',
                            bgcolor: '#ffffff',
                            borderRadius: '4px',
                        }}
                    >
                        {serials.length === 0 ? (
                            <Box py={3} textAlign="center" color="text.secondary">
                                <Typography variant="caption">No se han registrado series aún.</Typography>
                            </Box>
                        ) : (
                            <List dense disablePadding>
                                {serials.map((serial, index) => (
                                    <ListItem
                                        key={index}
                                        divider={index < serials.length - 1}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => handleRemoveSerial(index)}
                                                sx={{ color: '#e11d48' }}
                                            >
                                                <Trash2 size={14} />
                                            </IconButton>
                                        }
                                        sx={{ py: 0.5, px: 2 }}
                                    >
                                        <ListItemText
                                            primary={serial}
                                            primaryTypographyProps={{
                                                fontSize: '12px',
                                                fontFamily: 'monospace',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
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
