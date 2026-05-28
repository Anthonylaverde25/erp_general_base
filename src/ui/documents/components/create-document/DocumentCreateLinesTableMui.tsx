import React, { useRef, useState, useEffect, useCallback, Fragment } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Box,
    InputBase,
    Paper,
} from '@mui/material';
import { DeleteOutline, Add } from '@mui/icons-material';
import type { DocumentLineItem, ItemSearchResult } from './types';
import type { DocumentFormValues } from '../../schemas/documentSchema';
import { useSearchItems } from '@/features/items/hooks/useSearchItems';
import { useDocumentCreate } from '../../context/DocumentCreateContext';
import { TaxMultiSelect } from './TaxMultiSelect';

function makeEmptyLine(): DocumentLineItem {
    return {
        id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        item_id: undefined,
        code: '',
        description: '',
        quantity: '1',
        unit_name: undefined,
        unitPrice: '0',
        discount: '0',
        taxes: [],
        subtotal: '0.00',
    };
}

/* ──────────────────────────────────────────────────────────────
   Autocomplete Input for the Line Row
   - Uses LOCAL state only while typing (no update() calls per keystroke)
   - Commits to useFieldArray only on blur or item selection
────────────────────────────────────────────────────────────── */
function AutocompleteCell({
    index,
    initialCode,
    onCommit,
    disabled = false,
}: {
    index: number;
    initialCode: string;
    onCommit: (idx: number, patch: Partial<DocumentLineItem>) => void;
    disabled?: boolean;
}) {
    const { itemType, operation } = useDocumentCreate();
    const { results, setQuery, isLoading } = useSearchItems(itemType);

    const [inputValue, setInputValue] = useState(initialCode);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const committedRef = useRef(false); // track if we committed via item click

    // Sync internal state when initialCode changes (e.g. from reset() in edit mode)
    useEffect(() => setInputValue(initialCode), [initialCode]);

    // Reset selected index when results change
    useEffect(() => setSelectedIndex(0), [results]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const val = e.target.value;
        setInputValue(val);
        setQuery(val);
        setShowDropdown(val.length >= 1);
        committedRef.current = false;
    };

    const applyItem = (selected: ItemSearchResult) => {
        if (disabled) return;
        setInputValue(selected.name);
        setShowDropdown(false);
        committedRef.current = true;
        const price = operation === 'sale' ? selected.sale_price : (selected.purchase_price ?? selected.sale_price);
        const updatedPrice = String(price ?? 0);
        const qty = '1';

        const net = Number(qty) * Number(updatedPrice);
        let taxAmount = 0;
        (selected.tax_rates ?? []).forEach(t => {
            const amount = net * (t.rate / 100);
            taxAmount += t.operation === 'subtract' ? -amount : amount;
        });
        const calculatedSubtotal = (net + taxAmount).toFixed(2);

        onCommit(index, {
            item_id: selected.id,
            code: selected.name,
            description: selected.description || selected.name,
            unitPrice: updatedPrice,
            quantity: qty,
            unit_name: selected.unit?.name,
            taxes: selected.tax_rates ?? [],
            subtotal: calculatedSubtotal,
        });
    };

    const handleBlur = () => {
        if (disabled) return;
        setTimeout(() => setShowDropdown(false), 200);
        // Only commit free text on blur if we didn't already commit via item selection
        if (!committedRef.current && inputValue !== initialCode) {
            onCommit(index, { code: inputValue, item_id: undefined, unit_name: undefined });
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
                applyItem(results[selectedIndex]);
            }
        } else if (e.key === 'Enter') {
            setShowDropdown(false);
        }
    };

    return (
        <Box position="relative">
            <InputBase
                inputRef={inputRef}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder="Buscar artículo o escribir concepto..."
                fullWidth
                sx={{ fontSize: '13px', opacity: disabled ? 0.8 : 1 }}
            />

            {showDropdown && !disabled && (results.length > 0 || isLoading) && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 9999,
                        minWidth: 350,
                        maxHeight: 250,
                        overflowY: 'auto',
                        mt: 0.5,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    {isLoading && <Box p={1} fontSize="12px" color="gray">Buscando...</Box>}
                    {results.map((res, i) => (
                        <Box
                            key={res.id}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                applyItem(res);
                            }}
                            onMouseEnter={() => setSelectedIndex(i)}
                            sx={{
                                p: 1.5,
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                bgcolor: i === selectedIndex ? '#e3f2fd' : 'transparent',
                                '&:hover': { bgcolor: '#e3f2fd' },
                                '&:last-child': { borderBottom: 'none' },
                            }}
                        >
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                <strong>{res.sku}</strong>
                                <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                                {res.name}
                            </Box>
                            <Box sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '12px', pl: 2 }}>
                                {Number(res.sale_price).toFixed(2)}
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}

/* ──────────────────────────────────────────────────────────────
   Main MUI Table Component
 ────────────────────────────────────────────────────────────── */
export default function DocumentCreateLinesTableMui({
    discountEnabled,
}: {
    discountEnabled: boolean;
}) {
    const { control, getValues } = useFormContext<DocumentFormValues>();
    const { isEditMode, isLoadingDocument, isReadOnly, isRestricted } = useDocumentCreate();

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'lines',
    });

    // Initialize default 1 line if empty on mount — skip in edit mode (data comes from reset())
    useEffect(() => {
        if (isEditMode || isLoadingDocument || isReadOnly || isRestricted) return;
        const currentLines = getValues('lines');
        if (!currentLines || currentLines.length === 0) {
            append(makeEmptyLine());
        }
    }, [append, getValues, isEditMode, isLoadingDocument, isReadOnly, isRestricted]);

    /** Commit a partial update to a line (called on blur / item selection only) */
    const commitLinePatch = useCallback((index: number, patch: Partial<DocumentLineItem>) => {
        if (isReadOnly || isRestricted) return;
        const current = { ...(fields[index] as DocumentLineItem), ...patch };
        const qty = Number(current.quantity) || 0;
        const price = Number(current.unitPrice) || 0;
        const disc = discountEnabled ? Number(current.discount) || 0 : 0;
        const net = qty * price * (1 - disc / 100);
        let taxAmount = 0;
        (current.taxes || []).forEach(t => {
            const amount = net * (t.rate / 100);
            taxAmount += t.operation === 'subtract' ? -amount : amount;
        });
        current.subtotal = String(net + taxAmount);
        update(index, current);
    }, [fields, discountEnabled, update, isReadOnly, isRestricted]);

    const updateLineField = (index: number, field: keyof DocumentLineItem, value: any) => {
        if (isReadOnly || isRestricted) return;
        commitLinePatch(index, { [field]: value });
    };

    const handleAddLine = () => {
        if (isReadOnly || isRestricted) return;
        append(makeEmptyLine());
    };

    const isActionDisabled = isReadOnly || isRestricted;

    return (
        <Box display="flex" flexDirection="column" flex={1} minHeight={0} bgcolor="white" borderTop="1px solid #f0f0f0">
            <TableContainer sx={{ flex: 1, minHeight: 0 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: 'rgba(226, 232, 240, 0.85)', fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5, borderBottom: '2px solid #cbd5e1' } }}>
                            <TableCell width={50} align="center">#</TableCell>
                            <TableCell width="25%">ARTÍCULO / CONCEPTO</TableCell>
                            <TableCell width="18%">DESCRIPCIÓN</TableCell>
                            <TableCell width={110} align="right">CANT.</TableCell>
                            <TableCell width={60} align="left">UD.</TableCell>
                            <TableCell width={110} align="right">PRECIO U.</TableCell>
                            {discountEnabled && <TableCell width={90} align="right">DTO %</TableCell>}
                            <TableCell width={200}>IMPUESTOS</TableCell>
                            <TableCell width={120} align="right">SUBTOTAL</TableCell>
                            {!isActionDisabled && <TableCell width={50} align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(() => {
                            let lastSourceId: string | undefined = undefined;
                            return fields.flatMap((field, index) => {
                                const item = field as DocumentLineItem;
                                const isNewSection = item.source_document_id !== lastSourceId;
                                lastSourceId = item.source_document_id;

                                const sectionHeader = isNewSection && item.source_document_number ? (
                                    <TableRow
                                        key={`header-${item.source_document_id}-${index}`}
                                        sx={{ 
                                            bgcolor: '#f8fafc',
                                            '& td': { py: 0.5, borderBottom: '1px solid #e2e8f0' } 
                                        }}
                                    >
                                        <TableCell colSpan={discountEnabled ? 10 : 9} align="center">
                                            <Box 
                                                sx={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    py: 1,
                                                    px: 2,
                                                }}
                                            >
                                                <Box component="span" sx={{ fontSize: '10px', fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    ALBARÁN:
                                                </Box>
                                                <Box 
                                                    component="span" 
                                                    sx={{ 
                                                        fontSize: '12px', 
                                                        fontWeight: 700, 
                                                        color: 'text.primary', 
                                                        bgcolor: 'white', 
                                                        px: 1.5, 
                                                        py: 0.5, 
                                                        borderRadius: '4px', 
                                                        border: '1px solid', 
                                                        borderColor: 'divider',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    {item.source_document_number}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : null;

                                const contentRow = (
                                    <TableRow
                                        key={field.id}
                                        hover
                                        sx={{ '& td': { py: 1, borderBottom: '1px solid #f0f0f0' } }}
                                    >
                                        <TableCell align="center" sx={{ color: '#888', fontSize: '12px' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <AutocompleteCell
                                                index={index}
                                                initialCode={item.code || ''}
                                                onCommit={commitLinePatch}
                                                disabled={isActionDisabled}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <InputBase
                                                value={item.description}
                                                onChange={(e) => updateLineField(index, 'description', e.target.value)}
                                                placeholder="Añadir descripción..."
                                                fullWidth
                                                disabled={isActionDisabled}
                                                sx={{ fontSize: '13px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <InputBase
                                                value={item.quantity}
                                                onChange={(e) => updateLineField(index, 'quantity', e.target.value)}
                                                type="number"
                                                inputProps={{ style: { textAlign: 'right' } }}
                                                fullWidth
                                                disabled={isActionDisabled}
                                                sx={{ fontSize: '13px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box component="span" sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                                {item.unit_name || '-'}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <InputBase
                                                value={item.unitPrice}
                                                onChange={(e) => updateLineField(index, 'unitPrice', e.target.value)}
                                                type="number"
                                                inputProps={{ style: { textAlign: 'right' } }}
                                                fullWidth
                                                disabled={isActionDisabled}
                                                sx={{ fontSize: '13px' }}
                                            />
                                        </TableCell>
                                        {discountEnabled && (
                                            <TableCell align="right">
                                                <InputBase
                                                    value={item.discount}
                                                    onChange={(e) => updateLineField(index, 'discount', e.target.value)}
                                                    type="number"
                                                    inputProps={{ style: { textAlign: 'right' } }}
                                                    fullWidth
                                                    disabled={isActionDisabled}
                                                    sx={{ fontSize: '13px' }}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <TaxMultiSelect
                                                taxes={item.taxes || []}
                                                disabled={isActionDisabled}
                                                onChange={(newTaxes) => {
                                                    if (!isActionDisabled) {
                                                        commitLinePatch(index, { taxes: newTaxes });
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '13px' }}>
                                            {Number(item.subtotal || 0).toFixed(2)}
                                        </TableCell>
                                        {!isActionDisabled && (
                                            <TableCell align="center">
                                                {(item.code || item.description) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => remove(index)}
                                                        sx={{ color: '#e57373', p: 0.5 }}
                                                    >
                                                        <DeleteOutline fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );

                                return [sectionHeader, contentRow].filter(Boolean);
                            });
                        })()}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box p={1.5}>
                <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddLine}
                    disabled={isActionDisabled}
                    sx={{
                        fontSize: '13px',
                        textTransform: 'none',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        px: 2,
                        opacity: isActionDisabled ? 0.5 : 1,
                    }}
                >
                    Añadir nueva línea
                </Button>
            </Box>
        </Box>
    );
}
