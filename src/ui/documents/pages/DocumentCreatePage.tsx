import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box } from '@mui/material';
import {
	buildDocumentRows,
	COPY_BY_OPERATION,
	CURRENCY_OPTIONS,
	DocumentCreateFooter,
	DocumentCreateLinesTable,
	DocumentCreateMetaGrid,
	DocumentCreateTopbar,
	FOOTER_TOTALS,
	GRID_THEME_OPTIONS,
	LINE_ITEMS,
	PARTY_OPTIONS,
	TAX_OPTIONS,
	type DocumentGridTheme,
	type DocumentOperation
} from '../components/create-document';
import './DocumentCreatePage.css';

interface DocumentCreatePageProps {
	operation: DocumentOperation;
}

export default function DocumentCreatePage({ operation }: DocumentCreatePageProps) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get('mode');
	const copy = COPY_BY_OPERATION[operation];
	const [gridTheme, setGridTheme] = useState<DocumentGridTheme>('material');

	const rows = useMemo(() => buildDocumentRows(LINE_ITEMS), []);
	const isDraftMode = operation === 'sale' && mode === 'draft';
	const primaryActionLabel = isDraftMode ? 'Guardar Borrador' : copy.primaryAction;
	const documentNumber = isDraftMode ? 'BOR-2026-0001' : copy.documentNumber;
	const statusLabel = isDraftMode ? 'BORRADOR' : 'NUEVO';

	return (
		<Box className="doc-create-root">
			<DocumentCreateTopbar
				title={copy.title}
				statusLabel={statusLabel}
				primaryActionLabel={primaryActionLabel}
				gridTheme={gridTheme}
				gridThemeOptions={GRID_THEME_OPTIONS}
				onGridThemeChange={setGridTheme}
				onBack={() => navigate(-1)}
			/>

			<main className="doc-create-main">
				<DocumentCreateMetaGrid
					partyLabel={copy.partyLabel}
					partyOptions={PARTY_OPTIONS}
					documentNumber={documentNumber}
					currencyOptions={CURRENCY_OPTIONS}
					topTotal={copy.topTotal}
				/>

				<DocumentCreateLinesTable
					rows={rows}
					prefilledRowsCount={LINE_ITEMS.length}
					taxOptions={TAX_OPTIONS}
					gridTheme={gridTheme}
				/>

				<DocumentCreateFooter totals={FOOTER_TOTALS} />
			</main>
		</Box>
	);
}
