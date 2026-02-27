import { MouseEvent, useState } from 'react';
import { Add, ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import PageBreadcrumb from '@/components/PageBreadcrumb';

export type DocumentsHeaderProps = {
	operation: 'purchase' | 'sale';
	onCreate?: () => void;
	onCreateInvoice?: () => void;
	onCreateDraft?: () => void;
};

const HEADER_COPY: Record<DocumentsHeaderProps['operation'], { title: string; subtitle: string }> = {
	purchase: {
		title: 'Documentos de Compra',
		subtitle: 'Gestiona los documentos de compra'
	},
	sale: {
		title: 'Documentos de Venta',
		subtitle: 'Gestiona los documentos de venta'
	}
};

function DocumentsHeader({ operation, onCreate, onCreateInvoice, onCreateDraft }: DocumentsHeaderProps) {
	const theme = useTheme();
	const copy = HEADER_COPY[operation];
	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(menuAnchorEl);

	const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
		setMenuAnchorEl((current) => (current ? null : event.currentTarget));
	};

	const handleMenuClose = () => {
		setMenuAnchorEl(null);
	};

	const handleCreateInvoice = () => {
		onCreateInvoice?.();
		handleMenuClose();
	};

	const handleCreateDraft = () => {
		onCreateDraft?.();
		handleMenuClose();
	};

	return (
		<Box
			className="container"
			sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
		>
			<PageBreadcrumb className="mb-4" />
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
			>
				<Box>
					<Typography
						variant="h2"
						className="text-3xl font-bold tracking-tight"
					>
						{copy.title}
					</Typography>
					<Typography
						variant="subtitle1"
						color="text.secondary"
					>
						{copy.subtitle}
					</Typography>
				</Box>
				{operation === 'sale' ? (
					<>
						<ButtonGroup
							variant="contained"
							color="secondary"
							size="small"
							disableElevation
						>
							<Button
								onClick={handleCreateInvoice}
								sx={{ textTransform: 'none', fontWeight: 600, gap: 1 }}
							>
								<Add sx={{ fontSize: 18 }} />
								Crear factura
							</Button>
							<Button
								size="small"
								aria-controls={isMenuOpen ? 'create-invoice-menu' : undefined}
								aria-expanded={isMenuOpen ? 'true' : undefined}
								aria-haspopup="menu"
								onClick={handleMenuToggle}
								sx={{ minWidth: 36, px: 0.5 }}
							>
								<ArrowDropDown />
							</Button>
						</ButtonGroup>
						<Menu
							id="create-invoice-menu"
							anchorEl={menuAnchorEl}
							open={isMenuOpen}
							onClose={handleMenuClose}
						>
							<MenuItem onClick={handleCreateInvoice}>Crear factura</MenuItem>
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
						sx={{ textTransform: 'none', fontWeight: 600, gap: 1 }}
					>
						<Add sx={{ fontSize: 18 }} />
						Nuevo Documento
					</Button>
				)}
			</Stack>
		</Box>
	);
}

export default DocumentsHeader;
