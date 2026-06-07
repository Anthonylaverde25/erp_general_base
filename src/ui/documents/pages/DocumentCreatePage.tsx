import { useState } from "react";
import { Box, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import "./DocumentCreatePage.css";
import {
	DocumentCreateFooter,
	DocumentCreateLinesTable,
	DocumentCreateLinesTableMui,
	DocumentCreateMetaGrid,
	DocumentCreateTopbar,
	GRID_THEME_OPTIONS,
	StockResolutionModal,
	type DocumentGridTheme,
	type DocumentOperation,
} from "../components/create-document";
import { DocumentCreateProvider, useDocumentCreate } from "../context/DocumentCreateContext";

interface DocumentCreatePageProps {
	operation: DocumentOperation;
	documentId?: string;
}

export default function DocumentCreatePage({
	operation,
	documentId,
}: DocumentCreatePageProps) {
	const [gridTheme, setGridTheme] = useState<DocumentGridTheme>("alpine");
	const [discountEnabled, setDiscountEnabled] = useState(false);
	const [tableVersion, setTableVersion] = useState<"v1" | "v2">("v1");

	return (
		<DocumentCreateProvider operation={operation} documentId={documentId}>
			<Box className="doc-create-root">
				<DocumentCreateTopbar
					gridTheme={gridTheme}
					gridThemeOptions={GRID_THEME_OPTIONS}
					onGridThemeChange={setGridTheme}
				/>

				<main className="doc-create-main">
					<DocumentCreateMetaGrid />

					{tableVersion === "v1" ? (
						<DocumentCreateLinesTable
							gridTheme={gridTheme}
							discountEnabled={discountEnabled}
						/>
					) : (
						<DocumentCreateLinesTableMui
							discountEnabled={discountEnabled}
						/>
					)}

					<DocumentCreateFooter
						discountEnabled={discountEnabled}
						onDiscountEnabledChange={setDiscountEnabled}
					/>
				</main>
			</Box>
			<StockResolutionModalWrapper />
		</DocumentCreateProvider>
	);
}

function StockResolutionModalWrapper() {
	const { stockConflicts, setStockConflicts } = useDocumentCreate();
	return (
		<StockResolutionModal
			open={!!stockConflicts}
			onClose={() => setStockConflicts(null)}
		/>
	);
}
