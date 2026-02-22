import { Typography, Box, Stack, useTheme, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PageBreadcrumb from '@/components/PageBreadcrumb';

interface ItemsHeaderProps {
	onCreate?: () => void;
	currentTab?: string;
}

function ItemsHeader(props: ItemsHeaderProps) {
	const { onCreate, currentTab } = props;
	const theme = useTheme();

	const getButtonText = () => {
		switch (currentTab) {
			case 'physical':
				return 'Crear Producto';
			case 'service':
				return 'Crear Servicio';
			default:
				return 'Crear Item';
		}
	};

	const getTitleText = () => {
		switch (currentTab) {
			case 'physical':
				return 'Items | Artículos';
			case 'service':
				return 'Items | Servicios';
			default:
				return 'Items';
		}
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
						{getTitleText()}
					</Typography>
					<Typography
						variant="subtitle1"
						color="text.secondary"
					>
						Manage your inventory items
					</Typography>
				</Box>
				<Button
					onClick={onCreate}
					variant="contained"
					size="small"
					disableElevation
					sx={{ textTransform: 'none', fontWeight: 600, gap: 1 }}
				>
					<Add sx={{ fontSize: 18 }} />
					{getButtonText()}
				</Button>
			</Stack>
		</Box>
	);
}

export default ItemsHeader;
