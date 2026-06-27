import { useState, useMemo } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, Theme } from '@mui/material/styles';
import {
	Box,
	Typography,
	Chip,
	IconButton,
	Tooltip,
	Tabs,
	Tab,
	Button
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';
import { useIndexSerialReturns } from '@/features/serial-returns/hooks/useIndexSerialReturns';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import InspectSerialModal from '../components/InspectSerialModal';

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

export default function SerialReturnsPage() {
	const [activeTab, setActiveTab] = useState(0);

	// Modal states
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedReturn, setSelectedReturn] = useState<ItemSerialReturnEntity | null>(null);

	// Load data based on tab (0: Pending, 1: Processed)
	const isProcessedFilter = activeTab === 1;
	const { data: serialReturns = [], isLoading } = useIndexSerialReturns({
		is_processed: isProcessedFilter
	});

	const handleInspectClick = (item: ItemSerialReturnEntity) => {
		setSelectedReturn(item);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setTimeout(() => setSelectedReturn(null), 300);
	};

	// Columns for Pending Tab
	const pendingColumns = useMemo<MRT_ColumnDef<ItemSerialReturnEntity>[]>(
		() => [
			{
				accessorKey: 'item_serial.item.name',
				header: 'Artículo / Producto',
				size: 200,
				Cell: ({ row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{row.original.item_serial?.item?.name || 'Artículo Desconocido'}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							SKU: {row.original.item_serial?.item?.sku || 'N/A'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'item_serial.serial_number',
				header: 'Número de Serial',
				size: 150,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'document.number_serie',
				header: 'Documento Origen',
				size: 160,
				Cell: ({ cell, row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{cell.getValue<string | null>() || `NC-ID: ${row.original.document_id}`}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							{row.original.document?.document_type?.name || 'Nota de Crédito'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'customer_notes',
				header: 'Comentarios Cliente',
				size: 220,
				Cell: ({ cell }) => (
					<Box sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
						<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
							{cell.getValue<string | null>() || '-'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'created_at',
				header: 'Fecha Retorno',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<string>();
					return val ? format(new Date(val), 'dd/MM/yyyy HH:mm') : '-';
				}
			},
			{
				id: 'actions',
				header: 'Acciones',
				size: 100,
				Cell: ({ row }) => (
					<Button
						variant="contained"
						size="small"
						color="primary"
						onClick={() => handleInspectClick(row.original)}
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
						Diagnosticar
					</Button>
				)
			}
		],
		[]
	);

	// Columns for History Tab
	const historyColumns = useMemo<MRT_ColumnDef<ItemSerialReturnEntity>[]>(
		() => [
			{
				accessorKey: 'item_serial.item.name',
				header: 'Artículo / Producto',
				size: 200,
				Cell: ({ row }) => (
					<Box className="flex flex-col py-0.5">
						<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
							{row.original.item_serial?.item?.name || 'Artículo Desconocido'}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
							SKU: {row.original.item_serial?.item?.sku || 'N/A'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'item_serial.serial_number',
				header: 'Número de Serial',
				size: 140,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'item_serial.status',
				header: 'Estado Final',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<string>();
					const isDamaged = val === 'damaged';
					return (
						<Chip
							label={isDamaged ? 'Rechazado (Dañado)' : 'Aprobado (Disponible)'}
							size="small"
							color={isDamaged ? 'error' : 'success'}
							sx={{ fontSize: '0.72rem', borderRadius: 0.5 }}
						/>
					);
				}
			},
			{
				accessorKey: 'reason.name',
				header: 'Motivo Técnico',
				size: 160,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
						{cell.getValue<string | null>() || 'No especificado'}
					</Typography>
				)
			},
			{
				accessorKey: 'technical_notes',
				header: 'Diagnóstico',
				size: 200,
				Cell: ({ cell }) => (
					<Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
						<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
							{cell.getValue<string | null>() || '-'}
						</Typography>
					</Box>
				)
			},
			{
				accessorKey: 'processed_by_user.name',
				header: 'Inspeccionado por',
				size: 140,
				Cell: ({ cell }) => (
					<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
						{cell.getValue<string | null>() || 'Sistema'}
					</Typography>
				)
			},
			{
				accessorKey: 'processed_at',
				header: 'Fecha Inspección',
				size: 120,
				Cell: ({ cell }) => {
					const val = cell.getValue<string | null>();
					return val ? format(new Date(val), 'dd/MM/yyyy HH:mm') : '-';
				}
			},
			{
				id: 'actions',
				header: 'Detalle',
				size: 80,
				Cell: ({ row }) => (
					<Tooltip title="Ver Detalle de Inspección">
						<IconButton
							size="small"
							onClick={() => handleInspectClick(row.original)}
							sx={{ color: '#005483' }}
						>
							<FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
						</IconButton>
					</Tooltip>
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
								Control de Seriales Devueltos (RMA)
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Bandeja técnica para inspección y reingreso de seriales devueltos de facturas anuladas
							</Typography>
						</Box>

						{/* Quick summary chip */}
						{serialReturns.length > 0 && (
							<Chip
								label={`${serialReturns.length} devueltos en lista`}
								color="primary"
								variant="outlined"
								size="small"
								sx={{ fontWeight: 600 }}
							/>
						)}
					</Box>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 2 }}>
						{/* Tabs selection */}
						<Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', mb: 1 }}>
							<Tabs
								value={activeTab}
								onChange={(_, newValue) => setActiveTab(newValue)}
								indicatorColor="primary"
								textColor="primary"
								variant="standard"
							>
								<Tab
									label="Pendientes de Revisión"
									icon={<FuseSvgIcon size={20}>heroicons-outline:wrench-screwdriver</FuseSvgIcon>}
									iconPosition="start"
									sx={{ textTransform: 'none', fontWeight: 600 }}
								/>
								<Tab
									label="Historial de Inspecciones"
									icon={<FuseSvgIcon size={20}>heroicons-outline:clipboard-document-check</FuseSvgIcon>}
									iconPosition="start"
									sx={{ textTransform: 'none', fontWeight: 600 }}
								/>
							</Tabs>
						</Box>

						{/* Tables display */}
						<DataTable
							data={serialReturns}
							columns={activeTab === 0 ? pendingColumns : historyColumns}
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

			{/* Modal for inspection */}
			<InspectSerialModal
				open={modalOpen}
				onClose={handleCloseModal}
				serialReturn={selectedReturn}
			/>
		</>
	);
}
