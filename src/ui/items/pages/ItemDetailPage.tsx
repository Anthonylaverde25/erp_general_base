import { useState } from 'react';
import { useParams } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box, Typography } from '@mui/material';
import { useShowItem } from '@/features/items/hooks/useShowItem';
import ItemProfileHeader from '../components/profile/ItemProfileHeader';
import ItemProfileSidebar from '../components/profile/ItemProfileSidebar';
import ItemProfileOverview from '../components/profile/ItemProfileOverview';
import ItemMovementHistoryTable from '../components/profile/ItemMovementHistoryTable';
import ItemInventoryStoreTable from '../components/profile/ItemInventoryStoreTable';

export default function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { item, isLoading, isError } = useShowItem(Number(id));
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (isLoading) return <FuseLoading />;

	if (isError || !item) {
		return (
			<Box className="flex h-full items-center justify-center">
				<Typography
					variant="h6"
					color="text.secondary"
				>
					No se encontró el artículo solicitado.
				</Typography>
			</Box>
		);
	}

	return (
		<FusePageSimple
			header={
				<ItemProfileHeader
					item={item}
					tabValue={tabValue}
					onTabChange={handleTabChange}
				/>
			}
			content={
				<Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>
					{tabValue === 0 && (
						<Box
							className="flex flex-col md:flex-row"
							sx={{ height: { xs: 'auto', md: '100%' }, borderColor: '#E6EAF0' }}
						>
							<ItemProfileSidebar item={item} />
							<ItemProfileOverview item={item} />
						</Box>
					)}

					{tabValue === 1 && (
						<Box className="flex flex-col xl:flex-row gap-6 p-6 items-start w-full" sx={{ bgcolor: 'background.paper' }}>
							<div className="flex-1 w-full flex flex-col gap-2">
								<Typography
									variant="h6"
									fontWeight={700}
								>
									Inventario por almacén
								</Typography>
								<ItemInventoryStoreTable inventory={item.inventory} />
							</div>

							<div className="flex-[2] w-full flex flex-col gap-2">
								<Typography
									variant="h6"
									fontWeight={700}
								>
									Historial de movimientos
								</Typography>
								<ItemMovementHistoryTable itemId={item.id} />
							</div>
						</Box>
					)}

					{tabValue === 2 && (
						<Box sx={{ p: 3 }}>
							<Typography
								variant="h6"
								color="text.secondary"
							>
								Actividad detallada próximamente.
							</Typography>
						</Box>
					)}
				</Box>
			}
			scroll="content"
		/>
	);
}
