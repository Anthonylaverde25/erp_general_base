import { useRef, useState, useEffect } from 'react';
import { Box, InputBase, Paper, IconButton, Tooltip } from '@mui/material';
import { useSearchPartners } from '@/features/partners/hooks/useSearchPartners';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { QuickProspectModal } from './QuickProspectModal';
import { QuickPartnerModal } from './QuickPartnerModal';
import { useNavigate } from 'react-router';

interface PartnerAutocompleteProps {
    value: string | number | undefined; // partner_id
    onChange: (partnerId: number | undefined) => void;
    type?: string; // 'customer' | 'supplier'
    disabled?: boolean;
    initialPartner?: any; // Accepting any shape for now to avoid PartnerEntity mismatch
    isQuoteDocument?: boolean;
    label?: string;
}

export function PartnerAutocomplete({
    value,
    onChange,
    type,
    disabled = false,
    initialPartner,
    isQuoteDocument = true,
    label,
}: PartnerAutocompleteProps) {
    const { results, setQuery, isLoading } = useSearchPartners(type);
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState(initialPartner ? initialPartner.name : '');
    const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | undefined>(initialPartner);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
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
            if (showDropdown && inputValue.length > 0 && !isLoading && results.length === 0) {
                // Trigger create action when pressing enter on 'no results'
                setShowDropdown(false);
                if (isQuoteDocument) {
                    setIsProspectModalOpen(true);
                } else {
                    setIsPartnerModalOpen(true);
                }
            } else {
                setShowDropdown(false);
            }
        }
    };

    return (
        <Box position="relative" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {label && (
                <label style={{
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--doc-text-muted)',
                    marginBottom: '0.2rem',
                    padding: '6px 12px 0 12px'
                }}>
                    {label}
                </label>
            )}
            <Box display="flex" alignItems="center" position="relative" sx={{ padding: '0 12px 6px 12px', flex: 1 }}>
                <InputBase
                    inputRef={inputRef}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder={type === 'vendor' || type === 'supplier' ? 'Buscar por proveedor' : 'Buscar por cliente'}
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
            </Box>

            {showDropdown && !disabled && (results.length > 0 || isLoading || inputValue.length > 0) && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 9999,
                        width: '100%',
                        maxHeight: 220,
                        overflowY: 'auto',
                        mt: 0,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
                        border: '1px solid #d0d0d0',
                        borderRadius: '0 0 6px 6px',
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
                                padding: '7px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: i === selectedIndex ? '#eef4ff' : 'transparent',
                                '&:hover': { bgcolor: '#eef4ff' },
                                '&:last-child': { borderBottom: 'none' },
                            }}
                        >
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                <strong>{res.name}</strong>
                                {(res.vat_number || res.cif) && (
                                    <span style={{ marginLeft: 6, color: '#999', fontSize: '11px' }}>
                                        ({res.cif || res.vat_number})
                                    </span>
                                )}
                            </Box>
                        </Box>
                    ))}
                    {!isLoading && results.length === 0 && inputValue.length > 0 && (
                        <Box
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setShowDropdown(false);
                                if (isQuoteDocument) {
                                    setIsProspectModalOpen(true);
                                } else {
                                    setIsPartnerModalOpen(true);
                                }
                            }}
                            sx={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'var(--doc-primary-strong)',
                                '&:hover': { bgcolor: '#eef4ff' },
                            }}
                        >
                            <AddIcon sx={{ fontSize: '16px' }} />
                            <strong style={{ fontSize: '12px' }}>
                                Crear {isQuoteDocument ? 'Prospecto' : 'Socio'} "{inputValue}"
                            </strong>
                        </Box>
                    )}
                </Paper>
            )}

            {/* Show details underneath like original layout if valid */}
            {selectedPartner && (selectedPartner.cif || selectedPartner.vat_number) && (
                <div style={{ fontSize: '0.52rem', color: 'var(--doc-text-muted)', margin: '0 12px 6px 12px', display: 'flex', gap: '0.4rem', fontWeight: 600 }}>
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

            {!disabled && (
                <QuickPartnerModal
                    open={isPartnerModalOpen}
                    onClose={() => setIsPartnerModalOpen(false)}
                    onSuccess={(newPartner) => {
                        setIsPartnerModalOpen(false);
                        applyPartner(newPartner);
                    }}
                    initialName={inputValue}
                    partnerType={type as 'customer' | 'supplier' | 'vendor' | undefined}
                />
            )}
        </Box>
    );
}
