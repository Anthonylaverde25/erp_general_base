import { Box, Typography } from '@mui/material';

/**
 * Card showing pending payments and pending collections in two sections.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function PendingPaymentsCard() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Pagos pendientes */}
			<Box
				sx={{
					px: 2.5,
					py: 2,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					borderBottom: '1px solid',
					borderColor: 'divider'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
					<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
					<Typography
						variant="subtitle2"
						fontWeight={600}
					>
						Pagos pendientes
					</Typography>
				</Box>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 1 }}
				>
					Mes actual
				</Typography>
				<Typography
					variant="h4"
					fontWeight={700}
					sx={{ textAlign: 'right' }}
				>
					0,00€
				</Typography>
			</Box>

			{/* Cobros pendientes */}
			<Box
				sx={{
					px: 2.5,
					py: 2,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
					<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
					<Typography
						variant="subtitle2"
						fontWeight={600}
					>
						Cobros pendientes
					</Typography>
				</Box>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 1 }}
				>
					Mes actual
				</Typography>
				<Typography
					variant="h4"
					fontWeight={700}
					sx={{ textAlign: 'right' }}
				>
					0,00€
				</Typography>
			</Box>
		</Box>
	);
}

export default PendingPaymentsCard;
