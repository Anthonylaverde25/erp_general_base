import { useState, useMemo } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import {
	Box,
	Typography,
	Paper,
	Avatar,
	Chip,
	MenuItem,
	ListItemIcon,
	TextField,
	IconButton,
	Tooltip,
	FormControl,
	InputLabel,
	Select
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import { useIndexBatches } from '@/features/batches/hooks/useIndexBatches';
import useIndexStores from '@/features/stores/hooks/useIndexStores';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import EditBatchModal from '../components/EditBatchModal';


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

export default function BatchesPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 15
	});

	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [storeId, setStoreId] = useState('');

	// Edit Drawer state
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedBatch, setSelectedBatch] = useState<BatchEntity | null>(null);

	const { stores } = useIndexStores();

	const { data: response, isLoading } = useIndexBatches({
		page: pagination.pageIndex + 1,
		per_page: pagination.pageSize,
		search: search || undefined,
		status: status || undefined,
		store_id: storeId || undefined
	});

	const batches = response?.data || [];
	const meta = response?.meta;

	const handleClearFilters = () => {
		setSearch('');
		setStatus('');
		setStoreId('');
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const handleEditClick = (batch: BatchEntity) => {
		setSelectedBatch(batch);
		setDrawerOpen(true);
	};

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
		setTimeout(() => setSelectedBatch(null), 300);
	};

	const columns = useMemo<MRT_ColumnDef<BatchEntity>[]>(
		() => [
			{
				accessorKey: 'item_name',
				header: 'Artículo / Producto',
				size: 200,
				Cell: ({ row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{row.original.item_name || 'N/A'}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							SKU: {row.original.item_sku || 'N/A'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'internal_batch_number',
				header: 'Lote Interno',
				size: 150,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'supplier_batch_number',
				header: 'Lote Proveedor',
				size: 150,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
							{val}
						</Typography>
					) : (
						<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
							Pendiente
						</Typography>
					);
				}
			},
			{
				accessorKey: 'partner_name',
				header: 'Proveedor',
				size: 180,
				Cell: ({ cell, row }) => {
					const val = cell.getValue<string | null>();
					const procurementType = row.original.item_procurement_type;
					return val ? (
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{val}
						</Typography>
					) : (
						<Chip
							label={procurementType === 'make' ? "Producción Propia" : "Proveedor no especificado / Ajuste"}
							size="small"
							color={procurementType === 'make' ? "primary" : "warning"}
							variant="outlined"
							sx={{ fontSize: '0.7rem', borderRadius: 0.5 }}
						/>
					);
				}
			},
			{
				accessorKey: 'current_stock',
				header: 'Cantidad (Stock)',
				size: 120,
				Cell: ({ cell }) => (
					<Typography variant="body2" fontWeight={600}>
						{cell.getValue<number>()} uds
					</Typography>
				)
			},
			{
				accessorKey: 'status',
				header: 'Estado',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<'active' | 'quarantine' | 'expired'>();
					let muiColor: 'success' | 'warning' | 'error' = 'success';
					let label = 'Activo';
					if (val === 'quarantine') {
						muiColor = 'warning';
						label = 'Retenido';
					} else if (val === 'expired') {
						muiColor = 'error';
						label = 'Expirado';
					}
					return (
						<Chip
							label={label}
							size="small"
							color={muiColor}
							sx={{ fontSize: '0.72rem', borderRadius: 0.5 }}
						/>
					);
				}
			},
			{
				accessorKey: 'manufactured_date',
				header: 'F. Fabricación',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? format(new Date(val), 'dd/MM/yyyy') : '-';
				}
			},
			{
				accessorKey: 'expiry_date',
				header: 'F. Vencimiento',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? format(new Date(val), 'dd/MM/yyyy') : '-';
				}
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
								Gestión de Lotes de Inventario
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Búsqueda y actualización de metadatos de lotes para garantizar la trazabilidad de la mercancía
							</Typography>
						</Box>
						{meta?.total !== undefined && (
							<Chip
								label={`${meta.total} lotes totales`}
								color="primary"
								variant="outlined"
								size="small"
								sx={{ fontWeight: 600 }}
							/>
						)}
					</Box>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 3 }}>
						<DataTable
							renderTopToolbarCustomActions={() => (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0.5, flexWrap: 'wrap' }}>
									<TextField
										placeholder="Buscar por lote o SKU..."
										size="small"
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setPagination((prev) => ({ ...prev, pageIndex: 0 }));
										}}
										sx={{
											width: 220,
											'& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: '0.8125rem' }
										}}
									/>

									<FormControl size="small" sx={{ width: 150 }}>
										<InputLabel id="status-filter-label" sx={{ transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' }}>Estado</InputLabel>
										<Select
											labelId="status-filter-label"
											value={status}
											label="Estado"
											onChange={(e) => {
												setStatus(e.target.value);
												setPagination((prev) => ({ ...prev, pageIndex: 0 }));
											}}
											sx={{ height: 32, minHeight: 32, fontSize: '0.8125rem' }}
										>
											<MenuItem value="">Todos</MenuItem>
											<MenuItem value="active">Activo</MenuItem>
											<MenuItem value="quarantine">Cuarentena</MenuItem>
											<MenuItem value="expired">Expirado</MenuItem>
										</Select>
									</FormControl>

									<FormControl size="small" sx={{ width: 180 }}>
										<InputLabel id="store-filter-label" sx={{ transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' }}>Almacén</InputLabel>
										<Select
											labelId="store-filter-label"
											value={storeId}
											label="Almacén"
											onChange={(e) => {
												setStoreId(e.target.value);
												setPagination((prev) => ({ ...prev, pageIndex: 0 }));
											}}
											sx={{ height: 32, minHeight: 32, fontSize: '0.8125rem' }}
										>
											<MenuItem value="">Todos</MenuItem>
											{stores?.map((s) => (
												<MenuItem key={s.id} value={s.id}>
													{s.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									{(search || status || storeId) && (
										<Tooltip title="Limpiar filtros">
											<IconButton
												onClick={handleClearFilters}
												color="error"
												size="small"
											>
												<FuseSvgIcon>heroicons-outline:x-circle</FuseSvgIcon>
											</IconButton>
										</Tooltip>
									)}
								</Box>
							)}
							data={batches}
							columns={columns}
							state={{ isLoading, pagination }}
							onPaginationChange={setPagination}
							manualPagination
							rowCount={meta?.total ?? 0}
							enablePagination
							enableRowNumbers
							rowNumberDisplayMode="static"
							muiTableProps={{
								sx: {
									borderCollapse: 'collapse',
									border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
									'& .MuiTableCell-root': {
										border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
										padding: '6px 10px',
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
							renderRowActionMenuItems={({ closeMenu, row }) => [
								<MenuItem
									key="edit"
									onClick={() => {
										handleEditClick(row.original);
										closeMenu();
									}}
								>
									<ListItemIcon>
										<FuseSvgIcon>heroicons-outline:pencil-square</FuseSvgIcon>
									</ListItemIcon>
									Editar Lote
								</MenuItem>
							]}
						/>
					</Box>
				}
				scroll="content"
			/>

			<EditBatchModal
				open={drawerOpen}
				onClose={handleCloseDrawer}
				batch={selectedBatch}
			/>
		</>
	);
}


