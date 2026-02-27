import { useMemo } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
	ClientSideRowModelModule,
	RowDragModule,
	SelectEditorModule,
	TextEditorModule,
	themeAlpine,
	themeBalham,
	themeMaterial,
	themeQuartz,
	type ColDef,
	type ICellRendererParams,
	type Theme
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { DocumentGridTheme, DocumentLineItem } from './types';

interface DocumentCreateLinesTableProps {
	rows: DocumentLineItem[];
	prefilledRowsCount: number;
	taxOptions: string[];
	gridTheme: DocumentGridTheme;
}

interface DocumentLineGridRow extends DocumentLineItem {
	isPrefilled: boolean;
}

const GRID_MODULES = [ClientSideRowModelModule, RowDragModule, TextEditorModule, SelectEditorModule];
const GRID_THEME_BY_OPTION: Record<DocumentGridTheme, Theme> = {
	material: themeMaterial,
	quartz: themeQuartz,
	alpine: themeAlpine,
	balham: themeBalham
};

function DeleteCellRenderer({ data }: ICellRendererParams<DocumentLineGridRow>) {
	if (!data?.isPrefilled) {
		return null;
	}

	return (
		<div className="doc-ag-actions">
			<IconButton
				size="small"
				className="doc-delete-button"
				aria-label={`Eliminar línea ${data.id}`}
			>
				<DeleteOutline fontSize="inherit" />
			</IconButton>
		</div>
	);
}

export default function DocumentCreateLinesTable({
	rows,
	prefilledRowsCount,
	taxOptions,
	gridTheme
}: DocumentCreateLinesTableProps) {
	const rowData = useMemo<DocumentLineGridRow[]>(
		() =>
			rows.map((row, index) => ({
				...row,
				isPrefilled: index < prefilledRowsCount
			})),
		[rows, prefilledRowsCount]
	);

	const defaultColDef = useMemo<ColDef<DocumentLineGridRow>>(
		() => ({
			editable: true,
			sortable: false,
			filter: false,
			resizable: false,
			cellClass: 'doc-ag-cell'
		}),
		[]
	);

	const columnDefs = useMemo<ColDef<DocumentLineGridRow>[]>(
		() => [
			{
				field: 'id',
				headerName: '#',
				width: 46,
				minWidth: 46,
				maxWidth: 46,
				editable: false,
				pinned: 'left',
				rowDrag: true,
				cellClass: 'doc-ag-cell doc-ag-cell-center doc-ag-cell-id'
			},
			{
				field: 'code',
				headerName: 'ARTÍCULO / CONCEPTO',
				flex: 1.2,
				minWidth: 210,
				cellClass: 'doc-ag-cell doc-ag-cell-medium'
			},
			{
				field: 'description',
				headerName: 'DESCRIPCIÓN ADICIONAL',
				flex: 1.8,
				minWidth: 260
			},
			{
				field: 'quantity',
				headerName: 'CANT.',
				width: 90,
				minWidth: 90,
				cellClass: 'doc-ag-cell doc-ag-cell-right doc-ag-cell-primary doc-ag-cell-bold'
			},
			{
				field: 'unitPrice',
				headerName: 'PRECIO U.',
				width: 118,
				minWidth: 118,
				cellClass: 'doc-ag-cell doc-ag-cell-right'
			},
			{
				field: 'discount',
				headerName: 'DTO %',
				width: 90,
				minWidth: 90,
				cellClass: 'doc-ag-cell doc-ag-cell-right'
			},
			{
				field: 'taxType',
				headerName: 'TIPO IVA',
				width: 128,
				minWidth: 128,
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: {
					values: taxOptions
				},
				cellClass: 'doc-ag-cell'
			},
			{
				field: 'subtotal',
				headerName: 'SUBTOTAL',
				width: 120,
				minWidth: 120,
				editable: false,
				cellClass: 'doc-ag-cell doc-ag-cell-right doc-ag-cell-subtotal'
			},
			{
				colId: 'actions',
				headerName: '',
				width: 44,
				minWidth: 44,
				maxWidth: 44,
				editable: false,
				sortable: false,
				filter: false,
				pinned: 'right',
				cellClass: 'doc-ag-cell',
				cellRenderer: DeleteCellRenderer
			}
		],
		[taxOptions]
	);

	return (
		<section className="doc-table-wrap">
			<div className="doc-lines-grid">
				<AgGridReact<DocumentLineGridRow>
					theme={GRID_THEME_BY_OPTION[gridTheme]}
					loadThemeGoogleFonts={false}
					modules={GRID_MODULES}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					headerHeight={30}
					rowHeight={30}
					suppressMovableColumns
					animateRows
					rowDragManaged
					stopEditingWhenCellsLoseFocus
					getRowClass={(params) => (params.data?.isPrefilled ? 'doc-row-active' : 'doc-row-empty')}
				/>
			</div>
		</section>
	);
}
