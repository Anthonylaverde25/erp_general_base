import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import { Box, Typography, Paper, Avatar, Chip, MenuItem, ListItemIcon, IconButton, Tooltip, Menu, ListItemText } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format, parseISO, isValid } from 'date-fns';
import { useIndexAccountingDocuments } from '@/features/documents/hooks/useIndexAccountingDocuments';
import DataTable from '@/components/data-table/DataTable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MRT_ColumnDef } from 'material-react-table';
import { pdf } from '@react-pdf/renderer';
import AccountingPDFDocument from './AccountingPDFDocument';
import axiosInstance from '@/lib/@axios';
import useActiveCompany from '@/features/companies/useActiveCompany';

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

export default function ListAccounting() {
	const navigate = useNavigate();
	const { type = 'INV' } = useParams(); // 'INV' para Ventas, 'PINV' para Compras
	const operation = type === 'INV' ? 'sale' : 'purchase';

	// Estado para la paginación del servidor
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 15,
	});

	// Estados para el filtrado por fechas
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

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



	// Fetch de documentos contables paginados
	const { data: response, isLoading } = useIndexAccountingDocuments({
		operation,
		document_type_code: type,
		page: pagination.pageIndex + 1,
		per_page: pagination.pageSize,
		start_date: startDate || undefined,
		end_date: endDate || undefined,
	});

	const documents = response?.data || [];
	const meta = response?.meta;

	const activeCompany = useActiveCompany();

	// Estado para la selección de filas en la tabla
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	// Mapear los índices seleccionados a los objetos de documentos reales
	const selectedDocuments = useMemo(() => {
		return Object.keys(rowSelection)
			.filter((key) => rowSelection[key])
			.map((index) => documents[Number(index)])
			.filter(Boolean);
	}, [rowSelection, documents]);

	// Estado para el anclaje del menú de exportaciones
	const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState<null | HTMLElement>(null);
	const isExportMenuOpen = Boolean(exportMenuAnchorEl);

	const handleExportMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setExportMenuAnchorEl(event.currentTarget);
	};

	const handleExportMenuClose = () => {
		setExportMenuAnchorEl(null);
	};

	// Función para obtener todos los registros que cumplen con los filtros actuales
	const fetchAllDocumentsForExport = async () => {
		try {
			const { data } = await axiosInstance.get('documents/accounting', {
				params: {
					operation,
					document_type_code: type,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
					per_page: 9999
				}
			});
			return data?.data || [];
		} catch (error) {
			console.error('Error fetching documents for export:', error);
			return [];
		}
	};

	const getXML = (dataToExport: any[]) => {
		let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<accounting_list>\n';
		dataToExport.forEach((doc) => {
			xmlString += '  <document>\n';
			xmlString += `    <id>${doc.id}</id>\n`;
			xmlString += `    <number>${doc.number_serie || ''}</number>\n`;
			xmlString += `    <partner>${doc.partner_name || ''}</partner>\n`;
			xmlString += `    <date>${doc.issue_date || ''}</date>\n`;
			xmlString += `    <subtotal>${doc.subtotal || 0}</subtotal>\n`;

			// Taxes
			xmlString += '    <taxes>\n';
			(doc.tax_summaries || []).forEach((s: any) => {
				xmlString += '      <tax>\n';
				xmlString += `        <name>${s.name}</name>\n`;
				xmlString += `        <rate>${s.rate}</rate>\n`;
				xmlString += `        <type>${s.tax_type_code}</type>\n`;
				xmlString += `        <amount>${s.tax_amount}</amount>\n`;
				xmlString += '      </tax>\n';
			});
			xmlString += '    </taxes>\n';

			xmlString += `    <discount>${doc.discount_total || 0}</discount>\n`;
			xmlString += `    <total>${doc.total || 0}</total>\n`;
			xmlString += `    <payment_method>${doc.payment_method_name || ''}</payment_method>\n`;
			xmlString += `    <status>${doc.status?.name || ''}</status>\n`;
			xmlString += '  </document>\n';
		});
		xmlString += '</accounting_list>';
		return xmlString;
	};

	const exportToXML = (dataToExport: any[]) => {
		const xml = getXML(dataToExport);
		const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `listado_contable_${new Date().toISOString().split('T')[0]}.xml`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToCSV = (dataToExport: any[]) => {
		const headers = ['Numero', 'Cliente/Proveedor', 'Fecha', 'Base Imponible', 'IVA', 'Retenciones', 'Recargo Eq.', 'Descuento', 'Total', 'Metodo de Pago', 'Estado'];
		const rows = dataToExport.map((doc) => {
			const formattedDate = doc.issue_date ? doc.issue_date.split('-').reverse().join('/') : 'N/A';
			const formatTax = (typeCode: string) =>
				(doc.tax_summaries || [])
					.filter((s: any) => s.tax_type_code === typeCode)
					.map((s: any) => `${s.name}: ${currencyFormatter.format(s.tax_amount)}`)
					.join('; ');

			return [
				doc.number_serie,
				doc.partner_name || 'N/A',
				formattedDate,
				currencyFormatter.format(doc.subtotal),
				formatTax('vat') || 'No aplica',
				formatTax('withholding') || 'No aplica',
				formatTax('surcharge') || 'No aplica',
				currencyFormatter.format(doc.discount_total),
				currencyFormatter.format(doc.total),
				doc.payment_method_name || 'N/A',
				doc.status?.name || 'N/A'
			];
		});

		const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `listado_contable_${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToPDF = async (dataToExport: any[]) => {
		const docTitle = type === 'INV' ? 'Listado Contable (Ventas)' : 'Listado Contable (Compras)';
		const docSubtitle = `Filtros - Desde: ${startDate || 'Inicio'} Hasta: ${endDate || 'Fin'}`;
		const blob = await pdf(
			<AccountingPDFDocument
				title={docTitle}
				subtitle={docSubtitle}
				companyName={activeCompany?.name}
				data={dataToExport}
			/>
		).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `listado_contable_${new Date().toISOString().split('T')[0]}.pdf`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Cálculo de métricas sobre la página actual
	const totals = useMemo(() => {
		if (!documents.length) {
			return { subtotal: 0, tax: 0, discount: 0, total: 0 };
		}
		let subtotal = 0;
		let tax = 0;
		let discount = 0;
		let total = 0;
		documents.forEach((doc) => {
			subtotal += doc.subtotal || 0;
			tax += doc.tax_total || 0;
			discount += doc.discount_total || 0;
			total += doc.total || 0;
		});
		return { subtotal, tax, discount, total };
	}, [documents]);

	const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
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
								{doc.number_serie}
							</Typography>
							<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
								{doc.series ? `Serie: ${doc.series}` : 'Sin serie'}
							</Typography>
						</Box>
					);
				}
			},
			{
				accessorKey: 'partner_name',
				header: type === 'INV' ? 'Cliente' : 'Proveedor',
				size: 220,
				Cell: ({ row }) => {
					const name = row.original.partner_name || 'N/A';
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
									bgcolor: type === 'INV' ? 'primary.main' : 'secondary.main',
									fontSize: '0.75rem',
									fontWeight: 600
								}}
							>
								{getInitials(name)}
							</Avatar>
							<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}>
								{name}
							</Typography>
						</Box>
					);
				}
			},
			{
				accessorKey: 'issue_date',
				header: 'Fecha',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2">
						{row.original.issue_date ? format(parseISO(row.original.issue_date), 'dd/MM/yyyy') : 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'subtotal',
				header: 'Base Imponible',
				size: 125,
				Cell: ({ row }) => (
					<Typography variant="body2" fontWeight={500}>
						{currencyFormatter.format(row.original.subtotal)}
					</Typography>
				)
			},
			{
				accessorKey: 'tax_vat',
				header: 'IVA',
				size: 160,
				Cell: ({ row }) => {
					const doc = row.original;
					const summaries = (doc.tax_summaries || []).filter((s: any) => s.tax_type_code === 'vat');
					if (summaries.length === 0) return <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>No aplica</Typography>;
					return (
						<Box className="flex flex-col py-0.5">
							{summaries.map((summary: any, index: number) => (
								<Typography key={index} variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
									<span style={{ color: 'var(--mui-palette-text-secondary)' }}>{summary.name}:</span>{' '}
									<span style={{ fontWeight: 500 }}>{currencyFormatter.format(summary.tax_amount)}</span>
								</Typography>
							))}
						</Box>
					);
				}
			},
			{
				accessorKey: 'tax_withholding',
				header: 'Retenciones',
				size: 160,
				Cell: ({ row }) => {
					const doc = row.original;
					const summaries = (doc.tax_summaries || []).filter((s: any) => s.tax_type_code === 'withholding');
					if (summaries.length === 0) return <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>No aplica</Typography>;
					return (
						<Box className="flex flex-col py-0.5">
							{summaries.map((summary: any, index: number) => (
								<Typography key={index} variant="caption" color="error.main" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
									<span style={{ color: 'var(--mui-palette-text-secondary)' }}>{summary.name}:</span>{' '}
									<span style={{ fontWeight: 500 }}>
										{currencyFormatter.format(summary.tax_amount)}
									</span>
								</Typography>
							))}
							{summaries.length > 1 && (
								<Typography variant="caption" color="error.main" sx={{ fontSize: '0.75rem', fontWeight: 600, borderTop: '1px solid', borderColor: 'divider', mt: 0.5, pt: 0.5 }}>
									Total: {currencyFormatter.format(summaries.reduce((sum: number, s: any) => sum + s.tax_amount, 0))}
								</Typography>
							)}
						</Box>
					);
				}
			},
			{
				accessorKey: 'tax_surcharge',
				header: 'Recargo Eq.',
				size: 160,
				Cell: ({ row }) => {
					const doc = row.original;
					const summaries = (doc.tax_summaries || []).filter((s: any) => s.tax_type_code === 'surcharge');
					if (summaries.length === 0) return <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>No aplica</Typography>;
					return (
						<Box className="flex flex-col py-0.5">
							{summaries.map((summary: any, index: number) => (
								<Typography key={index} variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
									<span style={{ color: 'var(--mui-palette-text-secondary)' }}>{summary.name}:</span>{' '}
									<span style={{ fontWeight: 500 }}>{currencyFormatter.format(summary.tax_amount)}</span>
								</Typography>
							))}
							{summaries.length > 1 && (
								<Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, borderTop: '1px solid', borderColor: 'divider', mt: 0.5, pt: 0.5 }}>
									Total: {currencyFormatter.format(summaries.reduce((sum: number, s: any) => sum + s.tax_amount, 0))}
								</Typography>
							)}
						</Box>
					);
				}
			},
			{
				accessorKey: 'discount_total',
				header: 'Descuento',
				size: 90,
				Cell: ({ row }) => (
					<Typography variant="body2" color="error.main" fontWeight={500}>
						{currencyFormatter.format(row.original.discount_total)}
					</Typography>
				)
			},
			{
				accessorKey: 'total',
				header: 'Total',
				size: 125,
				Cell: ({ row }) => (
					<Typography variant="body2" fontWeight={600}>
						{currencyFormatter.format(row.original.total)}
					</Typography>
				)
			},
			{
				accessorKey: 'payment_method_name',
				header: 'Método de Pago',
				size: 120,
				Cell: ({ row }) => (
					<Chip
						label={row.original.payment_method_name}
						variant="outlined"
						size="small"
						sx={{ fontSize: '0.72rem', height: 20 }}
					/>
				)
			},
			{
				accessorKey: 'status.name',
				header: 'Estado',
				size: 90,
				Cell: ({ row }) => {
					const status = row.original.status;
					if (!status) return null;
					let muiColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
					if (status.key === 'issued') muiColor = 'primary';
					else if (status.key === 'partially_collected' || status.key === 'partially_paid') muiColor = 'warning';
					else if (status.key === 'paid' || status.key === 'collected') muiColor = 'success';
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
	}, [type, operation]);

	return (
		<Root
			header={
				<Box className="flex flex-col flex-1">
					<Box className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
						<Box className="flex flex-col gap-1">
							<Typography variant="h5" fontWeight={700}>
								{type === 'INV' ? 'Listado Contable (Ventas)' : 'Listado Contable (Compras)'}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{type === 'INV'
									? 'Resumen contable desglosado de facturas emitidas'
									: 'Resumen contable desglosado de facturas recibidas'}
							</Typography>
						</Box>
						{meta?.total !== undefined && (
							<Chip
								label={`${meta.total} registros contables`}
								color="primary"
								variant="outlined"
								size="small"
								sx={{ fontWeight: 600 }}
							/>
						)}
					</Box>
				</Box>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 3 }}>
					{/* Tarjetas de Métricas de Página */}
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
						<Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0 }}>
							<Avatar sx={{ bgcolor: 'grey.100', color: 'grey.700', width: 44, height: 44 }}>
								<FuseSvgIcon>heroicons-outline:document-text</FuseSvgIcon>
							</Avatar>
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={500}>Base Imponible (Pág.)</Typography>
								<Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.125rem' }}>{currencyFormatter.format(totals.subtotal)}</Typography>
							</Box>
						</Paper>
						<Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0 }}>
							<Avatar sx={{ bgcolor: 'amber.100', color: 'amber.800', width: 44, height: 44 }}>
								<FuseSvgIcon>heroicons-outline:receipt-percent</FuseSvgIcon>
							</Avatar>
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={500}>Total IVA (Pág.)</Typography>
								<Typography variant="h6" fontWeight={700} color="warning.main" sx={{ fontSize: '1.125rem' }}>{currencyFormatter.format(totals.tax)}</Typography>
							</Box>
						</Paper>
						<Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0 }}>
							<Avatar sx={{ bgcolor: 'rose.100', color: 'rose.800', width: 44, height: 44 }}>
								<FuseSvgIcon>heroicons-outline:tag</FuseSvgIcon>
							</Avatar>
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={500}>Descuentos (Pág.)</Typography>
								<Typography variant="h6" fontWeight={700} color="error.main" sx={{ fontSize: '1.125rem' }}>{currencyFormatter.format(totals.discount)}</Typography>
							</Box>
						</Paper>
						<Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0 }}>
							<Avatar sx={{ bgcolor: 'green.100', color: 'green.800', width: 44, height: 44 }}>
								<FuseSvgIcon>heroicons-outline:banknotes</FuseSvgIcon>
							</Avatar>
							<Box>
								<Typography variant="caption" color="text.secondary" fontWeight={500}>Total Factura (Pág.)</Typography>
								<Typography variant="h6" fontWeight={700} color="success.main" sx={{ fontSize: '1.125rem' }}>{currencyFormatter.format(totals.total)}</Typography>
							</Box>
						</Paper>
					</Box>

					{/* DataTable contable */}
					<DataTable
						renderTopToolbarCustomActions={() => (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0.5 }}>
								{/* Botón de 3 puntos a la izquierda */}
								<Tooltip title="Opciones de exportación">
									<IconButton
										onClick={handleExportMenuClick}
										color="primary"
										size="small"
									>
										<FuseSvgIcon>heroicons-outline:ellipsis-vertical</FuseSvgIcon>
									</IconButton>
								</Tooltip>

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

								<Menu
									anchorEl={exportMenuAnchorEl}
									open={isExportMenuOpen}
									onClose={handleExportMenuClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
								>
									<MenuItem disabled sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', py: 0.5 }}>
										Exportar Seleccionados ({selectedDocuments.length})
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											exportToXML(selectedDocuments);
										}}
										disabled={selectedDocuments.length === 0}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-text</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar XML" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											exportToCSV(selectedDocuments);
										}}
										disabled={selectedDocuments.length === 0}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-chart-bar</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar CSV" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											await exportToPDF(selectedDocuments);
										}}
										disabled={selectedDocuments.length === 0}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-arrow-down</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar PDF" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>

									<MenuItem disabled sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', py: 0.5, borderTop: '1px solid', borderColor: 'divider', mt: 1 }}>
										Exportar Todos
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											const allDocs = await fetchAllDocumentsForExport();
											exportToXML(allDocs);
										}}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-text</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar XML (Todos)" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											const allDocs = await fetchAllDocumentsForExport();
											exportToCSV(allDocs);
										}}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-chart-bar</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar CSV (Todos)" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleExportMenuClose();
											const allDocs = await fetchAllDocumentsForExport();
											await exportToPDF(allDocs);
										}}
									>
										<ListItemIcon sx={{ minWidth: 28 }}><FuseSvgIcon size={18}>heroicons-outline:document-arrow-down</FuseSvgIcon></ListItemIcon>
										<ListItemText primary="Descargar PDF (Todos)" primaryTypographyProps={{ fontSize: '0.8125rem' }} />
									</MenuItem>
								</Menu>
							</Box>
						)}
						data={documents}
						columns={columns}
						state={{ isLoading, pagination, rowSelection }}
						onPaginationChange={setPagination}
						onRowSelectionChange={setRowSelection}
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
								onClick: (e) => {
									const isCheckboxClick = (e.target as HTMLElement).closest('.MuiTableCell-paddingCheckbox') || (e.target as HTMLElement).closest('.MuiCheckbox-root');
									if (!isCheckboxClick) {
										navigate(`${basePath}/view/${row.original.id}`);
									}
								},
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
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}