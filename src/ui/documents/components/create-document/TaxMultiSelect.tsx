import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Chip, IconButton } from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import type { DocumentLineTaxItem } from './types';

interface TaxMultiSelectProps {
    /** Currently selected taxes on the line */
    taxes: DocumentLineTaxItem[];
    /** Callback when taxes change */
    onChange: (taxes: DocumentLineTaxItem[]) => void;
    /** Whether to render the dropdown via portal (needed for AG Grid) */
    usePortal?: boolean;
}

/**
 * Multi-select for taxes on a document line.
 * Shows chips for selected taxes and a "+" button to add more.
 * Enforces the rule: only one tax_rate per tax_type per line.
 */
export function TaxMultiSelect({ taxes, onChange, usePortal = false }: TaxMultiSelectProps) {
    const { data: allTaxRates } = useIndexTaxRates();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 260 });

    // Close dropdown on outside click
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                anchorRef.current && !anchorRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Calculate dropdown position
    useEffect(() => {
        if (open && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 2,
                left: rect.left,
                width: Math.max(rect.width, 260),
            });
        }
    }, [open]);

    // Available options: exclude tax_rates whose tax_type_id is already present in the line
    const availableOptions = useMemo(() => {
        if (!allTaxRates) return [];
        const usedTaxTypeIds = new Set(taxes.map(t => t.tax_type_id));
        return allTaxRates.filter(tr => !usedTaxTypeIds.has(tr.tax_type_id));
    }, [allTaxRates, taxes]);

    // Group available options by tax_type for a clean UI
    const groupedOptions = useMemo(() => {
        const groups: Record<string, typeof availableOptions> = {};
        availableOptions.forEach(tr => {
            const typeName = tr.tax_type?.name || 'Otros';
            if (!groups[typeName]) groups[typeName] = [];
            groups[typeName].push(tr);
        });
        return groups;
    }, [availableOptions]);

    const handleAddTax = (taxRate: (typeof availableOptions)[0]) => {
        const newTax: DocumentLineTaxItem = {
            id: taxRate.id,
            name: taxRate.name,
            rate: taxRate.percentage,
            tax_type_id: taxRate.tax_type_id,
            operation: (taxRate.tax_type?.operation as 'add' | 'subtract') ?? 'add',
        };
        onChange([...taxes, newTax]);
        setOpen(false);
    };

    const handleRemoveTax = (taxId: number) => {
        onChange(taxes.filter(t => t.id !== taxId));
    };

    const dropdownContent = open && availableOptions.length > 0 && (
        <div
            ref={dropdownRef}
            style={{
                position: 'fixed',
                zIndex: 9999,
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                background: '#fff',
                border: '1px solid #d0d0d0',
                borderRadius: '6px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
                maxHeight: 240,
                overflowY: 'auto',
            }}
            onMouseDown={(e) => e.preventDefault()} // prevent blur
        >
            {Object.entries(groupedOptions).map(([typeName, rates]) => (
                <div key={typeName}>
                    <div style={{
                        padding: '6px 10px 4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '1px solid #f0f0f0',
                        background: '#fafafa',
                    }}>
                        {typeName}
                    </div>
                    {rates.map(tr => (
                        <div
                            key={tr.id}
                            onClick={() => handleAddTax(tr)}
                            style={{
                                padding: '7px 12px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid #f5f5f5',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#eef4ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <span>{tr.name}</span>
                            <span style={{ color: '#1976d2', fontWeight: 600, fontSize: '11px' }}>
                                {tr.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div
            ref={anchorRef}
            style={{
                display: 'flex',
                gap: 3,
                alignItems: 'center',
                flexWrap: 'nowrap',
                padding: '2px 0',
                minHeight: 24,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ccc transparent',
            }}
        >
            {taxes.length === 0 && (
                <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
            )}
            {taxes.map(tax => (
                <Chip
                    key={tax.id}
                    label={tax.name}
                    size="small"
                    onDelete={() => handleRemoveTax(tax.id)}
                    deleteIcon={<Close style={{ fontSize: 11 }} />}
                    sx={{
                        height: 20,
                        fontSize: '10px',
                        '& .MuiChip-label': { px: '4px' },
                        '& .MuiChip-deleteIcon': { margin: '0 2px 0 -2px' },
                    }}
                />
            ))}
            {availableOptions.length > 0 && (
                <IconButton
                    size="small"
                    onClick={() => setOpen(!open)}
                    sx={{
                        padding: '1px',
                        width: 18,
                        height: 18,
                        border: '1px dashed #bbb',
                        borderRadius: '4px',
                        color: '#888',
                        '&:hover': { background: '#eef4ff', borderColor: '#1976d2', color: '#1976d2' },
                    }}
                >
                    <Add style={{ fontSize: 13 }} />
                </IconButton>
            )}

            {usePortal
                ? dropdownContent && createPortal(dropdownContent, document.body)
                : dropdownContent
            }
        </div>
    );
}
