import { ArrowBack } from '@mui/icons-material';
import { Button, FormControl, IconButton, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import type { DocumentGridTheme, DocumentGridThemeOption } from './types';
import { useDocumentCreate } from '../../context/DocumentCreateContext';
import { useNavigate, useSearchParams } from 'react-router';

interface DocumentCreateTopbarProps {
	gridTheme: DocumentGridTheme;
	gridThemeOptions: DocumentGridThemeOption[];
	onGridThemeChange: (theme: DocumentGridTheme) => void;
}

const SHORTCUTS = [
	{ key: 'F2', label: 'GUARDAR' },
	{ key: 'F8', label: 'IMPRIMIR' },
	{ key: 'F10', label: 'CONTABILIZAR' }
];

export default function DocumentCreateTopbar({
	gridTheme,
	gridThemeOptions,
	onGridThemeChange,
}: DocumentCreateTopbarProps) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const fromDocumentId = searchParams.get("from_document_id");
	const {
		currentDocumentType,
		copy,
		isDraftMode,
		itemType,
		isCreating,
		onSubmitDraft,
		onSubmitIssue,
		isReadOnly
	} = useDocumentCreate();

	const handleThemeChange = (event: SelectChangeEvent) => {
		onGridThemeChange(event.target.value as DocumentGridTheme);
	};

	const itemTypeLabel = itemType === 'service' ? 'Servicios' : 'Artículos';
	const title = currentDocumentType
		? fromDocumentId
			? `Conversión: ${currentDocumentType.name} (${itemTypeLabel})`
			: `Nuevo: ${currentDocumentType.name} (${itemTypeLabel})`
		: copy.title;

	const statusLabel = isReadOnly ? "SOLO LECTURA" : (isDraftMode ? "BORRADOR" : "NUEVO");
	const primaryActionLabel = isDraftMode
		? "Guardar Borrador"
		: copy.primaryAction;

	return (
		<header className="doc-create-topbar">
			<div className="doc-create-topbar-left">
				<IconButton
					size="small"
					onClick={() => navigate(-1)}
					className="doc-back-button"
					aria-label="Volver"
				>
					<ArrowBack fontSize="small" />
				</IconButton>

				<div className="doc-create-brand">
					<span className="doc-create-brand-main">EnterpriseSuite</span>
					<span className="doc-create-brand-sub">ERP v4.1</span>
				</div>

				<div className="doc-create-title-wrap">
					<h1>{title}</h1>
					<span className="doc-create-status" style={{ backgroundColor: isReadOnly ? '#94a3b8' : undefined }}>
						{statusLabel}
					</span>
				</div>
			</div>

			<div className="doc-create-topbar-right">
				{!isReadOnly && (
					<div className="doc-shortcuts">
						{SHORTCUTS.map((shortcut) => (
							<div
								key={shortcut.key}
								className="doc-shortcut"
							>
								<span className="doc-key">{shortcut.key}</span>
								<span>{shortcut.label}</span>
							</div>
						))}
					</div>
				)}

				{!isReadOnly && (
					<Button
						variant="outlined"
						size="small"
						className="doc-action-secondary"
						onClick={onSubmitDraft}
						disabled={isCreating}
					>
						{isCreating ? 'Guardando...' : 'Guardar Borrador'}
					</Button>
				)}
				<FormControl
					size="small"
					className="doc-theme-select"
				>
					<Select
						value={gridTheme}
						onChange={handleThemeChange}
						displayEmpty
						aria-label="Theme de tabla"
					>
						{gridThemeOptions.map((option) => (
							<MenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{!isReadOnly && (
					<Button
						variant="contained"
						size="small"
						color="secondary"
						className="doc-action-primary"
						onClick={onSubmitIssue}
						disabled={isCreating}
					>
						{isCreating ? 'Procesando...' : primaryActionLabel}
					</Button>
				)}
			</div>
		</header>
	);
}
