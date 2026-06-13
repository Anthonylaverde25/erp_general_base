import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import { Box, Typography, Paper, Avatar, Chip, MenuItem, ListItemIcon, TextField, IconButton, Tooltip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format, parseISO, isValid } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { useIndexDocumentsPaginated } from '@/features/documents/hooks/useIndexDocumentsPaginated';
import DataTable from '@/components/data-table/DataTable';
import { RecordPaymentModal } from '@/ui/documents/components/DocumentShow/RecordPayment';
import { MRT_ColumnDef } from 'material-react-table';

const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
}));

export default function ListPending() {
	const navigate = useNavigate();
	const { type } = useParams(); // 'INV' para Ventas, 'PINV' para Compras
	const operation = type === 'INV' ? 'sale' : 'purchase';

	// Estado para la paginación del servidor
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 15,
	});

	// Estados para el filtrado por fechas
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

	// Modal de registro de pagos
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);

	// Filtros dinámicos basados en el tipo
	const statusKeys = useMemo(() => {
		return type === 'INV' ? ['issued', 'partially_collected'] : ['issued', 'partially_paid'];
	}, [type]);

	// Manejadores para actualizar fechas y reiniciar paginación
	const handleStartDateChange = (val: string) => {
		setStartDate(val);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const handleEndDateChange = (val: string) => {
		setEndDate(val);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const handleClearFilters = () => {
		setStartDate('');
		setEndDate('');
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	// Fetch de documentos paginados
	const { data: response, isLoading } = useIndexDocumentsPaginated({
		operation,
		document_type_code: type,
		status: statusKeys,
		page: pagination.pageIndex + 1,
		per_page: pagination.pageSize,
		start_date: startDate || undefined,
		end_date: endDate || undefined,
	});

	const documents = response?.data || [];
	const meta = response?.meta;

	// Cálculo de métricas sobre la página actual
	const totals = useMemo(() => {
		if (!documents.length) {
			return { total: 0, paid: 0, pending: 0 };
		}
		let total = 0;
		let paid = 0;
		let pending = 0;
		documents.forEach((doc) => {
			total += doc.total || 0;
			paid += doc.total_paid || 0;
			pending += doc.balance || 0;
		});
		return { total, paid, pending };
	}, [documents]);

	const pageConfig = useMemo(() => {
		if (type === 'INV') {
			return {
				title: 'Cobros Pendientes',
				partnerLabel: 'Cliente',
				avatarColor: 'primary.main',
				paidLabel: 'Cobrado',
				paymentAction: 'Registrar Cobro',
				paymentIcon: 'heroicons-outline:banknotes'
			};
		}
		return {
			title: 'Pagos Pendientes',
			partnerLabel: 'Proveedor',
			avatarColor: 'secondary.main',
			paidLabel: 'Pagado',
			paymentAction: 'Registrar Pago',
			paymentIcon: 'heroicons-outline:credit-card'
		};
	}, [type]);

	const columns = useMemo<MRT_ColumnDef<DocumentEntity>[]>(() => {
		const basePath = operation === 'sale' ? '/sales' : '/purchases';
		return [
			{
				accessorKey: 'number_serie',
				header: 'Número',
				size: 150,
				Cell: ({ row }) => {
					const doc = row.original;
					return (
						<Box className="flex flex-col py-0.5">
							<Typography
								variant="body2"
								fontWeight={600}
								component={Link}
								to={`${basePath}/view/${doc.id}`}
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									fontSize: '0.8125rem',
									lineHeight: 1.2,
									'&:hover': {
										color: 'primary.main',
										textDecoration: 'underline'
									}
								}}
							>
								{doc.number_serie || (operation === 'purchase' && doc.external_reference ? doc.external_reference : '(Borrador)')}
							</Typography>
							<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
								{doc.document_type_name}
							</Typography>
						</Box>
					);
				}
			},
			{
				accessorKey: 'partner_name',
				header: pageConfig.partnerLabel,
				size: 220,
				Cell: ({ row }) => {
					const doc = row.original;
					const name = doc.partner_name || 'N/A';
					const getInitials = (text: string) => {
						const parts = text.trim().split(' ');
						if (parts.length >= 2) {
							return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
						}
						return text.substring(0, 2).toUpperCase();
					};
					return (
						<Box className="flex items-center gap-2 py-0.5">
							<Avatar
								sx={{
									width: 28,
									height: 28,
									bgcolor: pageConfig.avatarColor,
									fontSize: '0.75rem',
									fontWeight: 600
								}}
							>
								{getInitials(name)}
							</Avatar>
							<Box className="flex flex-col">
								<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}>
									{name}
								</Typography>
								<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
									{doc.partner_email || 'Sin email'}
								</Typography>
							</Box>
						</Box>
					);
				}
			},
			{
				accessorKey: 'issue_date',
				header: 'F. Emisión',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.issue_date ? format(new Date(row.original.issue_date), 'dd/MM/yyyy') : 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'due_date',
				header: 'F. Vencimiento',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.due_date ? format(new Date(row.original.due_date), 'dd/MM/yyyy') : 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'total',
				header: 'Total',
				size: 120,
				Cell: ({ row }) => (
					<Typography variant="body2" fontWeight={500}>
						{currencyFormatter.format(row.original.total)}
					</Typography>
				)
			},
			{
				accessorKey: 'total_paid',
				header: pageConfig.paidLabel,
				size: 120,
				Cell: ({ row }) => (
					<Typography variant="body2" color="success.main">
						{currencyFormatter.format(row.original.total_paid)}
					</Typography>
				)
			},
			{
				accessorKey: 'balance',
				header: 'Pendiente',
				size: 120,
				Cell: ({ row }) => (
					<Typography variant="body2" fontWeight={600} color="error.main">
						{currencyFormatter.format(row.original.balance)}
					</Typography>
				)
			},
			{
				accessorKey: 'status.name',
				header: 'Estado',
				size: 110,
				Cell: ({ row }) => {
					const status = row.original.status;
					if (!status) return null;
					let muiColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
					if (status.key === 'issued') muiColor = 'primary';
					else if (status.key === 'partially_collected' || status.key === 'partially_paid') muiColor = 'warning';
					return (
						<Chip
							label={status.name}
							size="small"
							color={muiColor}
							sx={{ fontSize: '0.72rem' }}
						/>
					);
				}
			}
		];
	}, [operation, pageConfig]);

	const handleOpenPaymentModal = (doc: DocumentEntity) => {
		setSelectedDocument(doc);
		setPaymentModalOpen(true);
	};

	const handleClosePaymentModal = () => {
		setPaymentModalOpen(false);
		setTimeout(() => setSelectedDocument(null), 300);
	};

	return (
		<>
			<Root
				header={
					<Box className="flex flex-col sm:flex-row flex-1 items-center justify-between p-6 sm:p-8">
						<Box className="flex flex-col gap-1">
							<Typography variant="h5" fontWeight={700}>
								{pageConfig.title}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Listado de facturas vigentes con saldos pendientes por conciliar
							</Typography>
						</Box>
						{meta?.total !== undefined && (
							<Chip
								label={`${meta.total} registros pendientes`}
								color="warning"
								variant="outlined"
								size="small"
								sx={{ fontWeight: 600 }}
							/>
						)}
					</Box>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 3 }}>
						{/* Tarjetas de Métricas Aggregated (Page-level) */}
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
							<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, borderRadius: 0 }}>
								<Avatar sx={{ bgcolor: 'blue.100', color: 'blue.800', width: 48, height: 48 }}>
									<FuseSvgIcon>heroicons-outline:document-text</FuseSvgIcon>
								</Avatar>
								<Box>
									<Typography variant="caption" color="text.secondary" fontWeight={500}>Importe Facturado (Pág.)</Typography>
									<Typography variant="h6" fontWeight={700}>{currencyFormatter.format(totals.total)}</Typography>
								</Box>
							</Paper>
							<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, borderRadius: 0 }}>
								<Avatar sx={{ bgcolor: 'green.100', color: 'green.800', width: 48, height: 48 }}>
									<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
								</Avatar>
								<Box>
									<Typography variant="caption" color="text.secondary" fontWeight={500}>Total {pageConfig.paidLabel} (Pág.)</Typography>
									<Typography variant="h6" fontWeight={700} color="success.main">{currencyFormatter.format(totals.paid)}</Typography>
								</Box>
							</Paper>
							<Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, borderRadius: 0 }}>
								<Avatar sx={{ bgcolor: 'amber.100', color: 'amber.800', width: 48, height: 48 }}>
									<FuseSvgIcon>heroicons-outline:exclamation-circle</FuseSvgIcon>
								</Avatar>
								<Box>
									<Typography variant="caption" color="text.secondary" fontWeight={500}>Saldo Pendiente (Pág.)</Typography>
									<Typography variant="h6" fontWeight={700} color="error.main">{currencyFormatter.format(totals.pending)}</Typography>
								</Box>
							</Paper>
						</Box>

						{/* DataTable con paginación del servidor (sin Paper con bordes redondeados) */}
						<DataTable
							renderTopToolbarCustomActions={() => (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0.5 }}>
									<DatePicker
										label="Fecha Desde"
										value={startDate ? parseISO(startDate) : null}
										onChange={(newValue: Date | null) => {
											if (newValue && isValid(newValue)) {
												handleStartDateChange(format(newValue, 'yyyy-MM-dd'));
											} else {
												handleStartDateChange('');
											}
										}}
										format="dd/MM/yyyy"
										slotProps={{
											textField: {
												size: 'small',
												sx: {
													width: 170,
													'& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: '0.8125rem' },
													'& .MuiInputLabel-root': { transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' },
													'& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)', bgcolor: 'background.paper', px: 0.5 }
												}
											}
										}}
									/>
									<DatePicker
										label="Fecha Hasta"
										value={endDate ? parseISO(endDate) : null}
										onChange={(newValue: Date | null) => {
											if (newValue && isValid(newValue)) {
												handleEndDateChange(format(newValue, 'yyyy-MM-dd'));
											} else {
												handleEndDateChange('');
											}
										}}
										format="dd/MM/yyyy"
										slotProps={{
											textField: {
												size: 'small',
												sx: {
													width: 170,
													'& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: '0.8125rem' },
													'& .MuiInputLabel-root': { transform: 'translate(14px, 7px) scale(1)', fontSize: '0.8125rem' },
													'& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)', bgcolor: 'background.paper', px: 0.5 }
												}
											}
										}}
									/>
									{(startDate || endDate) && (
										<Tooltip title="Limpiar filtros de fecha">
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
							data={documents}
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
										borderRadius: 0,
									},
									'& .MuiTableHead-root .MuiTableCell-root': {
										backgroundColor: (theme: Theme) =>
											theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
										fontWeight: 700,
										color: 'text.primary',
									}
								}
							}}
							muiTableBodyRowProps={({ row }) => {
								const basePath = operation === 'sale' ? '/sales' : '/purchases';
								return {
									onClick: () => navigate(`${basePath}/view/${row.original.id}`),
									sx: {
										cursor: 'pointer',
										backgroundColor: (theme: Theme) =>
											row.index % 2 === 0
												? 'transparent'
												: theme.palette.mode === 'dark'
													? 'rgba(255, 255, 255, 0.02)'
													: 'rgba(0, 0, 0, 0.01)',
										'&:hover': {
											backgroundColor: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? 'rgba(255, 255, 255, 0.06)'
													: 'rgba(0, 0, 0, 0.03)',
										},
										boxShadow: 'none',
									}
								};
							}}
							renderRowActionMenuItems={({ closeMenu, row }) => [
								<MenuItem
									key="view"
									onClick={() => {
										const basePath = operation === 'sale' ? '/sales' : '/purchases';
										navigate(`${basePath}/view/${row.original.id}`);
										closeMenu();
									}}
								>
									<ListItemIcon>
										<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
									</ListItemIcon>
									Ver detalle
								</MenuItem>,
								<MenuItem
									key="payment"
									onClick={() => {
										handleOpenPaymentModal(row.original);
										closeMenu();
									}}
								>
									<ListItemIcon>
										<FuseSvgIcon>{pageConfig.paymentIcon}</FuseSvgIcon>
									</ListItemIcon>
									{pageConfig.paymentAction}
								</MenuItem>
							]}
						/>
					</Box>
				}
				scroll="content"
			/>

			{selectedDocument && (
				<RecordPaymentModal
					open={paymentModalOpen}
					onClose={handleClosePaymentModal}
					document={selectedDocument}
				/>
			)}
		</>
	);
}