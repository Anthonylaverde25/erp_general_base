import { useRef, useEffect } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import { Box, Tooltip, Button } from '@mui/material';
import { useDocumentCreate } from '../../../../context/DocumentCreateContext';

interface SerialNumbersCellRendererProps extends ICellRendererParams<DocumentLineItem> {
	isReadOnly?: boolean;
	documentTypeCode?: string;
}

const labelStyle = {
	fontSize: '11px',
	color: '#334155',
	fontWeight: 600,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	maxWidth: '100px',
	display: 'inline-block'
} as const;

export function SerialNumbersCellRenderer({ data, isReadOnly, documentTypeCode }: SerialNumbersCellRendererProps) {
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const btn = buttonRef.current;

		if (!btn) return;

		const stopPropagation = (e: Event) => {
			e.stopPropagation();
			e.stopImmediatePropagation();
		};

		const handleClick = (e: Event) => {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();

			// Dispatch event to open serial numbers modal
			document.dispatchEvent(new CustomEvent('doc-line-open-serials', { detail: data }));
		};

		btn.addEventListener('click', handleClick);
		btn.addEventListener('mousedown', stopPropagation);

		return () => {
			btn.removeEventListener('click', handleClick);
			btn.removeEventListener('mousedown', stopPropagation);
		};
	}, [data]);

	if (!data || !data.item_id || !data.has_serials) {
		return <span style={{ color: '#aaa', fontSize: '11px' }}>-</span>;
	}

	const qty = Math.max(1, Math.floor(Number(data.quantity) || 1));
	const enteredSerialsCount = data.serial_numbers?.length || 0;
	const isComplete = enteredSerialsCount === qty;

	const { lineSerializationInfo } = useDocumentCreate();
	const serializationInfo = data?.id ? lineSerializationInfo[data.id] : undefined;

	const isSalesInvoiceFlow = ['INV', 'TKT', 'CRN', 'PINV', 'PCRN'].includes(documentTypeCode || '');
	const isSeriesReadOnly = isReadOnly || (isSalesInvoiceFlow && !!data.source_document_id);

	if (isSeriesReadOnly) {
		if (enteredSerialsCount > 0) {
			return (
				<Tooltip
					title={data.serial_numbers?.join(', ') || ''}
					arrow
				>
					<span style={labelStyle}>{data.serial_numbers?.join(', ')}</span>
				</Tooltip>
			);
		}

		return <span style={{ color: '#aaa', fontSize: '11px' }}>-</span>;
	}

	let buttonColor: 'success' | 'warning' | 'info' = 'warning';
	let buttonIcon = <ShieldAlert size={14} />;
	let textColor = '#d97706';
	let borderColor = '#fef3c7';
	let bgColor = '#fffbeb';
	let hoverBg = '#fef3c7';
	let hoverBorder = '#fde047';
	let buttonText = `${enteredSerialsCount} / ${qty} Series`;
	let tooltipText = `Series pendientes: faltan ${qty - enteredSerialsCount} de ${qty} por registrar. Haga clic para ingresar.`;

	if (isComplete) {
		buttonColor = 'success';
		buttonIcon = <ShieldCheck size={14} />;
		textColor = '#16a34a';
		borderColor = '#bbf7d0';
		bgColor = '#f0fdf4';
		hoverBg = '#dcfce7';
		hoverBorder = '#86efac';
		buttonText = `${enteredSerialsCount} / ${qty} Series`;
		tooltipText = `Todas las series registradas (${enteredSerialsCount} de ${qty}). Haga clic para editar.`;
	} else if (serializationInfo && serializationInfo.available_count > 0) {
		if (enteredSerialsCount === 0) {
			buttonColor = 'info';
			buttonIcon = <ShieldCheck size={14} />;
			textColor = '#005483'; // SAP Blue
			borderColor = '#bae6fd';
			bgColor = '#f0f9ff';
			hoverBg = '#e0f2fe';
			hoverBorder = '#7dd3fc';
			buttonText = `Seleccionar · ${serializationInfo.available_count} disponibles`;
			tooltipText = `Hay series registradas en el sistema para este artículo. Haga clic para seleccionar.`;
		} else {
			buttonColor = 'warning';
			buttonIcon = <ShieldAlert size={14} />;
			textColor = '#d97706';
			borderColor = '#fef3c7';
			bgColor = '#fffbeb';
			hoverBg = '#fef3c7';
			hoverBorder = '#fde047';
			buttonText = `${enteredSerialsCount}/${qty} · ${serializationInfo.available_count} disp.`;
			tooltipText = `Series parciales. Registradas ${enteredSerialsCount} de ${qty}. Haga clic para seleccionar del inventario.`;
		}
	}

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			width="100%"
			height="100%"
		>
			<Tooltip
				title={tooltipText}
				arrow
			>
				<Button
					ref={buttonRef}
					size="small"
					variant="outlined"
					color={buttonColor}
					startIcon={buttonIcon}
					sx={{
						fontSize: '10px',
						textTransform: 'none',
						py: '2px',
						px: '6px',
						height: '22px',
						borderRadius: '4px', // Sharp Edges: as per AGENTS.md
						fontWeight: 700,
						color: textColor,
						borderColor: borderColor,
						bgcolor: bgColor,
						'&:hover': {
							bgcolor: hoverBg,
							borderColor: hoverBorder
						}
					}}
				>
					{buttonText}
				</Button>
			</Tooltip>
		</Box>
	);
}
