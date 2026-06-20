import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import {
	Box,
	Typography,
	Chip,
	MenuItem,
	TextField,
	IconButton,
	Tooltip,
	FormControl,
	InputLabel,
	Select,
	FormControlLabel,
	Switch
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns';
import { useGetSuppliersMatrix, SupplierMatrixPartnerDTO, SupplierMatrixItemDTO } from '@/features/items/hooks/useGetSuppliersMatrix';
import { useIndexSupplierPartners } from '@/features/partners/hooks/useIndexSupplierPartners';
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

export default function SuppliersInventoryPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [partnerId, setPartnerId] = useState<string | number>('');
	const [isDefaultOnly, setIsDefaultOnly] = useState(false);

	const { data: suppliersList } = useIndexSupplierPartners();

	const { data: response, isLoading } = useGetSuppliersMatrix({
		search: search || undefined,
		partner_id: partnerId || undefined,
		is_default: isDefaultOnly || undefined
	});

	const dataRows = response?.data || [];

	const handleClearFilters = () => {
		setSearch('');
		setPartnerId('');
		setIsDefaultOnly(false);
	};

	const itemColumns = useMemo<MRT_ColumnDef<SupplierMatrixItemDTO>[]>(
		() => [
			{
				id: 'name',
				header: 'Artículo',
				size: 250,
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Typography
							onClick={() => navigate(`/items/${item.item_id}`)}
							variant="body2"
							fontWeight={600}
							sx={{
								fontSize: '0.75rem',
								color: 'text.primary',
								cursor: 'pointer',
								'&:hover': { textDecoration: 'underline' }
							}}
						>
							{item.name}
						</Typography>
					);
				}
			},
			{
				id: 'sku',
				header: 'SKU',
				size: 120,
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
							{item.sku}
						</Typography>
					);
				}
			},
			{
				id: 'type',
				header: 'Tipo',
				size: 100,
				muiTableHeadCellProps: { align: 'center' },
				muiTableBodyCellProps: { align: 'center' },
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Chip
							label={item.type === 'physical' ? 'Físico' : 'Servicio'}
							size="small"
							color={item.type === 'physical' ? 'default' : 'secondary'}
							variant="outlined"
							sx={{ fontSize: '0.55rem', height: 14, borderRadius: '4px', px: 0.5 }}
						/>
					);
				}
			},
			{
				id: 'is_default',
				header: 'Predet.',
				size: 80,
				muiTableHeadCellProps: { align: 'center' },
				muiTableBodyCellProps: { align: 'center' },
				Cell: ({ row }) => {
					const item = row.original;
					return item.is_default ? (
						<Tooltip title="Predeterminado">
							<Box sx={{ display: 'inline-flex', color: 'warning.main', mt: 0.2 }}>
								<FuseSvgIcon size={15}>heroicons-solid:star</FuseSvgIcon>
							</Box>
						</Tooltip>
					) : (
						<Typography variant="caption" color="text.disabled">-</Typography>
					);
				}
			},
			{
				id: 'purchase_price',
				header: 'P. Compra',
				size: 100,
				muiTableHeadCellProps: { align: 'right' },
				muiTableBodyCellProps: { align: 'right' },
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>
							{item.purchase_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
						</Typography>
					);
				}
			},
			{
				id: 'min_order_quantity',
				header: 'M.O.Q.',
				size: 100,
				muiTableHeadCellProps: { align: 'right' },
				muiTableBodyCellProps: { align: 'right' },
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
							{item.min_order_quantity} uds
						</Typography>
					);
				}
			},
			{
				id: 'lead_time_days',
				header: 'Plazo',
				size: 80,
				muiTableHeadCellProps: { align: 'center' },
				muiTableBodyCellProps: { align: 'center' },
				Cell: ({ row }) => {
					const item = row.original;
					return item.lead_time_days !== null ? (
						<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
							{item.lead_time_days} d
						</Typography>
					) : (
						<Typography variant="caption" color="text.disabled">-</Typography>
					);
				}
			},
			{
				id: 'last_supplier_service',
				header: 'Últ. Serv. Prov.',
				size: 180,
				Cell: ({ row }) => {
					const item = row.original;
					const service = item.last_supplier_service;
					if (!service) {
						return (
							<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
								Nunca
							</Typography>
						);
					}

					return (
						<Box className="flex items-center gap-1">
							<Typography variant="body2" sx={{ fontSize: '0.72rem' }}>
								{service.date ? format(new Date(service.date), 'dd/MM/yyyy') : '-'}
							</Typography>
							<Typography
								onClick={() => navigate(`/purchases/view/${service.document_id}`)}
								variant="caption"
								sx={{
									fontSize: '0.68rem',
									color: 'primary.main',
									cursor: 'pointer',
									fontWeight: 600,
									'&:hover': { textDecoration: 'underline' }
								}}
							>
								#{service.document_number}
							</Typography>
						</Box>
					);
				}
			},
			{
				id: 'last_general_service',
				header: 'Últ. Abast. Gen.',
				size: 220,
				Cell: ({ row }) => {
					const item = row.original;
					const service = item.last_general_service;
					if (!service) {
						return (
							<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
								Sin compras
							</Typography>
						);
					}

					return (
						<Box className="flex flex-col py-0.5">
							<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
								{service.partner_name}
							</Typography>
							<Box className="flex items-center gap-1.5 mt-0.5">
								<Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
									{service.date ? format(new Date(service.date), 'dd/MM/yyyy') : '-'}
								</Typography>
								<Typography
									onClick={() => navigate(`/purchases/view/${service.document_id}`)}
									variant="caption"
									sx={{
										fontSize: '0.65rem',
										color: 'primary.main',
										cursor: 'pointer',
										fontWeight: 600,
										'&:hover': { textDecoration: 'underline' }
									}}
								>
									#{service.document_number}
								</Typography>
							</Box>
						</Box>
					);
				}
			},
			{
				id: 'is_active',
				header: 'Est.',
				size: 80,
				muiTableHeadCellProps: { align: 'center' },
				muiTableBodyCellProps: { align: 'center' },
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Chip
							label={item.is_active ? 'Act' : 'Inact'}
							size="small"
							color={item.is_active ? 'success' : 'error'}
							variant="outlined"
							sx={{ fontSize: '0.625rem', height: 16, borderRadius: '4px', px: 0.5 }}
						/>
					);
				}
			}
		],
		[navigate]
	);

	const columns = useMemo<MRT_ColumnDef<SupplierMatrixPartnerDTO>[]>(
		() => [
			{
				id: 'name',
				header: 'Proveedor',
				size: 320,
				Cell: ({ row }) => {
					const partner = row.original;
					return (
						<Box className="flex flex-col py-0.5">
							<Typography
								onClick={() => navigate(`/partners/${partner.id}`)}
								variant="body2"
								fontWeight={700}
								sx={{
									fontSize: '0.8rem',
									color: 'primary.main',
									cursor: 'pointer',
									'&:hover': { textDecoration: 'underline' }
								}}
							>
								{partner.name}
							</Typography>
							{partner.comercial_name && (
								<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
									{partner.comercial_name}
								</Typography>
							)}
						</Box>
					);
				}
			},
			{
				id: 'contacts',
				header: 'Contacto',
				size: 200,
				Cell: ({ row }) => {
					const partner = row.original;
					const contacts = partner.contacts || [];
					const defaultContact = contacts.find((c) => c.default) || contacts[0];

					if (!defaultContact || (!defaultContact.email && !defaultContact.phone)) {
						return (
							<Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
								Sin contactos
							</Typography>
						);
					}

					return (
						<Box className="flex items-center gap-2">
							{defaultContact.email && (
								<Tooltip title={`Correo: ${defaultContact.email}`}>
									<IconButton
										component="a"
										href={`mailto:${defaultContact.email}`}
										size="small"
										color="primary"
										sx={{ width: 22, height: 22, p: 0 }}
									>
										<FuseSvgIcon size={14}>heroicons-outline:envelope</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							)}
							{defaultContact.phone && (
								<Tooltip title={`Llamar: ${defaultContact.phone}`}>
									<IconButton
										component="a"
										href={`tel:${defaultContact.phone}`}
										size="small"
										color="secondary"
										sx={{ width: 22, height: 22, p: 0 }}
									>
										<FuseSvgIcon size={14}>heroicons-outline:phone</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							)}
						</Box>
					);
				}
			},
			{
				id: 'items_count',
				header: 'Artículos',
				size: 120,
				muiTableHeadCellProps: { align: 'center' },
				muiTableBodyCellProps: { align: 'center' },
				Cell: ({ row }) => {
					const partner = row.original;
					const count = partner.items?.length || 0;
					return (
						<Chip
							label={`${count} ${count === 1 ? 'artículo' : 'artículos'}`}
							size="small"
							color={count > 0 ? 'primary' : 'default'}
							variant="outlined"
							sx={{ fontSize: '0.7rem', height: 20, borderRadius: '4px' }}
						/>
					);
				}
			}
		],
		[navigate]
	);

	return (
		<Root
			header={
				<Box className="flex flex-col sm:flex-row flex-1 items-center justify-between p-6 sm:p-8">
					<Box className="flex flex-col gap-1">
						<Typography variant="h5" fontWeight={700}>
							Matriz de Proveedores por Artículo
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Vista tipo hoja de cálculo del catálogo agrupado por proveedor, condiciones de compra e histórico de abastecimiento.
						</Typography>
					</Box>
					{response?.data !== undefined && (
						<Chip
							label={`${response.data.length} proveedores`}
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
									placeholder="Buscar artículo o proveedor..."
									size="small"
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
									}}
									sx={{
										width: 250,
										'& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: '0.8125rem' }
									}}
								/>

								<FormControl size="small" sx={{ width: 200 }}>
									<InputLabel id="supplier-filter-label" sx={{ transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' }}>Proveedor</InputLabel>
									<Select
										labelId="supplier-filter-label"
										value={partnerId}
										label="Proveedor"
										onChange={(e) => {
											setPartnerId(e.target.value);
										}}
										sx={{ height: 32, minHeight: 32, fontSize: '0.8125rem' }}
									>
										<MenuItem value="">Todos los Proveedores</MenuItem>
										{suppliersList?.map((s) => (
											<MenuItem key={s.id} value={s.id}>
												{s.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<FormControlLabel
									control={
										<Switch
											checked={isDefaultOnly}
											onChange={(e) => {
												setIsDefaultOnly(e.target.checked);
											}}
											size="small"
											color="primary"
										/>
									}
									label={
										<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
											Solo predeterminados
										</Typography>
									}
									sx={{ ml: 1 }}
								/>

								{(search || partnerId || isDefaultOnly) && (
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
						data={dataRows}
						columns={columns}
						state={{ isLoading }}
						enableRowNumbers={true}
						enableExpanding={true}
						enableRowSelection={false}
						enableRowActions={false}
						renderDetailPanel={({ row }) => {
							const partner = row.original;
							return (
								<Box sx={{ p: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121617' : '#f8fafc' }}>
									<Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5 }}>
										Artículos de {partner.name}
									</Typography>
									<DataTable
										columns={itemColumns}
										data={partner.items}
										enableTopToolbar={false}
										enableBottomToolbar={false}
										enablePagination={false}
										enableRowSelection={false}
										enableRowActions={false}
										enableRowNumbers={true}
										muiTableProps={{
											sx: {
												borderCollapse: 'collapse',
												border: (theme) => `1px solid ${theme.palette.divider}`,
												backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1c2122' : '#ffffff',
												'& .MuiTableCell-root': {
													border: (theme) => `1px solid ${theme.palette.divider}`,
													padding: '4px 8px',
													fontSize: '0.72rem',
													borderRadius: 0
												},
												'& .MuiTableHead-root .MuiTableCell-root': {
													backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2d3536' : '#eaeded',
													fontWeight: 700,
													color: 'text.primary',
													border: (theme) => `1px solid ${theme.palette.divider}`
												}
											}
										}}
									/>
								</Box>
							);
						}}
						initialState={{
							density: 'compact'
						}}
						muiTableBodyRowProps={() => ({
							sx: {
								'&:hover': {
									backgroundColor: (theme: Theme) =>
										theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
								}
							}
						})}
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
									color: 'text.primary',
									border: (theme: Theme) => `1px solid ${theme.palette.divider}`
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
