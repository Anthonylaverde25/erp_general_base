import {
	useMemo, useState, useRef, useEffect, useCallback,
	forwardRef, useImperativeHandle
} from 'react';
import { useFormContext } from 'react-hook-form';
import { DeleteOutline, Close, Add } from '@mui/icons-material';
import { IconButton, Chip, Button } from '@mui/material';
import {
	ClientSideRowModelModule,
	RowDragModule,
	TextEditorModule,
	themeAlpine,
	themeBalham,
	themeMaterial,
	themeQuartz,
	type ColDef,
	type ICellRendererParams,
	type ICellEditorParams,
	type GridApi,
	type Theme
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { DocumentGridTheme, DocumentLineItem, ItemSearchResult } from './types';
import type { DocumentFormValues } from '../../schemas/documentSchema';
import { useSearchItems } from '@/features/items/hooks/useSearchItems';
import { useDocumentCreate } from '../../context/DocumentCreateContext';

/* ─── Props ─── */
interface DocumentCreateLinesTableProps {
	gridTheme: DocumentGridTheme;
	discountEnabled: boolean;
}

/* ─── Constants ─── */
const GRID_MODULES = [ClientSideRowModelModule, RowDragModule, TextEditorModule];
const GRID_THEME_BY_OPTION: Record<DocumentGridTheme, Theme> = {
	material: themeMaterial,
	quartz: themeQuartz,
	alpine: themeAlpine,
	balham: themeBalham
};

/* ─── Helpers ─── */
function makeEmptyLine(presetId?: string): DocumentLineItem {
	return {
		id: presetId || `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

/** Collect all rows from AG Grid into an array */
function collectRows(api: GridApi<DocumentLineItem>): DocumentLineItem[] {
	const rows: DocumentLineItem[] = [];
	api.forEachNode(n => { if (n.data) rows.push(n.data); });
	return rows;
}

/* ──────────────────────────────────────────────────────────────
   Autocomplete Cell Editor
   ─ Opens on single click
   ─ First keypress goes directly into the input
   ─ Selecting an item or typing free text both work
   ─ We do NOT call stopEditing ourselves for item selection;
	 instead we mutate the row data directly and let AG Grid's
	 normal blur flow handle the commit.
────────────────────────────────────────────────────────────── */
const ItemAutocompleteCellEditor = forwardRef(
	(props: ICellEditorParams<DocumentLineItem>, ref) => {
		const { itemType, operation } = useDocumentCreate();
		const { results, setQuery, isLoading } = useSearchItems(itemType);

		const initialChar =
			props.eventKey && props.eventKey.length === 1 ? props.eventKey : '';
		const [inputValue, setInputValue] = useState(
			initialChar || (props.value as string) || ''
		);
		const [showDropdown, setShowDropdown] = useState(initialChar.length > 0);
		const [selectedIndex, setSelectedIndex] = useState(0);
		const inputRef = useRef<HTMLInputElement>(null);
		const selectedItemRef = useRef<boolean>(false);

		// Expose getValue to AG Grid — this is called when editing stops
		useImperativeHandle(ref, () => ({
			getValue: () => inputValue,
			isCancelAfterEnd: () => false,
		}));

		useEffect(() => {
			inputRef.current?.focus();
			if (initialChar) setQuery(initialChar);
		}, []);

		useEffect(() => { setSelectedIndex(0); }, [results]);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			setInputValue(val);
			setQuery(val);
			setShowDropdown(val.length >= 1);
			selectedItemRef.current = false;
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

			// Build updated row — do NOT mutate props.node.data directly
			const updatedRow: DocumentLineItem = {
				...row,
				item_id: item.id,
				code: item.sku || item.name,
				description: item.description || item.name,
				unitPrice: updatedPrice,
				quantity: qty,
				taxes: item.tax_rates ?? [],
				subtotal: String(Number(qty) * Number(updatedPrice)),
			};

			// Send the updated row to the parent via custom event
			setTimeout(() => {
				props.api.stopEditing(true); // cancel AG Grid's own commit
				document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
			}, 0);
		}, [props.node, props.api, operation]);

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				setShowDropdown(false);
				props.api.stopEditing(true); // cancel
				return;
			}

			if (showDropdown && results.length > 0) {
				if (e.key === 'ArrowDown') {
					e.stopPropagation();
					e.preventDefault();
					setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
				} else if (e.key === 'ArrowUp') {
					e.stopPropagation();
					e.preventDefault();
					setSelectedIndex(prev => Math.max(prev - 1, 0));
				} else if (e.key === 'Enter' || e.key === 'Tab') {
					e.stopPropagation();
					e.preventDefault();
					handleSelectItem(results[selectedIndex]);
				}
			} else if (e.key === 'Enter' || e.key === 'Tab') {
				// Free text — just let AG Grid commit normally
				setShowDropdown(false);
			}
		};

		return (
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
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

				{showDropdown && (results.length > 0 || isLoading) && (
					<div
						style={{
							position: 'fixed',
							zIndex: 9999,
							background: '#fff',
							border: '1px solid #d0d0d0',
							borderRadius: '6px',
							boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
							minWidth: 320,
							maxHeight: 220,
							overflowY: 'auto',
						}}
						ref={(el) => {
							if (!el || !inputRef.current) return;
							const rect = inputRef.current.getBoundingClientRect();
							el.style.top = `${rect.bottom + 2}px`;
							el.style.left = `${rect.left}px`;
							el.style.width = `${Math.max(rect.width, 320)}px`;
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
					</div>
				)}
			</div>
		);
	}
);
ItemAutocompleteCellEditor.displayName = 'ItemAutocompleteCellEditor';

/* ─── Tax Chips Cell Renderer ─── */
function TaxChipsCellRenderer({ data, api, node }: ICellRendererParams<DocumentLineItem>) {
	if (!data?.taxes || data.taxes.length === 0) {
		return <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>;
	}
	const onRemove = (taxId: number) => {
		if (data && node) {
			const updatedRow = { ...data, taxes: data.taxes.filter(t => t.id !== taxId) };
			document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
		}
	};
	return (
		<div style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', padding: '2px 0' }}>
			{data.taxes.map(tax => (
				<Chip
					key={tax.id}
					label={tax.name}
					size="small"
					onDelete={() => onRemove(tax.id)}
					deleteIcon={<Close style={{ fontSize: 11 }} />}
					sx={{
						height: 20, fontSize: '10px',
						'& .MuiChip-label': { px: '4px' },
						'& .MuiChip-deleteIcon': { margin: '0 2px 0 -2px' },
					}}
				/>
			))}
		</div>
	);
}

/* ─── Delete Cell Renderer ─── */
function DeleteCellRenderer({ data, api }: ICellRendererParams<DocumentLineItem>) {
	if (!data?.code && !data?.description) return null;
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
			<IconButton
				size="small"
				onClick={() => {
					document.dispatchEvent(new CustomEvent('doc-line-delete', { detail: data.id }));
				}}
				aria-label={`Eliminar línea ${data.id}`}
				sx={{ padding: '2px', color: '#e57373' }}
			>
				<DeleteOutline style={{ fontSize: 16 }} />
			</IconButton>
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ─ Uses local state `rows` as the source of truth
   ─ Passes `rowData` prop to AG Grid (standard React pattern)
   ─ Syncs to React Hook Form on every change
────────────────────────────────────────────────────────────── */
export default function DocumentCreateLinesTable({ gridTheme, discountEnabled }: DocumentCreateLinesTableProps) {
	const { setValue } = useFormContext<DocumentFormValues>();
	const gridApiRef = useRef<GridApi<DocumentLineItem> | null>(null);

	// Local rows state — AG Grid reads from this via rowData prop
	const [rows, setRows] = useState<DocumentLineItem[]>(() => [
		makeEmptyLine('01'),
		makeEmptyLine('02'),
	]);

	/** Sync rows → React Hook Form (one-way push) */
	const syncToForm = useCallback((currentRows: DocumentLineItem[]) => {
		setValue('lines', currentRows, { shouldDirty: true });
	}, [setValue]);

	// Listen for custom events dispatched from cell editors / renderers
	useEffect(() => {
		const handleUpdate = (e: Event) => {
			const updatedRow = (e as CustomEvent).detail as DocumentLineItem;
			setRows(prev => {
				const next = prev.map(r => r.id === updatedRow.id ? updatedRow : r);
				syncToForm(next);
				return next;
			});
		};
		const handleDelete = (e: Event) => {
			const rowId = (e as CustomEvent).detail as string;
			setRows(prev => {
				const next = prev.filter(r => r.id !== rowId);
				syncToForm(next);
				return next;
			});
		};
		document.addEventListener('doc-line-update', handleUpdate);
		document.addEventListener('doc-line-delete', handleDelete);
		return () => {
			document.removeEventListener('doc-line-update', handleUpdate);
			document.removeEventListener('doc-line-delete', handleDelete);
		};
	}, [syncToForm]);

	const defaultColDef = useMemo<ColDef<DocumentLineItem>>(() => ({
		sortable: false,
		filter: false,
		resizable: false,
		editable: false,
		cellClass: 'doc-ag-cell',
	}), []);

	const columnDefs = useMemo<ColDef<DocumentLineItem>[]>(() => {
		const cols: ColDef<DocumentLineItem>[] = [
			{
				field: 'id',
				headerName: '#',
				width: 46, minWidth: 46, maxWidth: 46,
				pinned: 'left',
				rowDrag: true,
				cellClass: 'doc-ag-cell doc-ag-cell-center doc-ag-cell-id',
			},
			{
				field: 'code',
				headerName: 'ARTÍCULO / CONCEPTO',
				flex: 1.4, minWidth: 220,
				editable: true,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell',
				cellEditor: ItemAutocompleteCellEditor,
				cellEditorPopup: false,
			},
			{
				field: 'description',
				headerName: 'DESCRIPCIÓN',
				flex: 1.6, minWidth: 200,
				editable: true,
				singleClickEdit: true,
			},
			{
				field: 'quantity',
				headerName: 'CANT.',
				width: 80, minWidth: 80,
				editable: true,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			},
			{
				field: 'unitPrice',
				headerName: 'PRECIO U.',
				width: 110, minWidth: 100,
				editable: true,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			},
		];

		if (discountEnabled) {
			cols.push({
				field: 'discount',
				headerName: 'DTO %',
				width: 90, minWidth: 80,
				editable: true,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			});
		}

		cols.push(
			{
				field: 'taxes' as any,
				headerName: 'IMPUESTOS',
				width: 180, minWidth: 150,
				cellRenderer: TaxChipsCellRenderer,
				cellClass: 'doc-ag-cell',
			},
			{
				field: 'subtotal',
				headerName: 'SUBTOTAL',
				width: 110, minWidth: 100,
				cellClass: 'doc-ag-cell doc-ag-cell-right doc-ag-cell-subtotal',
				valueGetter: (params) => {
					if (!params.data) return '0.00';
					const qty = Number(params.data.quantity) || 0;
					const price = Number(params.data.unitPrice) || 0;
					const disc = discountEnabled ? (Number(params.data.discount) || 0) : 0;
					const net = qty * price * (1 - disc / 100);
					return net.toFixed(2);
				},
			},
			{
				colId: 'actions',
				headerName: '',
				width: 40, minWidth: 40, maxWidth: 40,
				pinned: 'right',
				cellRenderer: DeleteCellRenderer,
				cellClass: 'doc-ag-cell',
			},
		);

		return cols;
	}, [discountEnabled]);

	const handleAddLine = useCallback(() => {
		const api = gridApiRef.current;
		if (api) api.stopEditing();
		const newRow = makeEmptyLine();
		setRows(prev => {
			const next = [...prev, newRow];
			syncToForm(next);
			return next;
		});
	}, [syncToForm]);

	const handleCellValueChanged = useCallback(() => {
		const api = gridApiRef.current;
		if (!api) return;
		const current = collectRows(api);
		setRows(current);
		syncToForm(current);
	}, [syncToForm]);

	const handleRowDragEnd = useCallback(() => {
		const api = gridApiRef.current;
		if (!api) return;
		const current = collectRows(api);
		setRows(current);
		syncToForm(current);
	}, [syncToForm]);

	return (
		<section className="doc-table-wrap">
			<div className="doc-lines-grid">
				<AgGridReact<DocumentLineItem>
					theme={GRID_THEME_BY_OPTION[gridTheme]}
					loadThemeGoogleFonts={false}
					modules={GRID_MODULES}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					rowData={rows}
					headerHeight={30}
					rowHeight={32}
					suppressMovableColumns
					animateRows
					rowDragManaged
					getRowId={(params) => String(params.data.id)}
					onGridReady={(params) => {
						gridApiRef.current = params.api;
						syncToForm(rows); // initial sync
					}}
					onCellValueChanged={handleCellValueChanged}
					onRowDragEnd={handleRowDragEnd}
					getRowClass={(params) =>
						params.data?.code || params.data?.description
							? 'doc-row-active'
							: 'doc-row-empty'
					}
				/>
			</div>

			<div style={{ padding: '8px', borderTop: '1px dashed #e0e0e0', marginTop: '4px' }}>
				<Button
					size="small"
					startIcon={<Add />}
					onClick={handleAddLine}
					variant="outlined"
					color="primary"
					sx={{
						fontSize: '12px',
						textTransform: 'none',
						borderRadius: '6px',
						borderStyle: 'dashed',
						borderWidth: '1.5px',
					}}
				>
					Añadir nueva línea
				</Button>
			</div>
		</section>
	);
}
