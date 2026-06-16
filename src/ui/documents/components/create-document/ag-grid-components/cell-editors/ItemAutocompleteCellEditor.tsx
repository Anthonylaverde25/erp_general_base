import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ICellEditorParams } from 'ag-grid-community';
import type { DocumentLineItem, ItemSearchResult } from '../../types';
import { useSearchItems } from '@/features/items/hooks/useSearchItems';
import { useDocumentCreate } from '../../../../context/DocumentCreateContext';

/* ──────────────────────────────────────────────────────────────
   Autocomplete Cell Editor
   ─ Opens on single click
   ─ First keypress goes directly into the input
   ─ Selecting an item or typing free text both work
   ─ Uses createPortal to avoid AG Grid's overflow: hidden clipping
────────────────────────────────────────────────────────────── */
export const ItemAutocompleteCellEditor = forwardRef(
    (props: ICellEditorParams<DocumentLineItem>, ref) => {
        const { itemType, operation } = useDocumentCreate();
        const { results, setQuery, isLoading } = useSearchItems(itemType);

        const initialChar =
            props.eventKey && props.eventKey.length === 1 ? props.eventKey : '';
        const [inputValue, setInputValue] = useState(
            initialChar || (props.value as string) || ''
        );
        const [showDropdown, setShowDropdown] = useState(initialChar.length > 0);
        const [selectedIndex, setSelectedIndex] = useState(-1);
        const inputRef = useRef<HTMLInputElement>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);
        const selectedItemRef = useRef<boolean>(false);

        const inputValueRef = useRef(inputValue);
        inputValueRef.current = inputValue;

        // Expose getValue to AG Grid — this is called when editing stops
        useImperativeHandle(ref, () => ({
            getValue: () => {
                console.log('[ItemAutocompleteCellEditor] getValue called, returning:', inputValueRef.current);
                return inputValueRef.current;
            },
            isCancelAfterEnd: () => {
                console.log('[ItemAutocompleteCellEditor] isCancelAfterEnd called');
                return false;
            },
        }));

        const isCancelledRef = useRef(false);

        useEffect(() => {
            inputRef.current?.focus();
            if (initialChar) setQuery(initialChar);

            return () => {
                if (!selectedItemRef.current && !isCancelledRef.current && props.node?.data) {
                    const row = props.node.data;
                    if (row.code !== inputValueRef.current) {
                        const updatedRow: DocumentLineItem = {
                            ...row,
                            item_id: undefined,
                            code: inputValueRef.current,
                            unit_name: undefined,
                        };
                        document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
                    }
                }
            };
        }, [initialChar, setQuery, props.node]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setInputValue(val);
            setQuery(val);
            setShowDropdown(val.length >= 1);
            selectedItemRef.current = false;
            setSelectedIndex(-1);
        };

        const handleSelectItem = useCallback((item: ItemSearchResult) => {
            if (!props.node?.data) return;
            setInputValue(item.name);
            setShowDropdown(false);
            selectedItemRef.current = true;

            const row = props.node.data;
            const price = operation === 'sale'
                ? item.sale_price
                : (item.purchase_price ?? item.sale_price);
            const updatedPrice = String(price ?? 0);
            const qty = row.quantity === '0' ? '1' : (row.quantity || '1');

            const net = Number(qty) * Number(updatedPrice);
            let taxAmount = 0;
            (item.tax_rates ?? []).forEach(t => {
                const amount = net * (t.rate / 100);
                taxAmount += t.operation === 'subtract' ? -amount : amount;
            });
            const calculatedSubtotal = (net + taxAmount).toFixed(2);

            // Build updated row — do NOT mutate props.node.data directly
            const updatedRow: DocumentLineItem = {
                ...row,
                item_id: item.id,
                code: item.name,
                description: item.description || item.name,
                unitPrice: updatedPrice,
                quantity: qty,
                unit_name: item.unit?.name,
                taxes: item.tax_rates ?? [],
                subtotal: calculatedSubtotal,
            };

            // Send the updated row to the parent via custom event
            setTimeout(() => {
                props.api.stopEditing(true); // cancel AG Grid's own commit
                document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
            }, 0);
        }, [props.node, props.api, operation]);

        const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 320 });

        // Calculate dropdown position when it opens
        useLayoutEffect(() => {
            if (showDropdown && wrapperRef.current) {
                const updatePosition = () => {
                    if (!wrapperRef.current) return;
                    const rect = wrapperRef.current.getBoundingClientRect();
                    setDropdownPos({
                        top: rect.bottom,
                        left: rect.left,
                        width: Math.max(rect.width, 320),
                    });
                };
                updatePosition();

                // Optional: update on window resize or scroll just in case
                window.addEventListener('resize', updatePosition);
                window.addEventListener('scroll', updatePosition, true);
                return () => {
                    window.removeEventListener('resize', updatePosition);
                    window.removeEventListener('scroll', updatePosition, true);
                };
            }
        }, [showDropdown]);

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                isCancelledRef.current = true;
                setShowDropdown(false);
                props.api.stopEditing(true); // cancel
                return;
            }

            if (showDropdown && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedIndex(prev => (prev === -1 ? 0 : Math.min(prev + 1, results.length - 1)));
                } else if (e.key === 'ArrowUp') {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedIndex(prev => (prev === -1 ? results.length - 1 : Math.max(prev - 1, 0)));
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    if (selectedIndex >= 0) {
                        e.stopPropagation();
                        e.preventDefault();
                        handleSelectItem(results[selectedIndex]);
                    } else {
                        // Free text — let AG Grid commit normally
                        setShowDropdown(false);
                    }
                }
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                // Free text — just let AG Grid commit normally
                setShowDropdown(false);
            }
        };

        return (
            <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        padding: '0 8px',
                        fontSize: '12px',
                        background: 'transparent',
                    }}
                    placeholder="Buscar artículo o escribir concepto…"
                />

                {showDropdown && (results.length > 0 || isLoading) && createPortal(
                    <div
                        style={{
                            position: 'fixed',
                            zIndex: 9999,
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                            background: '#fff',
                            border: '1px solid #d0d0d0',
                            borderRadius: '0 0 6px 6px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
                            maxHeight: 220,
                            overflowY: 'auto',
                        }}
                    >
                        {isLoading && (
                            <div style={{ padding: '8px 12px', fontSize: '12px', color: '#888' }}>
                                Buscando…
                            </div>
                        )}
                        {results.map((item, index) => (
                            <div
                                key={item.id}
                                onMouseDown={(e) => {
                                    e.preventDefault();  // prevent blur
                                    e.stopPropagation(); // prevent AG Grid from capturing
                                    handleSelectItem(item);
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                style={{
                                    padding: '7px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f0f0f0',
                                    fontSize: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: index === selectedIndex ? '#eef4ff' : 'transparent'
                                }}
                            >
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <strong>{item.sku}</strong>
                                    <span style={{ margin: '0 4px', color: '#aaa' }}>·</span>
                                    {item.name}
                                    {item.tax_rates.length > 0 && (
                                        <span style={{ marginLeft: 6, color: '#999', fontSize: '11px' }}>
                                            ({item.tax_rates.map(t => t.name).join(', ')})
                                        </span>
                                    )}
                                </div>
                                <span style={{ color: '#1976d2', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '11px' }}>
                                    {Number(item.sale_price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
            </div>
        );
    }
);

ItemAutocompleteCellEditor.displayName = 'ItemAutocompleteCellEditor';
