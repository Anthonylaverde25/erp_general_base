import { ArrowBack } from '@mui/icons-material';
import { Button, FormControl, IconButton, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import type { DocumentGridTheme, DocumentGridThemeOption } from './types';

interface DocumentCreateTopbarProps {
	title: string;
	statusLabel: string;
	primaryActionLabel: string;
	gridTheme: DocumentGridTheme;
	gridThemeOptions: DocumentGridThemeOption[];
	onGridThemeChange: (theme: DocumentGridTheme) => void;
	onBack: () => void;
}

const SHORTCUTS = [
	{ key: 'F2', label: 'GUARDAR' },
	{ key: 'F8', label: 'IMPRIMIR' },
	{ key: 'F10', label: 'CONTABILIZAR' }
];

export default function DocumentCreateTopbar({
	title,
	statusLabel,
	primaryActionLabel,
	gridTheme,
	gridThemeOptions,
	onGridThemeChange,
	onBack
}: DocumentCreateTopbarProps) {
	const handleThemeChange = (event: SelectChangeEvent) => {
		onGridThemeChange(event.target.value as DocumentGridTheme);
	};

	return (
		<header className="doc-create-topbar">
			<div className="doc-create-topbar-left">
				<IconButton
					size="small"
					onClick={onBack}
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
					<span className="doc-create-status">{statusLabel}</span>
				</div>
			</div>

			<div className="doc-create-topbar-right">
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

				<Button
					variant="outlined"
					size="small"
					className="doc-action-secondary"
				>
					Guardar Borrador
				</Button>
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
				<Button
					variant="contained"
					size="small"
					color="secondary"
					className="doc-action-primary"
				>
					{primaryActionLabel}
				</Button>
			</div>
		</header>
	);
}
