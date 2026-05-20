import { Button } from '@mui/material';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface ItemsHeaderProps {
	onCreate?: () => void;
	currentTab?: string;
}

function ItemsHeader(props: ItemsHeaderProps) {
	const { onCreate, currentTab } = props;

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
		<PageHeader
			title={getTitleText()}
			subtitle="Gestiona el inventario de productos y servicios."
			actions={
				<Button
					onClick={onCreate}
					variant="contained"
					color="secondary"
					size="small"
					disableElevation
					startIcon={<Plus size={18} />}
					sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px' }}
				>
					{getButtonText()}
				</Button>
			}
		/>
	);
}

export default ItemsHeader;
