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
	type DocumentGridTheme,
	type DocumentOperation,
} from "../components/create-document";
import { DocumentCreateProvider } from "../context/DocumentCreateContext";

interface DocumentCreatePageProps {
	operation: DocumentOperation;
}

export default function DocumentCreatePage({
	operation,
}: DocumentCreatePageProps) {
	const [gridTheme, setGridTheme] = useState<DocumentGridTheme>("material");
	const [discountEnabled, setDiscountEnabled] = useState(false);
	const [tableVersion, setTableVersion] = useState<"v1" | "v2">("v1");

	return (
		<DocumentCreateProvider operation={operation}>
			<Box className="doc-create-root">
				<DocumentCreateTopbar
					gridTheme={gridTheme}
					gridThemeOptions={GRID_THEME_OPTIONS}
					onGridThemeChange={setGridTheme}
				/>

				<main className="doc-create-main">
					<Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="#f5f5f5" p={1} borderRadius={1} mb={2} mx={2} mt={2}>
						<Typography variant="body2" fontWeight="bold" color="text.secondary">
							Versión de Tabla (Testing)
						</Typography>
						<ToggleButtonGroup
							size="small"
							value={tableVersion}
							exclusive
							onChange={(_, newV) => {
								if (newV) setTableVersion(newV);
							}}
							aria-label="Table version"
						>
							<ToggleButton value="v1" aria-label="Nuevo 1 (AG Grid)">
								Nuevo 1 (AG Grid)
							</ToggleButton>
							<ToggleButton value="v2" aria-label="Nuevo 2 (MUI Nativo)">
								Nuevo 2 (MUI Nativo)
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>

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
		</DocumentCreateProvider>
	);
}
