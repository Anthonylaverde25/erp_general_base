import { Box, Typography, Stack, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';

interface DocumentEmptyStateProps {
	operation: 'sale' | 'purchase';
	documentType?: string;
	onCreate?: () => void;
}

const COPY = {
	sale: {
		title: 'No hay documentos de venta',
		subtitle: 'Aún no has registrado ningún documento de venta. Comienza creando uno nuevo.',
		icon: 'heroicons-outline:document-plus'
	},
	purchase: {
		title: 'No hay documentos de compra',
		subtitle: 'Tu bandeja de recibos y facturas de proveedor está vacía. Registra tu primera compra.',
		icon: 'heroicons-outline:shopping-cart'
	}
};

export default function DocumentEmptyState({ operation, documentType, onCreate }: DocumentEmptyStateProps) {
	const navigate = useNavigate();
	const copy = COPY[operation];

	const basePath = operation === 'sale' ? '/sales' : '/purchases';

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

				mt: 2,
				textAlign: 'center'
			}}
		>
			<Stack spacing={3} alignItems="center">

				<Box>
					<Typography variant="h5" fontWeight="bold" gutterBottom>
						{copy.title}
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
						{copy.subtitle}
					</Typography>
				</Box>


			</Stack>
		</Box>
	);
}
