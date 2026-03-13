import { Box, Typography, Stack } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { SAP_THEME } from './theme';

/**
 * EmptyState
 * Componente visual para mostrar cuando no hay documentos pendientes de facturar.
 */
export default function EmptyState() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 12,
				px: 4,
				backgroundColor: 'background.paper',
				mt: 2
			}}
		>
			<Stack spacing={2} alignItems="center">



				<Typography
					variant="body2"
					align="center"
					sx={{
						color: 'text.secondary',
						maxWidth: 320
					}}
				>
					No hay albaranes pendientes de facturación agrupada en este momento.
				</Typography>
			</Stack>
		</Box>
	);
}
