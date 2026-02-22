import { Box } from '@mui/material';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import ItemOverviewActions from './ItemOverviewActions';
import ItemOverviewKpis from './ItemOverviewKpis';
import ItemOverviewInventoryChart from './ItemOverviewInventoryChart';
import ItemOverviewActivity from './ItemOverviewActivity';

interface ItemProfileOverviewProps {
	item: ItemEntity;
}

export default function ItemProfileOverview({ item }: ItemProfileOverviewProps) {
	const stockActual = item.inventory.reduce(
		(total, inventoryItem) => total + (inventoryItem.available_quantity || 0),
		0
	);
	const unidadesVendidasMes = 126;
	const rotacionMensual = 2.6;
	const chartData = [
		{ month: 'Ene', unidades_vendidas: 36, stock: 52 },
		{ month: 'Feb', unidades_vendidas: 44, stock: 48 },
		{ month: 'Mar', unidades_vendidas: 39, stock: 46 },
		{ month: 'Abr', unidades_vendidas: 52, stock: 41 },
		{ month: 'May', unidades_vendidas: 47, stock: 43 },
		{ month: 'Jun', unidades_vendidas: 58, stock: 39 }
	];

	return (
		<Box sx={{ flex: 1, p: 3, overflowY: { xs: 'visible', md: 'auto' } }}>
			<ItemOverviewActions />
			<ItemOverviewKpis
				stockActual={stockActual}
				unidadesVendidasMes={unidadesVendidasMes}
				rotacionMensual={rotacionMensual}
			/>
			<ItemOverviewInventoryChart
				item={item}
				stockActual={stockActual}
				unidadesVendidasMes={unidadesVendidasMes}
				rotacionMensual={rotacionMensual}
				chartData={chartData}
			/>
			<ItemOverviewActivity />
		</Box>
	);
}
