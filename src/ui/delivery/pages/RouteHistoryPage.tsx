import { useState, useMemo } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Eye, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, ClipboardList, RefreshCw, Calendar, User } from 'lucide-react';
import clsx from 'clsx';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { useIndexRoutes } from '@/features/routes/hooks/useIndexRoutes';
import { useShowRoute } from '@/features/routes/hooks/useShowRoute';

interface RouteHistoryItem {
	id: number;
	code: string;
	status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
	employee_id: number;
	notes: string | null;
	company_id: number;
	created_at: string;
	employee?: {
		id: number;
		full_name: string;
	};
}

export default function RouteHistoryPage() {
	const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// API Hooks
	const { data: routes = [], isLoading: isRoutesLoading } = useIndexRoutes();
	const { data: activeRoute, isLoading: isActiveRouteLoading } = useShowRoute(selectedRouteId);

	// Filter only completed and cancelled routes
	const historyRoutes = useMemo(() => {
		return routes.filter((r) => r.status === 'completed' || r.status === 'cancelled');
	}, [routes]);

	// Format helper for dates
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('es-ES', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch (e) {
			return dateString;
		}
	};

	// Map route status to user friendly labels & styles
	const routeStatusMeta = {
		completed: { label: 'Completada', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
		cancelled: { label: 'Cancelada', bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
		draft: { label: 'Borrador', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800' },
		scheduled: { label: 'Programada', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
		in_progress: { label: 'En Ruta', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' }
	};

	// Map delivery status to user friendly labels & styles
	const deliveryStatusMeta = {
		pending: { label: 'Pendiente', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: <Clock size={14} className="text-amber-600 dark:text-amber-400" /> },
		delivered: { label: 'Entregado', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" /> },
		failed: { label: 'Fallido', bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: <XCircle size={14} className="text-red-600 dark:text-red-400" /> },
		rescheduled: { label: 'Reprogramado', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: <AlertCircle size={14} className="text-blue-600 dark:text-blue-400" /> }
	};

	const columns = useMemo<MRT_ColumnDef<RouteHistoryItem>[]>(
		() => [
			{
				accessorKey: 'code',
				header: 'Código de Ruta',
				Cell: ({ cell }) => (
					<span className="font-mono font-bold text-slate-800 dark:text-slate-200">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'employee.full_name',
				header: 'Repartidor/Técnico',
				Cell: ({ row }) => row.original.employee?.full_name || 'Sin asignar'
			},
			{
				accessorKey: 'created_at',
				header: 'Fecha de Ejecución',
				Cell: ({ cell }) => formatDate(cell.getValue<string>())
			},
			{
				accessorKey: 'status',
				header: 'Estado',
				Cell: ({ cell }) => {
					const val = cell.getValue<'completed' | 'cancelled'>();
					const meta = routeStatusMeta[val] || { label: val, bg: 'bg-slate-100 text-slate-700' };
					return (
						<span className={clsx('text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wide', meta.bg)}>
							{meta.label}
						</span>
					);
				}
			},
			{
				accessorKey: 'notes',
				header: 'Observaciones',
				Cell: ({ cell }) => (
					<span className="text-slate-400 truncate max-w-[200px] block">
						{cell.getValue<string | null>() || '-'}
					</span>
				)
			}
		],
		[]
	);

	return (
		<div className="flex flex-col w-full h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
			
			{/* Header */}
			<div className="p-6 border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shrink-0 flex items-center justify-between">
				<div>
					<Typography variant="h5" className="font-extrabold tracking-tight text-slate-800 dark:text-gray-100">
						Historial de Rutas Concluidas
					</Typography>
					<Typography className="text-xs text-slate-400 mt-1">
						Registro histórico de repartos completados o cancelados y su auditoría de entregas.
					</Typography>
				</div>
			</div>

			{/* Table Container */}
			<div className="flex-1 p-6 overflow-hidden flex flex-col">
				<div className="flex-1 bg-white dark:bg-[#0f172a] border border-solid border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden flex flex-col">
					<DataTable
						columns={columns}
						data={historyRoutes}
						state={{ isLoading: isRoutesLoading }}
						enableRowActions
						renderRowActions={({ row }) => (
							<button
								onClick={() => {
									setSelectedRouteId(row.original.id);
									setIsDetailOpen(true);
								}}
								className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-[4px] cursor-pointer transition-colors border border-solid border-slate-200 dark:border-transparent"
							>
								<Eye size={14} />
								<span>Detalles</span>
							</button>
						)}
					/>
				</div>
			</div>

			{/* Read-only Route Detail Dialog */}
			<Dialog
				open={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: '6px',
						backgroundImage: 'none',
						backgroundColor: 'background.paper',
						boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
					}
				}}
			>
				{isActiveRouteLoading ? (
					<div className="p-10 flex flex-col items-center justify-center text-slate-400">
						<RefreshCw size={24} className="animate-spin mb-2" />
						Cargando información histórica...
					</div>
				) : activeRoute ? (
					<>
						<DialogTitle className="font-extrabold text-slate-800 dark:text-gray-100 text-lg border-b border-solid border-slate-100 dark:border-slate-800 p-5 flex justify-between items-center">
							<span>Historial de Ruta: {activeRoute.code}</span>
							<span className={clsx(
								'text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wide',
								routeStatusMeta[activeRoute.status as 'completed']?.bg || 'bg-slate-100 text-slate-700'
							)}>
								{routeStatusMeta[activeRoute.status as 'completed']?.label || activeRoute.status}
							</span>
						</DialogTitle>
						<DialogContent className="p-6 space-y-5">
							{/* Route Header Info Card */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[4px] border border-solid border-slate-150 dark:border-slate-800">
								<div className="space-y-2">
									<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
										<User size={15} />
										<span>Repartidor/Técnico: <strong>{activeRoute.employee?.full_name || 'N/A'}</strong></span>
									</div>
									<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
										<Calendar size={15} />
										<span>Fecha Ejecución: <strong>{formatDate(activeRoute.created_at)}</strong></span>
									</div>
								</div>
								{activeRoute.notes && (
									<div className="text-xs text-slate-500 dark:text-slate-400 border-t md:border-t-0 md:border-l border-solid border-slate-200 dark:border-slate-700 pt-2 md:pt-0 md:pl-4">
										<strong>Notas Generales:</strong>
										<p className="mt-1">{activeRoute.notes}</p>
									</div>
								)}
							</div>

							{/* Document List */}
							<div className="space-y-3">
								<div className="flex items-center gap-1.5 text-slate-400">
									<ClipboardList size={16} />
									<span className="font-black text-[10px] uppercase tracking-wider">
										Albaranes Entregados ({activeRoute.documents?.length || 0})
									</span>
								</div>

								<div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
									{activeRoute.documents && activeRoute.documents.length > 0 ? (
										activeRoute.documents.map((doc: any, index: number) => {
											const delMeta = deliveryStatusMeta[doc.delivery_status as 'pending'] || deliveryStatusMeta.pending;
											return (
												<div
													key={doc.id}
													className="border border-solid border-slate-200 dark:border-slate-800 rounded-[4px] p-4 bg-white dark:bg-[#131c2e] flex flex-col md:flex-row justify-between md:items-center gap-3"
												>
													<div className="flex items-start gap-3">
														<div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
															{index + 1}
														</div>
														<div className="space-y-1">
															<div className="flex items-center gap-2">
																<span className="text-xs font-mono font-bold text-slate-800 dark:text-gray-200">
																	{doc.number_serie}
																</span>
																<span className={clsx('text-[8px] font-black uppercase px-2 py-0.5 rounded-[2px] flex items-center gap-1', delMeta.bg)}>
																	{delMeta.icon}
																	<span>{delMeta.label}</span>
																</span>
															</div>
															<Typography className="font-extrabold text-[12px] text-slate-800 dark:text-gray-100">
																{doc.partner_name}
															</Typography>
															<div className="flex items-center gap-1 text-slate-400 text-[10px]">
																<MapPin size={11} className="shrink-0" />
																<span>{doc.partner_address || 'Sin dirección registrada'}</span>
															</div>
															{doc.delivery_notes && (
																<div className="mt-1.5 text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-[2px] border border-solid border-slate-100 dark:border-slate-800">
																	<strong>Nota de entrega:</strong> {doc.delivery_notes}
																</div>
															)}
														</div>
													</div>
													<div className="text-xs font-black text-slate-800 dark:text-gray-200 shrink-0 text-right">
														{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(doc.total)}
													</div>
												</div>
											);
										})
									) : (
										<div className="text-center py-6 text-xs text-slate-400">
											No hay albaranes asociados.
										</div>
									)}
								</div>
							</div>
						</DialogContent>
						<DialogActions className="border-t border-solid border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/20">
							<button
								onClick={() => setIsDetailOpen(false)}
								className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-[4px] cursor-pointer transition-colors border border-solid border-slate-255 dark:border-transparent"
							>
								Cerrar
							</button>
						</DialogActions>
					</>
				) : (
					<div className="p-10 text-center text-slate-400">
						No se encontró la ruta.
					</div>
				)}
			</Dialog>
		</div>
	);
}
