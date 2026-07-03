import { Box, Typography } from '@mui/material';

/**
 * Call-to-action card prompting the user to create their first bank.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function BankCtaCard() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
				textAlign: 'center'
			}}
		>
			<Box
				sx={{
					width: 48,
					height: 48,
					borderRadius: '50%',
					bgcolor: 'action.hover',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 2
				}}
			>
				<Typography variant="h6">🏦</Typography>
			</Box>
			<Typography
				variant="subtitle2"
				color="primary.main"
				fontWeight={600}
				sx={{ cursor: 'pointer' }}
			>
				Crea tu primer banco
			</Typography>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ mt: 1, maxWidth: 200 }}
			>
				Conecta Holded con tus bancos para relacionar y tener un control máximo.
			</Typography>
		</Box>
	);
}

export default BankCtaCard;
