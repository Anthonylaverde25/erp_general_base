import { MouseEvent, useState } from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import { Plus, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export type DocumentsHeaderProps = {
	operation: 'purchase' | 'sale';
	onCreate?: () => void;
	onCreateInvoice?: () => void;
	onCreateDraft?: () => void;
	title?: string;
};

const HEADER_COPY: Record<DocumentsHeaderProps['operation'], { title: string; subtitle: string }> = {
	purchase: {
		title: 'Documentos de Compra',
		subtitle: 'Gestiona los documentos de compra.'
	},
	sale: {
		title: 'Documentos de Venta',
		subtitle: 'Gestiona los documentos de venta.'
	}
};

function DocumentsHeader({ operation, onCreate, onCreateInvoice, onCreateDraft, title }: DocumentsHeaderProps) {
	const copy = HEADER_COPY[operation];
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(menuAnchorEl);

	const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
		setMenuAnchorEl((current) => (current ? null : event.currentTarget));
	};

	const handleMenuClose = () => {
		setMenuAnchorEl(null);
	};

	const handleCreatePrimary = () => {
		if (onCreate) {
			onCreate();
		} else if (onCreateInvoice) {
			onCreateInvoice();
		}
		handleMenuClose();
	};

	const handleCreateDraft = () => {
		onCreateDraft?.();
		handleMenuClose();
	};

	const hasAction = Boolean(onCreate || onCreateInvoice || onCreateDraft);

	const actions = !hasAction ? null : (operation === 'sale' ? (
		<>
			<ButtonGroup
				variant="contained"
				color="secondary"
				size="small"
				disableElevation
				sx={{ borderRadius: '4px' }}
			>
				<Button
					onClick={handleCreatePrimary}
					sx={{ textTransform: 'none', fontWeight: 800, gap: 1, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
					startIcon={<Plus size={18} />}
				>
					Nuevo
				</Button>
				<Button
					size="small"
					aria-controls={isMenuOpen ? 'create-invoice-menu' : undefined}
					aria-expanded={isMenuOpen ? 'true' : undefined}
					aria-haspopup="menu"
					onClick={handleMenuToggle}
					sx={{ minWidth: 36, px: 0.5, borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}
				>
					<ChevronDown size={16} />
				</Button>
			</ButtonGroup>
			<Menu
				id="create-invoice-menu"
				anchorEl={menuAnchorEl}
				open={isMenuOpen}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={handleCreatePrimary}>Nuevo</MenuItem>
				<MenuItem onClick={handleCreateDraft}>Crear borrador</MenuItem>
			</Menu>
		</>
	) : (
		<Button
			onClick={onCreate}
			variant="contained"
			color="secondary"
			size="small"
			disableElevation
			startIcon={<Plus size={18} />}
			sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px' }}
		>
			Nuevo Documento
		</Button>
	));

	return (
		<PageHeader
			title={title || copy.title}
			subtitle={copy.subtitle}
			actions={actions}
		/>
	);
}

export default DocumentsHeader;
