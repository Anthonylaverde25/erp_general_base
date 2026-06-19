import { useState, useMemo } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import {
	Box,
	Typography,
	Chip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	IconButton,
	Tooltip
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { useIndexItems } from '@/features/items/hooks/useIndexItems';
import { useIndexPartners } from '@/features/partners/hooks/useIndexPartners';
import { useIndexStockMovements } from '@/application/hooks/items/useIndexStockMovements';
import { StockMovementEntity } from '@/domain/entities/items/repositories/item.action.repository';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';

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

export default function StockMovementsPage() {
	const [selectedItemId, setSelectedItemId] = useState<number | ''>('');
	const [partnerId, setPartnerId] = useState<number | ''>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

	const { data: items = [], isLoading: isLoadingItems } = useIndexItems();
	const { data: partners = [], isLoading: isLoadingPartners } = useIndexPartners('supplier');

	// Active filters structure for the index hook
	const filters = useMemo(() => {
		return {
			partner_id: partnerId ? Number(partnerId) : null,
			start_date: startDate || null,
			end_date: endDate || null
		};
	}, [partnerId, startDate, endDate]);

	const { data: response, isLoading: isLoadingMovements } = useIndexStockMovements(
		selectedItemId ? (selectedItemId as number) : null,
		pagination.pageIndex + 1,
		pagination.pageSize,
		filters
	);

	const movements = response?.data || [];
	const meta = response?.meta;

	const handleClearFilters = () => {
		setSelectedItemId('');
		setPartnerId('');
		setStartDate('');
		setEndDate('');
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const columns = useMemo<MRT_ColumnDef<StockMovementEntity>[]>(
		() => [
			{
				id: 'item',
				header: 'Artículo / Producto',
				size: 220,
				Cell: ({ row }) => {
					const item = row.original.item;
					return item ? (
						<Box className="flex flex-col py-0.5">
							<Link
								to={`/items/${item.id}`}
								style={{
									color: '#005483',
									fontWeight: 700,
									textDecoration: 'none',
									cursor: 'pointer',
									fontSize: '0.8125rem'
								}}
								className="hover:underline"
							>
								{item.name}
							</Link>
							<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
								SKU: {item.sku || 'N/A'}
							</Typography>
						</Box>
					) : (
						<Typography variant="body2" color="text.disabled">—</Typography>
					);
				}
			},
			{
				accessorKey: 'created_at',
				header: 'Fecha / Hora',
				size: 140,
				Cell: ({ cell }) => {
					const val = cell.getValue<string>();
					return val ? (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
							{format(new Date(val), 'dd/MM/yyyy HH:mm')}
						</Typography>
					) : (
						'-'
					);
				}
			},
			{
				accessorKey: 'type',
				header: 'Tipo',
				size: 90,
				Cell: ({ cell }) => {
					const val = cell.getValue<'entry' | 'exit'>();
					return (
						<Chip
							label={val === 'entry' ? 'Entrada' : 'Salida'}
							size="small"
							color={val === 'entry' ? 'success' : 'error'}
							sx={{ fontSize: '0.72rem', borderRadius: 0.5, fontWeight: 700 }}
						/>
					);
				}
			},
			{
				accessorKey: 'quantity',
				header: 'Cantidad',
				size: 100,
				Cell: ({ row, cell }) => {
					const type = row.original.type;
					const qty = cell.getValue<number>();
					return (
						<Typography
							variant="body2"
							fontWeight={700}
							sx={{ color: type === 'entry' ? 'success.main' : 'error.main' }}
						>
							{type === 'entry' ? '+' : '-'}
							{Number(qty).toString()}
						</Typography>
					);
				}
			},
			{
				accessorKey: 'reason',
				header: 'Motivo',
				size: 150,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
						{cell.getValue<string>() || '-'}
					</Typography>
				)
			},
			{
				accessorKey: 'reference',
				header: 'Referencia',
				size: 130,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
							{val}
						</Typography>
					) : (
						<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
							Sin ref.
						</Typography>
					);
				}
			},
			{
				id: 'source_store',
				header: 'Origen',
				size: 140,
				Cell: ({ row }) => {
					const store = row.original.source_store;
					return store ? (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<FuseSvgIcon size={14} color="action">
								lucide:warehouse
							</FuseSvgIcon>
							<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
								{store.name}
							</Typography>
						</Box>
					) : (
						<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
							—
						</Typography>
					);
				}
			},
			{
				id: 'destination_store',
				header: 'Destino',
				size: 140,
				Cell: ({ row }) => {
					const store = row.original.destination_store;
					return store ? (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<FuseSvgIcon size={14} color="action">
								lucide:warehouse
							</FuseSvgIcon>
							<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
								{store.name}
							</Typography>
						</Box>
					) : (
						<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
							—
						</Typography>
					);
				}
			},
			{
				id: 'user',
				header: 'Usuario',
				size: 130,
				Cell: ({ row }) => {
					const user = row.original.user;
					return user ? (
						<Tooltip title={user.email} arrow>
							<Typography variant="body2" sx={{ fontSize: '0.8125rem', cursor: 'default' }}>
								{user.name}
							</Typography>
						</Tooltip>
					) : (
						<Typography variant="caption" color="text.disabled">
							Sistema
						</Typography>
					);
				}
			},
			{
				accessorKey: 'notes',
				header: 'Notas',
				size: 180,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? (
						<Typography variant="caption" color="text.secondary">
							{val}
						</Typography>
					) : (
						<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
							—
						</Typography>
					);
				}
			}
		],
		[]
	);

	return (
		<Root
			header={
				<Box className="flex flex-col sm:flex-row flex-1 items-center justify-between p-6 sm:p-8">
					<Box className="flex flex-col gap-1">
						<Typography variant="h5" fontWeight={700}>
							Movimientos de Stock
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Historial general de entradas y salidas de inventario en el sistema
						</Typography>
					</Box>
					{meta?.total !== undefined && (
						<Chip
							label={`${meta.total} movimientos totales`}
							color="primary"
							variant="outlined"
							size="small"
							sx={{ fontWeight: 600 }}
						/>
					)}
				</Box>
			}
			content={
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flex: '1 1 auto',
						bgcolor: 'background.default',
						p: 3,
						gap: 3
					}}
				>
					{/* Filters banner */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							p: 2,
							borderLeft: '4px solid #005483',
							bgcolor: 'background.paper',
							border: (theme) => `1px solid ${theme.palette.divider}`,
							borderLeftColor: '#005483',
							flexWrap: 'wrap'
						}}
					>
						<FormControl size="small" sx={{ minWidth: 220 }}>
							<InputLabel
								id="item-select-label"
								sx={{ transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' }}
							>
								Artículo / Producto
							</InputLabel>
							<Select
								labelId="item-select-label"
								value={selectedItemId}
								label="Artículo / Producto"
								onChange={(e) => {
									setSelectedItemId(e.target.value as number | '');
									setPagination((prev) => ({ ...prev, pageIndex: 0 }));
								}}
								disabled={isLoadingItems}
								sx={{ height: 32, minHeight: 32, fontSize: '0.8125rem', borderRadius: 0 }}
							>
								<MenuItem value="">
									<em>Todos los artículos</em>
								</MenuItem>
								{items.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.name} {item.sku ? `(${item.sku})` : ''}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 220 }}>
							<InputLabel
								id="partner-select-label"
								sx={{ transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' }}
							>
								Proveedor
							</InputLabel>
							<Select
								labelId="partner-select-label"
								value={partnerId}
								label="Proveedor"
								onChange={(e) => {
									setPartnerId(e.target.value as number | '');
									setPagination((prev) => ({ ...prev, pageIndex: 0 }));
								}}
								disabled={isLoadingPartners}
								sx={{ height: 32, minHeight: 32, fontSize: '0.8125rem', borderRadius: 0 }}
							>
								<MenuItem value="">
									<em>Todos los proveedores</em>
								</MenuItem>
								{partners.map((partner) => (
									<MenuItem key={partner.id} value={partner.id}>
										{partner.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							label="Desde"
							type="date"
							value={startDate}
							onChange={(e) => {
								setStartDate(e.target.value);
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							size="small"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								sx: { height: 32, fontSize: '0.8125rem', borderRadius: 0 }
							}}
						/>

						<TextField
							label="Hasta"
							type="date"
							value={endDate}
							onChange={(e) => {
								setEndDate(e.target.value);
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							size="small"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								sx: { height: 32, fontSize: '0.8125rem', borderRadius: 0 }
							}}
						/>

						{(selectedItemId || partnerId || startDate || endDate) && (
							<Tooltip title="Limpiar todos los filtros">
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

					{/* Table */}
					<DataTable
						renderTopToolbarCustomActions={() => (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5 }}>
								<FuseSvgIcon size={16} color="action">
									lucide:arrow-right-left
								</FuseSvgIcon>
								<Typography variant="caption" color="text.secondary" fontWeight={600}>
									Registros Históricos
								</Typography>
							</Box>
						)}
						data={movements}
						columns={columns}
						state={{ isLoading: isLoadingMovements, pagination }}
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
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}
