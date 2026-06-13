import { useState, useMemo } from 'react';
import { Typography, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, Truck, Calendar, User, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, ClipboardList, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useIndexRoutes } from '@/features/routes/hooks/useIndexRoutes';
import { useShowRoute } from '@/features/routes/hooks/useShowRoute';
import { useUpdateRouteStatus } from '@/features/routes/hooks/useUpdateRouteStatus';
import { useUpdateDeliveryStatus } from '@/features/routes/hooks/useUpdateDeliveryStatus';

// Types for route list items and detailed structure
interface RouteListItem {
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

export default function RouteListPage() {
	const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'in_progress'>('all');

	// Delivery Dialog state
	const [deliveryDialog, setDeliveryDialog] = useState<{
		isOpen: boolean;
		documentId: number | null;
		status: 'pending' | 'delivered' | 'failed' | 'rescheduled';
		notes: string;
	}>({
		isOpen: false,
		documentId: null,
		status: 'delivered',
		notes: ''
	});

	// API Hooks
	const { data: routes = [], isLoading: isRoutesLoading } = useIndexRoutes();
	const { data: activeRoute, isLoading: isActiveRouteLoading } = useShowRoute(selectedRouteId);
	
	const { mutate: updateRouteStatus, isPending: isUpdatingStatus } = useUpdateRouteStatus();
	const { mutate: updateDeliveryStatus, isPending: isUpdatingDelivery } = useUpdateDeliveryStatus();

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

	// Filter and search active routes (scheduled, in_progress)
	const filteredRoutes = useMemo(() => {
		const activeRoutes = routes.filter((r) => r.status === 'scheduled' || r.status === 'in_progress');

		return activeRoutes.filter((route: RouteListItem) => {
			const matchesTab = activeTab === 'all' || route.status === activeTab;
			
			const employeeName = route.employee?.full_name || '';
			const matchesSearch = 
				route.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
				employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(route.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
				
			return matchesTab && matchesSearch;
		});
	}, [routes, activeTab, searchQuery]);

	// Counters for active tabs
	const counts = useMemo(() => {
		const activeRoutes = routes.filter((r) => r.status === 'scheduled' || r.status === 'in_progress');
		const total = activeRoutes.length;
		const scheduled = activeRoutes.filter((r) => r.status === 'scheduled').length;
		const inProgress = activeRoutes.filter((r) => r.status === 'in_progress').length;
		return { total, scheduled, inProgress };
	}, [routes]);

	// Handle overall route status change
	const handleStatusChange = (newStatus: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
		if (!selectedRouteId) return;

		updateRouteStatus(
			{ id: selectedRouteId, status: newStatus },
			{
				onSuccess: () => {
					toast.success(`Estado de ruta actualizado a: ${newStatus}`);
				},
				onError: (err) => {
					toast.error(`Error al actualizar estado de la ruta: ${err.message}`);
				}
			}
		);
	};

	// Open delivery status update modal
	const openDeliveryModal = (documentId: number, currentStatus: string, currentNotes?: string | null) => {
		setDeliveryDialog({
			isOpen: true,
			documentId,
			status: (currentStatus as any) || 'delivered',
			notes: currentNotes || ''
		});
	};

	// Save individual document delivery status
	const handleSaveDeliveryStatus = () => {
		if (!selectedRouteId || !deliveryDialog.documentId) return;

		updateDeliveryStatus(
			{
				routeId: selectedRouteId,
				documentId: deliveryDialog.documentId,
				delivery_status: deliveryDialog.status,
				delivery_notes: deliveryDialog.notes
			},
			{
				onSuccess: () => {
					toast.success('Estado de entrega de documento actualizado');
					setDeliveryDialog((prev) => ({ ...prev, isOpen: false }));
				},
				onError: (err) => {
					toast.error(`Error al actualizar entrega: ${err.message}`);
				}
			}
		);
	};

	// Map route status to user friendly labels & styles
	const routeStatusMeta = {
		draft: { label: 'Borrador', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
		scheduled: { label: 'Programada', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
		in_progress: { label: 'En Ruta', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
		completed: { label: 'Completada', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
		cancelled: { label: 'Cancelada', bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' }
	};

	// Map delivery status to user friendly labels & styles
	const deliveryStatusMeta = {
		pending: { label: 'Pendiente', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: <Clock size={14} className="text-amber-600 dark:text-amber-400" /> },
		delivered: { label: 'Entregado', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" /> },
		failed: { label: 'Fallido', bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: <XCircle size={14} className="text-red-600 dark:text-red-400" /> },
		rescheduled: { label: 'Reprogramado', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: <AlertCircle size={14} className="text-blue-600 dark:text-blue-400" /> }
	};

	return (
		<div className="flex flex-col md:flex-row w-full h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
			
			{/* Left Column: Routes List */}
			<div className="w-full md:w-[360px] lg:w-[400px] border-r border-solid border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-[#0f172a] shrink-0 h-full overflow-hidden">
				
				{/* Search & Header */}
				<div className="p-5 border-b border-solid border-slate-100 dark:border-slate-800 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<Typography variant="h6" className="font-extrabold tracking-tight text-slate-800 dark:text-gray-100 text-lg">
							Rutas de Reparto
						</Typography>
						<span className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-[2px] tracking-wide uppercase">
							{counts.total} Total
						</span>
					</div>

					<TextField
						placeholder="Buscar por código, empleado..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						size="small"
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search size={16} className="text-slate-400" />
								</InputAdornment>
							),
							sx: {
								borderRadius: '4px',
								backgroundColor: 'action.hover',
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: 'divider',
								}
							}
						}}
					/>

					{/* Navigation tabs for statuses */}
					<div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
						{[
							{ id: 'all', label: 'Todas', count: counts.total },
							{ id: 'scheduled', label: 'Prog', count: counts.scheduled },
							{ id: 'in_progress', label: 'En Ruta', count: counts.inProgress }
						].map((tab) => {
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id as any)}
									className={clsx(
										'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 border border-solid',
										isActive
											? 'bg-[#005483] text-white border-[#005483] shadow-sm'
											: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
									)}
								>
									{tab.label}
									<span className={clsx(
										'ml-1 text-[9px] px-1 rounded-full',
										isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-900 text-slate-500'
									)}>
										{tab.count}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Scrollable list of routes */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{isRoutesLoading ? (
						<div className="text-center py-10 text-slate-400 dark:text-slate-600">
							Cargando rutas...
						</div>
					) : filteredRoutes.length > 0 ? (
						filteredRoutes.map((route: RouteListItem) => {
							const isSelected = route.id === selectedRouteId;
							const statusMeta = routeStatusMeta[route.status] || routeStatusMeta.draft;

							return (
								<div
									key={route.id}
									onClick={() => setSelectedRouteId(route.id)}
									className={clsx(
										'border border-solid rounded-[4px] p-4 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col gap-3',
										isSelected
											? 'border-[#005483] dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 border-l-[4px]'
											: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c2e]'
									)}
								>
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-1.5">
											<Truck size={16} className="text-[#005483] dark:text-blue-400 shrink-0" />
											<span className="text-xs font-mono font-black text-slate-800 dark:text-gray-200">
												{route.code}
											</span>
										</div>
										<span className={clsx('text-[9px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wider', statusMeta.bg)}>
											{statusMeta.label}
										</span>
									</div>

									<div className="space-y-1.5">
										<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
											<User size={13} className="shrink-0" />
											<span className="text-[11px] font-medium truncate">
												{route.employee?.full_name || 'Empleado sin asignar'}
											</span>
										</div>
										<div className="flex items-center gap-1.5 text-slate-400">
											<Calendar size={13} className="shrink-0" />
											<span className="text-[10px]">
												{formatDate(route.created_at)}
											</span>
										</div>
									</div>

									{route.notes && (
										<div className="text-[10px] text-slate-400 truncate border-t border-solid border-slate-100 dark:border-slate-800 pt-2">
											{route.notes}
										</div>
									)}
								</div>
							);
						})
					) : (
						<div className="text-center py-10 text-slate-400 dark:text-slate-600">
							No se encontraron rutas
						</div>
					)}
				</div>
			</div>

			{/* Right Column: Detailed View */}
			<div className="flex-1 h-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
				{isActiveRouteLoading ? (
					<div className="flex-1 flex items-center justify-center text-slate-400">
						<RefreshCw size={24} className="animate-spin mr-2" />
						Cargando detalle de la ruta...
					</div>
				) : activeRoute ? (
					<div className="flex-1 flex flex-col h-full overflow-hidden">
						
						{/* Detail Header */}
						<div className="p-6 border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shrink-0 flex flex-col gap-4">
							<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
								<div>
									<div className="flex items-center gap-2">
										<Typography variant="h5" className="font-extrabold tracking-tight text-slate-800 dark:text-gray-100">
											Ruta: {activeRoute.code}
										</Typography>
									</div>
									<div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
										<div className="flex items-center gap-1">
											<User size={14} />
											<span>Repartidor/Técnico: <strong>{activeRoute.employee?.full_name || 'N/A'}</strong></span>
										</div>
										<div className="flex items-center gap-1">
											<Calendar size={14} />
											<span>Creado: {formatDate(activeRoute.created_at)}</span>
										</div>
									</div>
								</div>

								{/* Status Transition Control */}
								<div className="flex items-center gap-2">
									<FormControl size="small" className="min-w-[150px]">
										<InputLabel id="route-status-select-label">Estado de Ruta</InputLabel>
										<Select
											labelId="route-status-select-label"
											value={activeRoute.status}
											label="Estado de Ruta"
											disabled={isUpdatingStatus}
											onChange={(e) => handleStatusChange(e.target.value as any)}
											sx={{
												borderRadius: '4px',
												fontSize: '13px',
												fontWeight: 'bold',
											}}
										>
											<MenuItem value="draft" disabled>Borrador</MenuItem>
											<MenuItem value="scheduled">Programada</MenuItem>
											<MenuItem value="in_progress">En Ruta / Proceso</MenuItem>
											<MenuItem value="completed">Completada</MenuItem>
											<MenuItem value="cancelled">Cancelada</MenuItem>
										</Select>
									</FormControl>
								</div>
							</div>

							{activeRoute.notes && (
								<div className="bg-slate-50 dark:bg-slate-900/50 border border-solid border-slate-200 dark:border-slate-800 p-3 rounded-[4px] text-xs text-slate-600 dark:text-slate-400">
									<div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Notas Generales:</div>
									{activeRoute.notes}
								</div>
							)}
						</div>

						{/* Associated Documents Section */}
						<div className="flex-1 overflow-y-auto p-6 space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<ClipboardList size={16} className="text-slate-400" />
									<Typography className="font-black text-xs text-slate-400 uppercase tracking-widest">
										Albaranes Asignados ({activeRoute.documents?.length || 0})
									</Typography>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4">
								{activeRoute.documents && activeRoute.documents.length > 0 ? (
									activeRoute.documents.map((doc: any, index: number) => {
										const delMeta = deliveryStatusMeta[doc.delivery_status as 'pending'] || deliveryStatusMeta.pending;
										
										return (
											<div 
												key={doc.id}
												className="bg-white dark:bg-[#131c2e] border border-solid border-slate-200 dark:border-slate-800 rounded-[4px] p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all duration-200 hover:shadow-md"
											>
												<div className="flex items-start gap-3.5">
													{/* Sequence Circle */}
													<div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
														{index + 1}
													</div>

													<div className="space-y-1">
														<div className="flex items-center gap-2">
															<span className="text-sm font-black font-mono text-slate-800 dark:text-gray-200">
																{doc.number_serie}
															</span>
															<span className={clsx('text-[8px] font-black uppercase px-2 py-0.5 rounded-[2px] flex items-center gap-1', delMeta.bg)}>
																{delMeta.icon}
																<span>{delMeta.label}</span>
															</span>
														</div>

														<Typography className="font-extrabold text-[13px] text-slate-800 dark:text-gray-100">
															{doc.partner_name}
														</Typography>

														<div className="flex items-center gap-1 text-slate-400 text-[11px]">
															<MapPin size={12} className="shrink-0" />
															<span>{doc.partner_address || 'Sin dirección registrada'}</span>
														</div>

														{doc.delivery_notes && (
															<div className="mt-2 text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-[2px] border border-solid border-slate-100 dark:border-slate-800">
																<strong>Motivo/Nota de entrega:</strong> {doc.delivery_notes}
															</div>
														)}
													</div>
												</div>

												<div className="flex flex-col items-end gap-2.5 shrink-0">
													<div className="text-sm font-black text-slate-800 dark:text-gray-200">
														{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(doc.total)}
													</div>
													
													{/* Delivery Update Trigger Button */}
													<button
														disabled={activeRoute.status === 'cancelled' || activeRoute.status === 'completed'}
														onClick={() => openDeliveryModal(doc.id, doc.delivery_status, doc.delivery_notes)}
														className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-[4px] cursor-pointer transition-colors border border-solid border-slate-200 dark:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
													>
														Actualizar Entrega
													</button>
												</div>
											</div>
										);
									})
								) : (
									<div className="text-center py-10 text-slate-400 bg-white dark:bg-[#0f172a] border border-solid border-slate-200 dark:border-slate-800 rounded-[4px]">
										No hay albaranes asignados a esta ruta.
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50 dark:bg-slate-950">
						<ClipboardList size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
						<Typography variant="h6" className="font-extrabold text-slate-700 dark:text-slate-300 text-base">
							Sin Ruta Seleccionada
						</Typography>
						<Typography className="text-xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
							Seleccione una ruta de reparto en la barra lateral izquierda para gestionar sus documentos y actualizar los estados de entregas.
						</Typography>
					</div>
				)}
			</div>

			{/* Dialog to Update Delivery Status & Notes */}
			<Dialog 
				open={deliveryDialog.isOpen} 
				onClose={() => setDeliveryDialog((prev) => ({ ...prev, isOpen: false }))}
				maxWidth="xs"
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
				<DialogTitle className="font-extrabold text-slate-800 dark:text-gray-100 text-base border-b border-solid border-slate-100 dark:border-slate-800 p-5">
					Actualizar Entrega de Albarán
				</DialogTitle>
				<DialogContent className="p-5 flex flex-col gap-4 !pt-5">
					<FormControl fullWidth size="small">
						<InputLabel id="delivery-status-select-label">Estado de la Entrega</InputLabel>
						<Select
							labelId="delivery-status-select-label"
							value={deliveryDialog.status}
							label="Estado de la Entrega"
							onChange={(e) => setDeliveryDialog((prev) => ({ ...prev, status: e.target.value as any }))}
							sx={{ borderRadius: '4px' }}
						>
							<MenuItem value="pending">Pendiente</MenuItem>
							<MenuItem value="delivered">Entregado</MenuItem>
							<MenuItem value="failed">Fallido</MenuItem>
							<MenuItem value="rescheduled">Reprogramado</MenuItem>
						</Select>
					</FormControl>

					<TextField
						label="Observaciones / Motivos"
						placeholder="Escriba aquí si el cliente no estaba, observaciones de entrega, etc..."
						value={deliveryDialog.notes}
						onChange={(e) => setDeliveryDialog((prev) => ({ ...prev, notes: e.target.value }))}
						multiline
						rows={3}
						fullWidth
						InputLabelProps={{ shrink: true }}
						InputProps={{
							sx: { borderRadius: '4px' }
						}}
					/>
				</DialogContent>
				<DialogActions className="border-t border-solid border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/20">
					<button
						onClick={() => setDeliveryDialog((prev) => ({ ...prev, isOpen: false }))}
						className="px-3.5 py-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-[4px] cursor-pointer transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={handleSaveDeliveryStatus}
						disabled={isUpdatingDelivery}
						className="px-3.5 py-1.5 bg-[#005483] hover:bg-[#004369] text-white text-xs font-bold rounded-[4px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
					>
						Guardar
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
