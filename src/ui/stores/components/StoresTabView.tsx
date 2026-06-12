import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import useIndexStores from '@/features/stores/hooks/useIndexStores';
import useDeleteStore from '@/features/stores/hooks/useDeleteStore';
import useUpdateStore from '@/features/stores/hooks/useUpdateStore';
import { useToggleStoreStatus } from '@/features/stores/hooks/useToggleStoreStatus';
import CreateStoreModal from './modals/CreateStoreModal';
import UpdateStoreModal from './modals/UpdateStoreModal';
import StoresTable from './StoresTable';

export default function StoresTabView() {
	const theme = useTheme();
	const { stores, isLoading, isError } = useIndexStores();
	const { handleDeleteStore } = useDeleteStore();

	const { handleUpdateStore } = useUpdateStore();
	const toggleStoreStatus = useToggleStoreStatus();

	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);

	const handleEditStore = (storeId: number) => {
		setSelectedStore(storeId);
		setUpdateModalOpen(true);
	};

	const handleToggleActive = async (id: number, currentStatus: boolean) => {
		try {
			await toggleStoreStatus.mutateAsync({
				id,
				status: !currentStatus
			});
		} catch (error) {
			console.error('Error toggling store status:', error);
		}
	};

	const onDeleteStore = async (storeId: number) => {
		if (confirm('¿Está seguro de eliminar esta tienda?')) {
			await handleDeleteStore(storeId);
		}
	};

	if (isLoading)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="text.secondary">Cargando tiendas...</Typography>
			</Box>
		);

	if (isError)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="error">Error al cargar las tiendas</Typography>
			</Box>
		);

	return (
		<Box className="w-full overflow-hidden">
			{/* Header Section */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				sx={{
					p: 3,
					borderBottom: `1px solid ${theme.palette.divider}`
				}}
			>
				<div />
				<Button
					variant="contained"
					color="secondary"
					size="small"
					startIcon={<FuseSvgIcon size={18}>heroicons-outline:building-storefront</FuseSvgIcon>}
					onClick={() => setCreateModalOpen(true)}
					sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
				>
					Crear tienda
				</Button>
			</Stack>

			{/* Table Section */}
			{/* Table Section */}
			<StoresTable
				stores={stores}
				onEdit={(id) => handleEditStore(id)}
				onDelete={onDeleteStore}
				onStatusChange={handleToggleActive}
			/>

			{/* Modals */}
			<CreateStoreModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>

			{selectedStore && (
				<UpdateStoreModal
					open={updateModalOpen}
					onClose={() => {
						setUpdateModalOpen(false);
						setSelectedStore(null);
					}}
					storeId={selectedStore}
				/>
			)}
		</Box>
	);
}
