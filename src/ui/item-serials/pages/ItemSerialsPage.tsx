import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import {
	Box,
	Typography,
	Chip,
	TextField,
	MenuItem,
	Tooltip,
	IconButton
} from '@mui/material';
import { XCircle } from 'lucide-react';
import { useIndexItemSerials } from '@/features/item-serials/hooks/useIndexItemSerials';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { ItemSerialDTO } from '@/types/item-serials.types';

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

export default function ItemSerialsPage() {
	// Pagination state
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

	// Filter states
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [documentType, setDocumentType] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const filters = useMemo(() => ({
		search,
		status,
		document_type: documentType,
		start_date: startDate,
		end_date: endDate
	}), [search, status, documentType, startDate, endDate]);

	// Fetch query
	const { data, isLoading } = useIndexItemSerials(
		pagination.pageIndex + 1,
		pagination.pageSize,
		filters
	);

	const serials = data?.data ?? [];
	const totalCount = data?.meta?.total ?? 0;

	// Reset page index and clear filters
	const handleClearFilters = () => {
		setSearch('');
		setStatus('');
		setDocumentType('');
		setStartDate('');
		setEndDate('');
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	// Helper function for status chip styling
	const getStatusChip = (status: string) => {
		const statusMap: Record<string, { label: string; color: string; bgcolor: string }> = {
			available: { label: 'Disponible', color: '#16a34a', bgcolor: '#f0fdf4' },
			sold: { label: 'Vendido', color: '#2563eb', bgcolor: '#eff6ff' },
			returned: { label: 'Devuelto', color: '#d97706', bgcolor: '#fef3c7' },
			damaged: { label: 'Dañado', color: '#dc2626', bgcolor: '#fdf2f2' }
		};

		const info = statusMap[status] || { label: status.toUpperCase(), color: '#4b5563', bgcolor: '#f3f4f6' };

		return (
			<Chip
				label={info.label}
				size="small"
				sx={{
					borderRadius: 0,
					fontWeight: 800,
					fontSize: '0.7rem',
					color: info.color,
					bgcolor: info.bgcolor,
					border: `1px solid ${info.color}`,
					height: 20
				}}
			/>
		);
	};

	// Columns definition
	const columns = useMemo<MRT_ColumnDef<ItemSerialDTO>[]>(
		() => [
			{
				accessorKey: 'serial_number',
				header: 'Número de Serie',
				size: 180,
				Cell: ({ cell }) => (
					<Typography 
						variant="body2" 
						sx={{ 
							fontFamily: 'monospace', 
							fontWeight: 700, 
							fontSize: '0.8125rem',
							letterSpacing: '0.5px' 
						}}
					>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'item_name',
				header: 'Artículo / Producto',
				size: 240,
				Cell: ({ row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{row.original.item_name}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							SKU: {row.original.item_sku}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'store_name',
				header: 'Almacén / Bodega',
				size: 160,
				Cell: ({ row }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
						{row.original.store_name || <Typography variant="caption" color="text.secondary">No registrado</Typography>}
					</Typography>
				)
			},
			{
				accessorKey: 'status',
				header: 'Estado',
				size: 120,
				Cell: ({ cell }) => getStatusChip(cell.getValue<string>())
			},
			{
				accessorKey: 'purchase_doc_number',
				header: 'Factura Compra (Entrada)',
				size: 160,
				Cell: ({ cell }) => (
					cell.getValue<string>() ? (
						<Typography 
							variant="body2" 
							sx={{ 
								fontSize: '0.8125rem', 
								fontFamily: 'monospace', 
								fontWeight: 650, 
								color: '#005483' 
							}}
						>
							{cell.getValue<string>()}
						</Typography>
					) : (
						<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
							Sin registro
						</Typography>
					)
				)
			},
			{
				accessorKey: 'sale_doc_number',
				header: 'Factura Venta (Salida)',
				size: 160,
				Cell: ({ cell }) => (
					cell.getValue<string>() ? (
						<Typography 
							variant="body2" 
							sx={{ 
								fontSize: '0.8125rem', 
								fontFamily: 'monospace', 
								fontWeight: 650, 
								color: '#005483' 
							}}
						>
							{cell.getValue<string>()}
						</Typography>
					) : (
						<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
							Disponible en Stock
						</Typography>
					)
				)
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
							Trazabilidad de Números de Serie
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Registro centralizado e historial completo de seriales de productos
						</Typography>
					</Box>

					{totalCount > 0 && (
						<Chip
							label={`${totalCount} seriales registrados`}
							color="primary"
							variant="outlined"
							size="small"
							sx={{ 
								fontWeight: 700, 
								borderRadius: 0, 
								borderColor: '#005483', 
								color: '#005483',
								bgcolor: '#f0f9ff'
							}}
						/>
					)}
				</Box>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 2 }}>
					{/* Toolbar de Filtros */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
						<TextField
							label="Buscar"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							placeholder="Nº serie, SKU, artículo..."
							size="small"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								sx: { height: 32, fontSize: '0.8125rem', borderRadius: 0 }
							}}
							sx={{ minWidth: 200 }}
						/>

						<TextField
							select
							label="Estado"
							value={status}
							onChange={(e) => {
								setStatus(e.target.value);
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							size="small"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								sx: { height: 32, fontSize: '0.8125rem', borderRadius: 0 }
							}}
							sx={{ minWidth: 150 }}
						>
							<MenuItem value="" sx={{ fontSize: '13px' }}><em>Todos los estados</em></MenuItem>
							<MenuItem value="available" sx={{ fontSize: '13px' }}>Disponible</MenuItem>
							<MenuItem value="sold" sx={{ fontSize: '13px' }}>Vendido</MenuItem>
							<MenuItem value="returned" sx={{ fontSize: '13px' }}>Devuelto</MenuItem>
							<MenuItem value="damaged" sx={{ fontSize: '13px' }}>Dañado</MenuItem>
						</TextField>

						<TextField
							select
							label="Tipo Documento"
							value={documentType}
							onChange={(e) => {
								setDocumentType(e.target.value);
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							size="small"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								sx: { height: 32, fontSize: '0.8125rem', borderRadius: 0 }
							}}
							sx={{ minWidth: 180 }}
						>
							<MenuItem value="" sx={{ fontSize: '13px' }}><em>Todos los tipos</em></MenuItem>
							<MenuItem value="purchase" sx={{ fontSize: '13px' }}>Factura Compra (Entrada)</MenuItem>
							<MenuItem value="sale" sx={{ fontSize: '13px' }}>Factura Venta (Salida)</MenuItem>
						</TextField>

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

						{(search || status || documentType || startDate || endDate) && (
							<Tooltip title="Limpiar todos los filtros">
								<IconButton
									onClick={handleClearFilters}
									color="error"
									size="small"
								>
									<XCircle size={18} />
								</IconButton>
							</Tooltip>
						)}
					</Box>

					{/* DataTable con paginación manual */}
					<DataTable
						data={serials}
						columns={columns}
						state={{ isLoading, pagination }}
						onPaginationChange={setPagination}
						manualPagination={true}
						rowCount={totalCount}
						enablePagination={true}
						enableRowSelection={false}
						enableRowActions={false}
						enableRowNumbers={true}
						rowNumberDisplayMode="static"
					/>
				</Box>
			}
		/>
	);
}
