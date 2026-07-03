import { Box, Typography } from '@mui/material';

const flowItems = [
	{ label: 'Entradas', color: 'success.main', value: 0 },
	{ label: 'Salidas', color: 'error.main', value: 0 },
	{ label: 'Saldo', color: 'info.main', value: 0 }
];

/**
 * Card showing bank entries, exits and balance for the current month.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function BankFlowCard() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
				<Typography
					variant="subtitle1"
					fontWeight={600}
				>
					Entradas y salidas
				</Typography>
			</Box>

			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 2 }}
			>
				Mes actual
			</Typography>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
				{flowItems.map((item) => (
					<Box
						key={item.label}
						sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
							<Typography
								variant="body2"
								color="text.secondary"
							>
								{item.label}
							</Typography>
						</Box>
						<Typography
							variant="body2"
							fontWeight={500}
						>
							{item.value}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}

export default BankFlowCard;
