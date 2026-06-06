import { Box, Typography } from '@mui/material';
import DragHandle from '../DragHandle';

const stockItems = [
	{ name: 'Cable de red Cat6', min: 50, current: 12 },
	{ name: 'Router Wifi AC1200', min: 10, current: 2 },
	{ name: 'Switch 24 puertos', min: 5, current: 0 },
	{ name: 'Monitor 24 pulgadas', min: 15, current: 4 },
	{ name: 'Teclado mecánico', min: 20, current: 5 },
];

type CriticalStockCardProps = {
	isEditing: boolean;
};

/**
 * Critical stock card listing items below their minimum stock threshold.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function CriticalStockCard({ isEditing }: CriticalStockCardProps) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header with alert badge */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Typography variant="subtitle1" fontWeight={600}>
						Stock Crítico
					</Typography>
					<Typography
						variant="caption"
						sx={{
							bgcolor: 'error.main',
							color: 'error.contrastText',
							px: 1,
							py: 0.5,
							borderRadius: 1,
							fontWeight: 600,
						}}
					>
						{stockItems.length} Alertas
					</Typography>
				</Box>
				{isEditing && <DragHandle />}
			</Box>
			<Typography variant="body2" color="text.secondary" gutterBottom>
				Artículos por debajo del stock mínimo
			</Typography>

			{/* Scrollable list */}
			<Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flexGrow: 1, mt: 1 }}>
				{stockItems.map((item, idx) => (
					<Box
						key={idx}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							py: 1.5,
							borderBottom: idx !== stockItems.length - 1 ? '1px solid' : 'none',
							borderColor: 'divider',
						}}
					>
						<Box>
							<Typography variant="body2" fontWeight={500}>
								{item.name}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Mínimo: {item.min}
							</Typography>
						</Box>
						<Typography variant="body2" color="error.main" fontWeight={600}>
							{item.current} disp.
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}

export default CriticalStockCard;
