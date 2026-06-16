import { useMemo } from 'react';
import { Box, Chip, Typography, Theme } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import DataTable from '@/components/data-table/DataTable';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { Link } from 'react-router';
import { format } from 'date-fns';
import FuseLoading from '@fuse/core/FuseLoading';

interface PartnerDocumentsTabProps {
	partnerId: number;
}

const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export default function PartnerDocumentsTab({ partnerId }: PartnerDocumentsTabProps) {
	const { data: documents, isLoading } = useIndexDocuments({ partner_id: partnerId });

	const columns = useMemo<MRT_ColumnDef<DocumentEntity>[]>(() => {
		return [
			{
				accessorKey: 'number_serie',
				header: 'Número',
				size: 160,
				Cell: ({ row }) => {
					const doc = row.original;
					const operation = doc.operation; // 'sale' or 'purchase'
					const basePath = operation === 'sale' ? '/sales' : '/purchases';

					const displayText = doc.number_serie || 
						(operation === 'purchase' && doc.external_reference ? doc.external_reference : 
						(doc.status?.key === 'draft' ? '(Borrador)' : 'Sin número'));

					return (
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
							{displayText}
						</Typography>
					);
				}
			},
			{
				accessorKey: 'document_type_name',
				header: 'Tipo',
				size: 130
			},
			{
				accessorKey: 'operation',
				header: 'Operación',
				size: 110,
				Cell: ({ row }) => {
					const isSale = row.original.operation === 'sale';
					return (
						<Chip
							label={isSale ? 'Venta' : 'Compra'}
							size="small"
							variant="outlined"
							color={isSale ? 'success' : 'info'}
							sx={{ fontSize: '0.7rem', height: 20 }}
						/>
					);
				}
			},
			{
				accessorKey: 'issue_date',
				header: 'Fecha',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
						{row.original.issue_date ? format(new Date(row.original.issue_date), 'dd/MM/yyyy') : 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'total',
				header: 'Total',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
						{currencyFormatter.format(row.original.total)}
					</Typography>
				)
			},
			{
				accessorKey: 'total_paid',
				header: 'Pagado',
				size: 110,
				Cell: ({ row }) => (
					<Typography variant="body2" color="success.main" sx={{ fontSize: '0.8125rem' }}>
						{currencyFormatter.format(row.original.total_paid || 0)}
					</Typography>
				)
			},
			{
				id: 'balance',
				header: 'Pendiente',
				size: 110,
				Cell: ({ row }) => {
					const balance = (row.original.total || 0) - (row.original.total_paid || 0);
					const isOverdue = balance > 0 && row.original.due_date && new Date(row.original.due_date) < new Date();
					return (
						<Typography 
							variant="body2" 
							fontWeight={600} 
							color={balance > 0 ? (isOverdue ? 'error.main' : 'warning.main') : 'text.secondary'}
							sx={{ fontSize: '0.8125rem' }}
						>
							{currencyFormatter.format(balance)}
						</Typography>
					);
				}
			},
			{
				accessorKey: 'status.name',
				header: 'Estado',
				size: 120,
				Cell: ({ row }) => {
					const status = row.original.status;
					if (!status) return null;

					let muiColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
					const validColors = ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'];

					if (status.color && validColors.includes(status.color)) {
						muiColor = status.color as any;
					} else if (status.key === 'issued') {
						muiColor = 'success';
					} else if (status.key === 'converted') {
						muiColor = 'default';
					} else if (status.key === 'partially_converted') {
						muiColor = 'warning';
					} else if (status.key === 'draft') {
						muiColor = 'warning';
					} else if (status.key === 'cancelled') {
						muiColor = 'error';
					}

					return (
						<Chip
							label={status.name}
							size="small"
							variant="filled"
							color={muiColor}
							sx={{ fontSize: '0.75rem' }}
						/>
					);
				}
			}
		];
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Box className="w-full h-full p-6">
			<DataTable
				data={documents || []}
				columns={columns}
				state={{ isLoading }}
				enablePagination
				enableRowNumbers
				rowNumberDisplayMode="static"
				initialState={{
					density: 'compact',
					showColumnFilters: false,
					pagination: { pageSize: 15, pageIndex: 0 },
					showGlobalFilter: true,
					columnPinning: { left: ['mrt-row-numbers'] }
				}}
				muiPaginationProps={{
					rowsPerPageOptions: [5, 10, 25],
					variant: 'outlined',
					showRowsPerPage: true
				}}
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
				muiTableBodyRowProps={() => ({
					sx: {
						backgroundColor: (theme: Theme) => 'transparent',
						'&:hover': {
							backgroundColor: (theme: Theme) =>
								theme.palette.mode === 'dark'
									? 'rgba(255, 255, 255, 0.06)'
									: 'rgba(0, 0, 0, 0.03)',
						},
						boxShadow: 'none',
					}
				})}
			/>
		</Box>
	);
}
