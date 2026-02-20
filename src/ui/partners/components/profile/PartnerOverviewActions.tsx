import { Button, Box } from '@mui/material';
import { Description, RequestQuote, NoteAdd, PointOfSale, ShoppingCart } from '@mui/icons-material';

const actions = [
	{ icon: <Description fontSize="small" />, label: 'Factura' },
	{ icon: <RequestQuote fontSize="small" />, label: 'Presupuesto' },
	{ icon: <NoteAdd fontSize="small" />, label: 'Nota' },
	{ icon: <PointOfSale fontSize="small" />, label: 'Venta' },
	{ icon: <ShoppingCart fontSize="small" />, label: 'Compra' }
];

export default function PartnerOverviewActions() {
	return (
		<Box className="mt-2 mb-4 flex flex-wrap items-center justify-end gap-2">
			{actions.map((item) => (
				<Button
					key={item.label}
					size="small"
					startIcon={item.icon}
					variant="outlined"
					color="inherit"
					sx={{
						textTransform: 'none',
						fontWeight: 600,
						fontSize: '0.75rem',
						color: 'text.secondary',
						py: 0.5,
						px: 1.5,
						borderRadius: 0.5,
						borderColor: 'divider',
						bgcolor: 'transparent',
						'&:hover': {
							bgcolor: 'action.hover',
							color: 'text.primary',
							borderColor: 'divider'
						}
					}}
				>
					{item.label}
				</Button>
			))}
		</Box>
	);
}
