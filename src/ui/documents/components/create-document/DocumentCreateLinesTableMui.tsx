import { useRef, useState, useEffect, useCallback } from 'react';
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
    Chip,
    Box,
    InputBase,
    Paper,
} from '@mui/material';
import { DeleteOutline, Add, Close } from '@mui/icons-material';
import type { DocumentLineItem, ItemSearchResult } from './types';
import type { DocumentFormValues } from '../../schemas/documentSchema';
import { useSearchItems } from '@/features/items/hooks/useSearchItems';
import { useDocumentCreate } from '../../context/DocumentCreateContext';

function makeEmptyLine(): DocumentLineItem {
    return {
        id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        item_id: undefined,
        code: '',
        description: '',
        quantity: '1',
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
}: {
    index: number;
    initialCode: string;
    onCommit: (idx: number, patch: Partial<DocumentLineItem>) => void;
}) {
    const { itemType, operation } = useDocumentCreate();
    const { results, setQuery, isLoading } = useSearchItems(itemType);

    const [inputValue, setInputValue] = useState(initialCode);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const committedRef = useRef(false); // track if we committed via item click

    // Reset selected index when results change
    useEffect(() => setSelectedIndex(0), [results]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setQuery(val);
        setShowDropdown(val.length >= 1);
        committedRef.current = false;
        // DON'T call onCommit here — wait for blur or item selection
    };

    const applyItem = (selected: ItemSearchResult) => {
        setInputValue(selected.name);
        setShowDropdown(false);
        committedRef.current = true;
        const price = operation === 'sale' ? selected.sale_price : (selected.purchase_price ?? selected.sale_price);
        const updatedPrice = String(price ?? 0);

        onCommit(index, {
            item_id: selected.id,
            code: selected.sku || selected.name,
            description: selected.description || selected.name,
            unitPrice: updatedPrice,
            quantity: '1',
            taxes: selected.tax_rates ?? [],
            subtotal: String(1 * Number(updatedPrice)),
        });
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
        // Only commit free text on blur if we didn't already commit via item selection
        if (!committedRef.current && inputValue !== initialCode) {
            onCommit(index, { code: inputValue, item_id: undefined });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
                placeholder="Buscar artículo o escribir concepto..."
                fullWidth
                sx={{ fontSize: '13px' }}
            />

            {showDropdown && (results.length > 0 || isLoading) && (
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

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'lines',
    });

    // Initialize default 2 lines if empty on mount
    useEffect(() => {
        const currentLines = getValues('lines');
        if (!currentLines || currentLines.length === 0) {
            append([makeEmptyLine(), makeEmptyLine()]);
        }
    }, [append, getValues]);

    /** Commit a partial update to a line (called on blur / item selection only) */
    const commitLinePatch = useCallback((index: number, patch: Partial<DocumentLineItem>) => {
        const current = { ...(fields[index] as DocumentLineItem), ...patch };
        const qty = Number(current.quantity) || 0;
        const price = Number(current.unitPrice) || 0;
        const disc = discountEnabled ? Number(current.discount) || 0 : 0;
        current.subtotal = String(qty * price * (1 - disc / 100));
        update(index, current);
    }, [fields, discountEnabled, update]);

    const updateLineField = (index: number, field: keyof DocumentLineItem, value: any) => {
        commitLinePatch(index, { [field]: value });
    };

    const handleAddLine = () => {
        append(makeEmptyLine());
    };

    const handleRemoveTax = (index: number, taxId: number) => {
        const current = fields[index] as DocumentLineItem;
        const newTaxes = (current.taxes || []).filter(t => t.id !== taxId);
        update(index, { ...current, taxes: newTaxes });
    };

    return (
        <Box display="flex" flexDirection="column" flex={1} minHeight={0} bgcolor="white" borderTop="1px solid #f0f0f0">
            <TableContainer sx={{ flex: 1, minHeight: 0 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: 'rgba(226, 232, 240, 0.85)', fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5, borderBottom: '2px solid #cbd5e1' } }}>
                            <TableCell width={50} align="center">#</TableCell>
                            <TableCell width="35%">ARTÍCULO / CONCEPTO</TableCell>
                            <TableCell width="25%">DESCRIPCIÓN</TableCell>
                            <TableCell width={90} align="right">CANT.</TableCell>
                            <TableCell width={110} align="right">PRECIO U.</TableCell>
                            {discountEnabled && <TableCell width={90} align="right">DTO %</TableCell>}
                            <TableCell width={160}>IMPUESTOS</TableCell>
                            <TableCell width={120} align="right">SUBTOTAL</TableCell>
                            <TableCell width={50} align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((field, index) => {
                            const item = field as DocumentLineItem;
                            return (
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
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <InputBase
                                            value={item.description}
                                            onChange={(e) => updateLineField(index, 'description', e.target.value)}
                                            placeholder="Añadir descripción..."
                                            fullWidth
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
                                            sx={{ fontSize: '13px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <InputBase
                                            value={item.unitPrice}
                                            onChange={(e) => updateLineField(index, 'unitPrice', e.target.value)}
                                            type="number"
                                            inputProps={{ style: { textAlign: 'right' } }}
                                            fullWidth
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
                                                sx={{ fontSize: '13px' }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                                            {!item.taxes || item.taxes.length === 0 ? (
                                                <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                                            ) : (
                                                item.taxes.map(tax => (
                                                    <Chip
                                                        key={tax.id}
                                                        label={tax.name}
                                                        size="small"
                                                        onDelete={() => handleRemoveTax(index, tax.id)}
                                                        deleteIcon={<Close sx={{ fontSize: 13 }} />}
                                                        sx={{ height: 20, fontSize: '10px' }}
                                                    />
                                                ))
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '13px' }}>
                                        {Number(item.subtotal || 0).toFixed(2)}
                                    </TableCell>
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
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box p={1.5} borderTop="1px dashed #e0e0e0" bgcolor="#fafafa">
                <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddLine}
                    variant="outlined"
                    color="primary"
                    sx={{
                        fontSize: '13px',
                        textTransform: 'none',
                        borderRadius: '6px',
                        borderStyle: 'dashed',
                        borderWidth: '1.5px',
                    }}
                >
                    Añadir nueva línea
                </Button>
            </Box>
        </Box>
    );
}
