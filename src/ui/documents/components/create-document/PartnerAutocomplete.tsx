import { useRef, useState, useEffect } from 'react';
import { Box, InputBase, Paper, IconButton, Tooltip } from '@mui/material';
import { useSearchPartners } from '@/features/partners/hooks/useSearchPartners';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { QuickProspectModal } from './QuickProspectModal';

interface PartnerAutocompleteProps {
    value: string | number | undefined; // partner_id
    onChange: (partnerId: number | undefined) => void;
    type?: string; // 'customer' | 'supplier'
    disabled?: boolean;
    initialPartner?: any; // Accepting any shape for now to avoid PartnerEntity mismatch
}

export function PartnerAutocomplete({
    value,
    onChange,
    type,
    disabled = false,
    initialPartner,
}: PartnerAutocompleteProps) {
    const { results, setQuery, isLoading } = useSearchPartners(type);

    const [inputValue, setInputValue] = useState(initialPartner ? initialPartner.name : '');
    const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | undefined>(initialPartner);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync if initialPartner changes externally
    useEffect(() => {
        if (initialPartner && initialPartner.id === value) {
            setSelectedPartner(initialPartner);
            setInputValue(initialPartner.name);
        }
    }, [initialPartner, value]);

    // Reset selected index when results change
    useEffect(() => setSelectedIndex(0), [results]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const val = e.target.value;
        setInputValue(val);
        setQuery(val);
        setShowDropdown(val.length > 0);
        if (selectedPartner) {
            setSelectedPartner(undefined);
            onChange(undefined);
        }
    };

    const applyPartner = (selected: PartnerEntity) => {
        if (disabled) return;
        setInputValue(selected.name);
        setSelectedPartner(selected);
        setShowDropdown(false);
        onChange(selected.id);
    };

    const handleClear = () => {
        if (disabled) return;
        setInputValue('');
        setSelectedPartner(undefined);
        onChange(undefined);
        setQuery('');
        if (inputRef.current) inputRef.current.focus();
    };

    const handleBlur = () => {
        if (disabled) return;
        setTimeout(() => setShowDropdown(false), 200);
        // If they leave without selecting, revert to the last selected or clear
        if (!selectedPartner && inputValue.length > 0) {
            setInputValue(''); // Force them to pick from the list
            onChange(undefined);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Escape') {
            setShowDropdown(false);
            return;
        }
        if (showDropdown && results.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((p) => Math.min(p + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((p) => Math.max(p - 1, 0));
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                applyPartner(results[selectedIndex]);
            }
        } else if (e.key === 'Enter') {
            setShowDropdown(false);
        }
    };

    return (
        <Box position="relative">
            <Box display="flex" alignItems="center" position="relative">
                <InputBase
                    inputRef={inputRef}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder="Buscar por cliente"
                    className="doc-input doc-input-bold doc-input-primary"
                    fullWidth
                    sx={{
                        opacity: disabled ? 0.8 : 1,
                        paddingRight: selectedPartner ? '30px' : '8px',
                    }}
                />
                {!disabled && inputValue && (
                    <IconButton
                        size="small"
                        onClick={handleClear}
                        sx={{
                            position: 'absolute',
                            right: 4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '2px',
                        }}
                    >
                        <CloseIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                )}
                {!disabled && !inputValue && (
                    <IconButton
                        size="small"
                        onClick={() => setIsProspectModalOpen(true)}
                        title="Añadir Prospecto Rápido"
                        sx={{
                            position: 'absolute',
                            right: 6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '4px',
                            backgroundColor: 'var(--doc-primary-soft)',
                            color: 'var(--doc-primary-strong)',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'var(--doc-primary-strong)',
                                color: 'white',
                                transform: 'translateY(-50%) scale(1.05)',
                            },
                        }}
                    >
                        <AddIcon sx={{ fontSize: '14px' }} />
                    </IconButton>
                )}
            </Box>

            {showDropdown && !disabled && (results.length > 0 || isLoading) && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 9999,
                        width: '100%',
                        minWidth: 350,
                        maxHeight: 250,
                        overflowY: 'auto',
                        mt: 0.5,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    {isLoading && <Box p={1} fontSize="12px" color="gray">Buscando...</Box>}
                    {results.map((res: PartnerEntity, i: number) => (
                        <Box
                            key={res.id}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                applyPartner(res);
                            }}
                            onMouseEnter={() => setSelectedIndex(i)}
                            sx={{
                                p: 1.5,
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: i === selectedIndex ? '#e3f2fd' : 'transparent',
                                '&:hover': { bgcolor: '#e3f2fd' },
                                '&:last-child': { borderBottom: 'none' },
                            }}
                        >
                            <Box sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                {res.name}
                            </Box>
                            {(res.vat_number || res.cif) && (
                                <Box sx={{ fontSize: '11px', color: '#666', mt: 0.5 }}>
                                    {res.cif && <span>CIF: {res.cif}</span>}
                                    {res.cif && res.vat_number && <span style={{ margin: '0 6px' }}>|</span>}
                                    {res.vat_number && <span>VAT: {res.vat_number}</span>}
                                </Box>
                            )}
                        </Box>
                    ))}
                    {!isLoading && results.length === 0 && inputValue.length > 0 && (
                        <Box p={2} fontSize="12px" color="gray" textAlign="center">
                            No se encontraron resultados
                        </Box>
                    )}
                </Paper>
            )}

            {/* Show details underneath like original layout if valid */}
            {selectedPartner && (selectedPartner.cif || selectedPartner.vat_number) && (
                <div style={{ fontSize: '0.52rem', color: 'var(--doc-text-muted)', marginTop: '0.15rem', display: 'flex', gap: '0.4rem', fontWeight: 600 }}>
                    {selectedPartner.cif && <span>CIF: {selectedPartner.cif}</span>}
                    {selectedPartner.cif && selectedPartner.vat_number && <span>|</span>}
                    {selectedPartner.vat_number && <span>VAT: {selectedPartner.vat_number}</span>}
                </div>
            )}

            {!disabled && (
                <QuickProspectModal
                    open={isProspectModalOpen}
                    onClose={() => setIsProspectModalOpen(false)}
                    onSuccess={(newPartner) => {
                        setIsProspectModalOpen(false);
                        applyPartner(newPartner);
                    }}
                />
            )}
        </Box>
    );
}
