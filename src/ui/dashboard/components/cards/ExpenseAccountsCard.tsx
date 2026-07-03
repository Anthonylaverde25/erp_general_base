import { Box, Typography } from '@mui/material';

const accounts = [
	'Compras de mercaderías',
	'Compras de materias primas',
	'Compras de otros aprovisionamientos',
	'Variación de existencias de mercaderías',
	'Gastos en investigación y desarrollo',
	'Arrendamientos y cánones',
	'Reparaciones y conservación'
];

/**
 * Scrollable list of expense accounts with amounts and percentages.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function ExpenseAccountsCard() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
				<Box>
					<Typography
						variant="subtitle1"
						fontWeight={600}
					>
						Cuentas de gasto
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Mes actual
					</Typography>
				</Box>
			</Box>

			{/* Scrollable list */}
			<Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flexGrow: 1, mt: 1 }}>
				{accounts.map((item, idx) => (
					<Box
						key={idx}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							py: 1.5,
							borderBottom: idx !== accounts.length - 1 ? '1px solid' : 'none',
							borderColor: 'divider'
						}}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ flex: 1, pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
						>
							{item}
						</Typography>
						<Typography
							variant="body2"
							color="primary.main"
							fontWeight={500}
							sx={{ ml: 2, textAlign: 'right', whiteSpace: 'nowrap' }}
						>
							0,00€ - 0,00€ (0%)
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}

export default ExpenseAccountsCard;
