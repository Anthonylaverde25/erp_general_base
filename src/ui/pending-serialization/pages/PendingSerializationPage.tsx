import { useState, useMemo } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import {
	Box,
	Typography,
	Chip,
	Button
} from '@mui/material';
import { useIndexPendingSerialization } from '@/features/pending-serialization/hooks/useIndexPendingSerialization';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { PendingSerializationItem } from '@/types/pending-serialization.types';
import RegisterSerialsDialog from '../components/RegisterSerialsDialog';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default
	}
}));

export default function PendingSerializationPage() {
	const { data: pendingItems = [], isLoading } = useIndexPendingSerialization();

	// Modal states
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<PendingSerializationItem | null>(null);

	const handleRegisterClick = (item: PendingSerializationItem) => {
		setSelectedItem(item);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setTimeout(() => setSelectedItem(null), 300);
	};

	// Columns definition
	const columns = useMemo<MRT_ColumnDef<PendingSerializationItem>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Artículo / Producto',
				size: 220,
				Cell: ({ row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{row.original.name}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							SKU: {row.original.sku}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'store_name',
				header: 'Almacén / Bodega',
				size: 160,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'physical_stock',
				header: 'Stock Físico',
				size: 100,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem', textAlign: 'right', pr: 2 }}>
						{Number(cell.getValue<string | number>()).toFixed(0)} Uds.
					</Typography>
				)
			},
			{
				accessorKey: 'serials_count',
				header: 'Series en Sistema',
				size: 110,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem', textAlign: 'right', pr: 2 }}>
						{cell.getValue<number>()} Uds.
					</Typography>
				)
			},
			{
				accessorKey: 'pending_count',
				header: 'Series Faltantes',
				size: 120,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 800, color: '#e11d48', textAlign: 'right', pr: 2 }}>
						{cell.getValue<number>()} Uds.
					</Typography>
				)
			},
			{
				id: 'actions',
				header: 'Acciones',
				size: 120,
				Cell: ({ row }) => (
					<Button
						variant="contained"
						size="small"
						color="primary"
						onClick={() => handleRegisterClick(row.original)}
						sx={{
							borderRadius: 0,
							fontSize: '0.75rem',
							height: 28,
							bgcolor: '#005483',
							'&:hover': {
								bgcolor: '#004064'
							}
						}}
					>
						Registrar Series
					</Button>
				)
			}
		],
		[]
	);

	return (
		<>
			<Root
				header={
					<Box className="flex flex-col sm:flex-row flex-1 items-center justify-between p-6 sm:p-8">
						<Box className="flex flex-col gap-1">
							<Typography variant="h5" fontWeight={700}>
								Control de Seriales Pendientes (Diferidos)
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Bandeja para registrar números de serie pendientes de artículos con stock físico
							</Typography>
						</Box>

						{/* Summary chip */}
						{pendingItems.length > 0 && (
							<Chip
								label={`${pendingItems.length} artículos pendientes`}
								color="error"
								variant="outlined"
								size="small"
								sx={{ fontWeight: 600, borderRadius: 0.5 }}
							/>
						)}
					</Box>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 2 }}>
						<DataTable
							data={pendingItems}
							columns={columns}
							state={{ isLoading }}
							enablePagination={true}
							enableRowNumbers={true}
							rowNumberDisplayMode="static"
							muiTableProps={{
								sx: {
									borderCollapse: 'collapse',
									border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
									'& .MuiTableCell-root': {
										border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
										padding: '8px 10px',
										fontSize: '0.8125rem',
										borderRadius: 0
									},
									'& .MuiTableHead-root .MuiTableCell-root': {
										backgroundColor: (theme: Theme) =>
											theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
										fontWeight: 700,
										color: 'text.primary'
									}
								}
							}}
						/>
					</Box>
				}
				scroll="content"
			/>

			{/* Modal for registering serials */}
			<RegisterSerialsDialog
				key={selectedItem ? `${selectedItem.id}-${selectedItem.store_id}` : 'closed'}
				open={modalOpen}
				onClose={handleCloseModal}
				item={selectedItem}
			/>
		</>
	);
}
