import { useMemo, useState, useEffect } from 'react';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
	ClientSideRowModelModule,
	RowDragModule,
	TextEditorModule,
	themeAlpine,
	themeBalham,
	themeMaterial,
	themeQuartz,
	type ColDef,
	type Theme
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { DocumentGridTheme, DocumentLineItem } from './types';
import { useDocumentCreate } from '../../context/DocumentCreateContext';
import { ItemAutocompleteCellEditor } from './ag-grid-components/cell-editors/ItemAutocompleteCellEditor';
import { TaxChipsCellRenderer } from './ag-grid-components/cell-renderers/TaxChipsCellRenderer';
import { DeleteCellRenderer } from './ag-grid-components/cell-renderers/DeleteCellRenderer';
import { QuantityCellRenderer } from './ag-grid-components/cell-renderers/QuantityCellRenderer';
import { SerialNumbersCellRenderer } from './ag-grid-components/cell-renderers/SerialNumbersCellRenderer';
import { useDocumentTableSync } from './ag-grid-components/hooks/useDocumentTableSync';
import SerialNumbersModal from './SerialNumbersModal';

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

/* ──────────────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────────────── */
export default function DocumentCreateLinesTable({ gridTheme, discountEnabled }: DocumentCreateLinesTableProps) {
	const { rows, handleAddLine } = useDocumentTableSync();
	const { isReadOnly, itemType } = useDocumentCreate();

	const [activeLineItemForSerials, setActiveLineItemForSerials] = useState<DocumentLineItem | null>(null);
	const [serialsModalOpen, setSerialsModalOpen] = useState(false);

	useEffect(() => {
		const handleOpenSerials = (e: Event) => {
			const data = (e as CustomEvent).detail as DocumentLineItem;
			// Find the current live row data from our rows state to ensure it has updated serials/quantities
			const liveRow = rows.find(r => r.id === data.id) || data;
			setActiveLineItemForSerials(liveRow);
			setSerialsModalOpen(true);
		};
		document.addEventListener('doc-line-open-serials', handleOpenSerials);
		return () => {
			document.removeEventListener('doc-line-open-serials', handleOpenSerials);
		};
	}, [rows]);

	// Group rows by source_document_id
	const sections = useMemo(() => {
		const groups: Record<string, { id: string, number: string, items: DocumentLineItem[] }> = {};
		const noSource: DocumentLineItem[] = [];

		rows.forEach(row => {
			if (row.source_document_id) {
				if (!groups[row.source_document_id]) {
					groups[row.source_document_id] = {
						id: row.source_document_id,
						number: row.source_document_number || 'S/N',
						items: []
					};
				}
				groups[row.source_document_id].items.push(row);
			} else {
				noSource.push(row);
			}
		});

		const result = Object.values(groups);
		if (noSource.length > 0 || result.length === 0) {
			result.push({ id: 'default', number: '', items: noSource });
		}
		return result;
	}, [rows]);

	return (
		<section className="doc-table-wrap">
			{sections.map((section) => (
				<DocumentTableSection
					key={section.id}
					section={section}
					gridTheme={gridTheme}
					discountEnabled={discountEnabled}
					isReadOnly={isReadOnly}
					itemType={itemType}
				/>
			))}

			<div className="flex items-center p-2 border px-4">
				<Button
					size="small"
					disabled={isReadOnly}
					startIcon={<Add />}
					onClick={handleAddLine}
					variant='contained'
					sx={{
						fontSize: '12px',
						textTransform: 'none',
						borderRadius: '6px',
						border: '1px solid',
						borderColor: 'primary.main',
						px: 2,
					}}
				>
					Añadir nueva línea
				</Button>
			</div>

			<SerialNumbersModal
				open={serialsModalOpen}
				onClose={() => setSerialsModalOpen(false)}
				lineItem={activeLineItemForSerials}
			/>
		</section>
	);
}

/* ─── Sub-component for each section ─── */
interface SectionProps {
	key?: string;
	section: { id: string, number: string, items: DocumentLineItem[] };
	gridTheme: DocumentGridTheme;
	discountEnabled: boolean;
	isReadOnly: boolean;
	itemType: "product" | "service";
}

const DocumentTableSection = ({ section, gridTheme, discountEnabled, isReadOnly, itemType }: SectionProps) => {
	const {
		handleCellValueChanged,
		handleRowDragEnd,
		onGridReady
	} = useDocumentTableSync();

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
				rowDrag: !isReadOnly,
				cellClass: 'doc-ag-cell doc-ag-cell-center doc-ag-cell-id',
			},
			{
				field: 'code',
				headerName: 'ARTÍCULO / CONCEPTO',
				flex: 1, minWidth: 144,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell',
				cellEditor: ItemAutocompleteCellEditor,
				cellEditorPopup: false,
				valueSetter: (params) => {
					if (!params.data) return false;
					if (params.data.code === params.newValue) return false;
					params.data.code = params.newValue;
					params.data.item_id = undefined;
					params.data.unit_name = undefined;
					return true;
				},
			},
			{
				field: 'description',
				headerName: 'DESCRIPCIÓN',
				flex: 1, minWidth: 144,
				editable: !isReadOnly,
				singleClickEdit: true,
			},
			{
				field: 'quantity',
				headerName: 'CANT.',
				width: 80, minWidth: 80,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellRenderer: QuantityCellRenderer,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			},
			{
				field: 'unit_name' as any,
				headerName: 'UD.',
				width: 60, minWidth: 60,
				editable: false,
				cellClass: 'doc-ag-cell doc-ag-cell-center text-[10px] text-gray-500',
				valueFormatter: (params) => params.value || '-',
			},
		];

		if (itemType === 'product') {
			cols.push({
				field: 'serial_numbers' as any,
				headerName: 'SERIES',
				width: 120, minWidth: 100,
				cellRenderer: SerialNumbersCellRenderer,
				cellClass: 'doc-ag-cell doc-ag-cell-center',
			});
		}

		cols.push({
			field: 'unitPrice',
			headerName: 'PRECIO U.',
			width: 110, minWidth: 100,
			editable: !isReadOnly,
			singleClickEdit: true,
			cellClass: 'doc-ag-cell doc-ag-cell-right',
		});

		if (discountEnabled) {
			cols.push({
				field: 'discount',
				headerName: 'DTO %',
				width: 90, minWidth: 80,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			});
		}

		cols.push(
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				field: 'taxes' as any,
				headerName: 'IMPUESTOS',
				width: 240, minWidth: 200,
				cellRenderer: TaxChipsCellRenderer,
				cellClass: 'doc-ag-cell doc-ag-cell-taxes',
				autoHeight: true,
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
					let taxAmount = 0;
					(params.data.taxes || []).forEach(t => {
						const amount = net * (t.rate / 100);
						taxAmount += t.operation === 'subtract' ? -amount : amount;
					});
					return (net + taxAmount).toFixed(2);
				},
			},
			{
				colId: 'actions',
				headerName: '',
				width: 40, minWidth: 40, maxWidth: 40,
				pinned: 'right',
				cellRenderer: DeleteCellRenderer,
				cellClass: 'doc-ag-cell',
				hide: isReadOnly,
			},
		);

		return cols;
	}, [discountEnabled, isReadOnly]);

	return (
		<div className="doc-section-container  h-[100%]" style={{ marginBottom: '1.5rem' }}>
			{section.number && (
				<div className="doc-section-header">
					<span className="doc-section-label">ALBARÁN:</span>
					<span className="doc-section-value">{section.number}</span>
				</div>
			)}
			<div className="doc-lines-grid" style={{ height: 'auto', minHeight: '100px' }}>
				<AgGridReact<DocumentLineItem>
					theme={GRID_THEME_BY_OPTION[gridTheme]}
					loadThemeGoogleFonts={false}
					modules={GRID_MODULES}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					rowData={section.items}
					headerHeight={30}
					rowHeight={32}
					domLayout="autoHeight"
					suppressMovableColumns
					animateRows
					rowDragManaged
					getRowId={(params) => String(params.data.id)}
					onGridReady={onGridReady}
					onCellValueChanged={handleCellValueChanged}
					onRowDragEnd={handleRowDragEnd}
					getRowClass={(params) => {
						return params.data?.code || params.data?.description
							? 'doc-row-active'
							: 'doc-row-empty';
					}}
				/>
			</div>
		</div>
	);
}
