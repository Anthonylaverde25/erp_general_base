import { useMemo } from 'react';
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
import { useDocumentTableSync } from './ag-grid-components/hooks/useDocumentTableSync';

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
	const {
		rows,
		handleAddLine,
		handleCellValueChanged,
		handleRowDragEnd,
		onGridReady
	} = useDocumentTableSync();

	const { isReadOnly } = useDocumentCreate();

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
				flex: 1, minWidth: 180,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell',
				cellEditor: ItemAutocompleteCellEditor,
				cellEditorPopup: false,
			},
			{
				field: 'description',
				headerName: 'DESCRIPCIÓN',
				flex: 1, minWidth: 160,
				editable: !isReadOnly,
				singleClickEdit: true,
			},
			{
				field: 'quantity',
				headerName: 'CANT.',
				width: 80, minWidth: 80,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			},
			{
				field: 'unitPrice',
				headerName: 'PRECIO U.',
				width: 110, minWidth: 100,
				editable: !isReadOnly,
				singleClickEdit: true,
				cellClass: 'doc-ag-cell doc-ag-cell-right',
			},
		];

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
	}, [discountEnabled]);

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
					onGridReady={onGridReady}
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
					disabled={isReadOnly}
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
