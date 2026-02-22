import { Box, Button } from '@mui/material';
import { Description, NoteAdd, PointOfSale, RequestQuote, ShoppingCart } from '@mui/icons-material';

const ACTIONS = [
	{ icon: <Description fontSize="small" />, label: 'Ficha' },
	{ icon: <RequestQuote fontSize="small" />, label: 'Presupuesto' },
	{ icon: <NoteAdd fontSize="small" />, label: 'Nota' },
	{ icon: <PointOfSale fontSize="small" />, label: 'Venta' },
	{ icon: <ShoppingCart fontSize="small" />, label: 'Compra' }
];

export default function ItemOverviewActions() {
	return (
		<Box className="mt-2 mb-4 flex flex-wrap items-center justify-end gap-2">
			{ACTIONS.map((action) => (
				<Button
					key={action.label}
					variant="outlined"
					color="inherit"
					size="small"
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
					className="flex items-center gap-2"
				>
					{action.icon}
					{action.label}
				</Button>
			))}
		</Box>
	);
}
