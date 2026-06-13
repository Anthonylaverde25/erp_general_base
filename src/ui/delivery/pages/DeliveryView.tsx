import { useState, useRef, useMemo, useEffect } from 'react';
import { Typography, TextField, InputAdornment, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { Search, MapPin, Clock, AlertTriangle, Plus, Minus, Layers, RotateCcw, X } from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '@mui/material/styles';
import { toast } from 'sonner';
import { useParams, Navigate, useLocation } from 'react-router';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import { useIndexEmployees } from '@/features/employees/hooks/useIndexEmployees';
import { useCreateRoute } from '@/features/routes/hooks/useCreateRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRouteSchema, CreateRouteFormType } from '@/schemas/route/route.schema';

// Import leaflet styles
import 'leaflet/dist/leaflet.css';

// Type definitions
interface MockOrder {
	id: string;
	documentId: number;
	customer: string;
	address: string;
	status: 'In Transit' | 'Pending' | 'Delayed';
	eta: string;
	distance: string;
	lat: number;
	lng: number;
	warning?: string;
}

const MOCK_ORDERS: MockOrder[] = [
	{
		id: 'ORD-1234',
		documentId: 0,
		customer: 'TechLogistics Global',
		address: 'Av. de Mayo 600, Buenos Aires',
		status: 'In Transit',
		eta: '14:30 PM',
		distance: '1.2 km',
		lat: -34.6083,
		lng: -58.3712,
		warning: ''
	},
	{
		id: 'ORD-1235',
		documentId: 0,
		customer: 'Horizon Retailers',
		address: 'Honduras 4800, Palermo, Buenos Aires',
		status: 'Pending',
		eta: '--:--',
		distance: '4.8 km',
		lat: -34.5875,
		lng: -58.4300,
		warning: ''
	},
	{
		id: 'ORD-1236',
		documentId: 0,
		customer: 'QuickDeliver Inc',
		address: 'Av. Alvear 1800, Recoleta, Buenos Aires',
		status: 'In Transit',
		eta: '15:45 PM',
		distance: '2.5 km',
		lat: -34.5886,
		lng: -58.3974,
		warning: ''
	},
	{
		id: 'ORD-1237',
		documentId: 0,
		customer: 'Summit Peak Supply',
		address: 'Juana Manso 1100, Puerto Madero, Buenos Aires',
		status: 'Delayed',
		eta: '16:15 PM',
		distance: '3.1 km',
		lat: -34.6105,
		lng: -58.3618,
		warning: 'Heavy Traffic'
	},
	{
		id: 'ORD-1238',
		documentId: 0,
		customer: 'Apex Freight Systems',
		address: 'Defensa 800, San Telmo, Buenos Aires',
		status: 'In Transit',
		eta: '13:10 PM',
		distance: '2.1 km',
		lat: -34.6200,
		lng: -58.3710,
		warning: ''
	},
	{
		id: 'ORD-1239',
		documentId: 0,
		customer: 'Bay Area Builders',
		address: 'Baez 300, Las Cañitas, Buenos Aires',
		status: 'Pending',
		eta: '--:--',
		distance: '5.2 km',
		lat: -34.5720,
		lng: -58.4380,
		warning: ''
	}
];

// Helper to update Leaflet Map center when a selected order changes
function ChangeView({ selectedOrder }: { selectedOrder: MockOrder | undefined }) {
	const map = useMap();
	useEffect(() => {
		if (selectedOrder) {
			map.setView([selectedOrder.lat, selectedOrder.lng], 14, {
				animate: true,
				duration: 1,
			});
		}
	}, [selectedOrder, map]);
	return null;
}

// Helper to capture Leaflet Map instance
function MapInstanceCapture({ setMap }: { setMap: (map: L.Map) => void }) {
	const map = useMap();
	useEffect(() => {
		setMap(map);
	}, [map, setMap]);
	return null;
}

// Helper to generate a custom marker icon matching project aesthetics
const createCustomIcon = (status: 'In Transit' | 'Pending' | 'Delayed', isFocused: boolean, isSelectedInRoute: boolean) => {
	const color = status === 'In Transit' ? '#005483' : status === 'Pending' ? '#d97706' : '#dc2626';
	const size = isFocused ? 36 : 28;
	
	const htmlContent = `
		<div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
			${isFocused ? `
				<div class="animate-ping" style="
					position: absolute;
					width: ${size + 12}px;
					height: ${size + 12}px;
					border-radius: 50%;
					background-color: ${color};
					opacity: 0.3;
				"></div>
			` : ''}
			<div style="
				width: ${size}px;
				height: ${size}px;
				border-radius: 50%;
				background-color: ${color};
				border: 2px solid ${isSelectedInRoute ? '#22c55e' : '#ffffff'};
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
			">
				${isSelectedInRoute ? `
					<!-- Checkmark icon -->
					<svg width="${size - 14}" height="${size - 14}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				` : `
					<!-- Truck icon -->
					<svg width="${size - 14}" height="${size - 14}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
						<path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.5-.87l-4-2.5A1 1 0 0 0 17 8h-3v10" />
						<circle cx="7.5" cy="18.5" r="2.5" />
						<circle cx="17.5" cy="18.5" r="2.5" />
					</svg>
				`}
			</div>
			${isSelectedInRoute ? `
				<!-- Small floating check badge -->
				<div style="
					position: absolute;
					top: -4px;
					right: -4px;
					background-color: #22c55e;
					color: white;
					border-radius: 50%;
					width: 14px;
					height: 14px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 8px;
					border: 1px solid white;
					font-weight: bold;
				">✓</div>
			` : ''}
		</div>
	`;

	return L.divIcon({
		html: htmlContent,
		className: 'custom-map-icon',
		iconSize: [size + 12, size + 12],
		iconAnchor: [(size + 12) / 2, (size + 12) / 2],
		popupAnchor: [0, -size / 2],
	});
};

export default function DeliveryView() {
	const { code = 'DLV' } = useParams<{ code?: string }>();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const itemType = searchParams.get('item_type') || 'service';

	const operation: 'sale' | 'purchase' = code.startsWith('P') ? 'purchase' : 'sale';

	const isValidCode = code === 'DLV' || code === 'PDLV';
	const isValidItemType = itemType === 'service' || itemType === 'product' || itemType === 'article';

	const { data: documents, isLoading } = useIndexDocuments({
		operation,
		document_type_code: code,
		item_type: itemType === 'service' ? 'service' : 'product',
		status: 'validated',
		exclude_active_routes: true,
	});

	const orders = useMemo<MockOrder[]>(() => {
		if (!documents) {
			return [];
		}

		return documents.map((doc) => {
			let mappedStatus: 'In Transit' | 'Pending' | 'Delayed' = 'Pending';
			if (doc.status?.key === 'sent' || doc.status?.key === 'in_transit' || doc.status?.key === 'invoiced') {
				mappedStatus = 'In Transit';
			} else if (doc.status?.key === 'delayed') {
				mappedStatus = 'Delayed';
			}

			// Generate coordinates distributed around central Buenos Aires based on doc.id
			const lat = -34.6083 + (doc.id % 7) * 0.005 - 0.015;
			const lng = -58.3712 + ((doc.id * 3) % 7) * 0.005 - 0.015;

			return {
				id: doc.number_serie || `ORD-${doc.id}`,
				documentId: doc.id,
				customer: doc.partner_name || 'Cliente Genérico',
				address: doc.partner_address || 'Dirección no registrada',
				status: mappedStatus,
				eta: '14:30 PM',
				distance: `${(1.2 + (doc.id % 5) * 0.7).toFixed(1)} km`,
				lat,
				lng,
				warning: doc.notes || ''
			};
		});
	}, [documents]);

	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const activeSelectedOrderId = selectedOrderId || orders[0]?.id || '';
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In Transit' | 'Delayed'>('All');
	const [map, setMap] = useState<L.Map | null>(null);

	// Multi-select for route planning
	const [selectedRouteOrderIds, setSelectedRouteOrderIds] = useState<string[]>([]);
	const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

	const markerRefs = useRef<Record<string, L.Marker | null>>({});
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === 'dark';

	// Load real employees and mutation for creating routes
	const { data: employeesData } = useIndexEmployees();
	const employees = employeesData || [];
	const { mutate: createRoute } = useCreateRoute();

	const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<CreateRouteFormType>({
		resolver: zodResolver(createRouteSchema),
		defaultValues: {
			employee_id: 0,
			notes: '',
			document_ids: [],
		}
	});

	// Toggle order selection for the route
	const toggleOrderSelection = (orderId: string) => {
		setSelectedRouteOrderIds((prev) =>
			prev.includes(orderId)
				? prev.filter((id) => id !== orderId)
				: [...prev, orderId]
		);
	};

	// Filter orders
	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const matchesTab = activeTab === 'All' || order.status === activeTab;
			const matchesSearch =
				order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.address.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesTab && matchesSearch;
		});
	}, [orders, activeTab, searchQuery]);

	// Find currently selected order object
	const selectedOrder = useMemo(() => {
		return orders.find((o) => o.id === activeSelectedOrderId);
	}, [orders, activeSelectedOrderId]);

	// Get full details of selected route orders
	const selectedRouteOrdersDetails = useMemo(() => {
		return orders.filter((o) => selectedRouteOrderIds.includes(o.id));
	}, [orders, selectedRouteOrderIds]);

	// Sync document_ids array when selection changes
	useEffect(() => {
		const docIds = selectedRouteOrdersDetails.map(o => o.documentId).filter(id => id !== 0);
		setValue('document_ids', docIds);
	}, [selectedRouteOrderIds, selectedRouteOrdersDetails, setValue]);

	// Calculated route distance & time
	const calculatedDistance = useMemo(() => {
		let sum = 0;
		selectedRouteOrderIds.forEach((id) => {
			const order = orders.find((o) => o.id === id);
			if (order) {
				const num = parseFloat(order.distance);
				if (!isNaN(num)) sum += num;
			}
		});
		return sum.toFixed(1);
	}, [orders, selectedRouteOrderIds]);

	const calculatedTime = useMemo(() => {
		// 15 minutes per stop plus driving buffer
		return selectedRouteOrderIds.length * 15;
	}, [selectedRouteOrderIds]);

	// Counts
	const counts = useMemo(() => {
		const total = orders.length;
		const pending = orders.filter((o) => o.status === 'Pending').length;
		const inTransit = orders.filter((o) => o.status === 'In Transit').length;
		const delayed = orders.filter((o) => o.status === 'Delayed').length;
		return { total, pending, inTransit, delayed };
	}, [orders]);

	// Center map and open popup on selection
	useEffect(() => {
		if (activeSelectedOrderId && markerRefs.current[activeSelectedOrderId]) {
			const timer = setTimeout(() => {
				const marker = markerRefs.current[activeSelectedOrderId];
				if (marker) {
					marker.openPopup();
				}
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [activeSelectedOrderId]);

	const handleZoomIn = () => {
		if (map) map.zoomIn();
	};

	const handleZoomOut = () => {
		if (map) map.zoomOut();
	};

	const handleResetView = () => {
		if (map) {
			map.setView([-34.6037, -58.3816], 13);
		}
	};

	const onConfirmRoute = (formData: CreateRouteFormType) => {
		createRoute(formData, {
			onSuccess: (data) => {
				toast.success(`Ruta ${data.code} creada con éxito.`);
				setIsRouteModalOpen(false);
				setSelectedRouteOrderIds([]);
				reset();
			},
			onError: (err) => {
				toast.error(`Error al crear la ruta: ${err.message}`);
			}
		});
	};

	if (!isValidCode || !isValidItemType) {
		return <Navigate to="/delivery/DLV?item_type=service" replace />;
	}

	// Determine map tile provider URL based on light/dark mode
	const tileUrl = isDarkMode
		? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
		: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

	return (
		<div className="flex flex-col md:flex-row w-full h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
			{/* Inject Leaflet Custom Styles to fit theme DNA */}
			<style>{`
				.leaflet-popup-content-wrapper {
					background: #ffffff !important;
					color: #0f172a !important;
					border-radius: 4px !important;
					border: 1px solid #e2e8f0 !important;
					box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
					padding: 0 !important;
				}
				.dark .leaflet-popup-content-wrapper {
					background: #1e293b !important;
					color: #f8fafc !important;
					border: 1px solid #334155 !important;
				}
				.leaflet-popup-content {
					margin: 0 !important;
					padding: 12px !important;
					font-family: ui-sans-serif, system-ui, sans-serif !important;
				}
				.leaflet-popup-tip {
					background: #ffffff !important;
					border: 1px solid #e2e8f0 !important;
				}
				.dark .leaflet-popup-tip {
					background: #1e293b !important;
					border: 1px solid #334155 !important;
				}
				.leaflet-container {
					font-family: inherit;
				}
				@keyframes pulse {
					0% { transform: scale(0.85); opacity: 0.4; }
					50% { transform: scale(1.15); opacity: 0.1; }
					100% { transform: scale(0.85); opacity: 0.4; }
				}
			`}</style>

			{/* Left Column: Active Orders */}
			<div className="w-full md:w-[360px] lg:w-[400px] border-r border-solid border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-[#0f172a] shrink-0 h-full overflow-hidden">
				{/* Header */}
				<div className="p-5 border-b border-solid border-slate-100 dark:border-slate-800 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Typography variant="h6" className="font-extrabold tracking-tight text-slate-800 dark:text-gray-100 text-lg">
								Active Orders
							</Typography>
							<span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-[2px] tracking-wide uppercase">
								{counts.inTransit} Active
							</span>
						</div>
						{/* "Crear Ruta" Button */}
						<button 
							onClick={() => {
								if (selectedRouteOrderIds.length === 0) {
									toast.warning('Seleccione al menos un pedido de la lista o desde el mapa para crear la ruta.');
								} else {
									setIsRouteModalOpen(true);
								}
							}}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005483] hover:bg-[#004369] text-white text-xs font-bold rounded-[4px] shadow-sm transition-colors cursor-pointer shrink-0"
						>
							<Plus size={14} />
							<span>Crear Ruta</span>
						</button>
					</div>

					{/* Search */}
					<TextField
						placeholder="Search orders, clients, or addresses..."
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

					{/* Filter Pills */}
					<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
						{(['All', 'Pending', 'In Transit', 'Delayed'] as const).map((tab) => {
							const count =
								tab === 'All'
									? counts.total
									: tab === 'Pending'
									? counts.pending
									: tab === 'In Transit'
									? counts.inTransit
									: counts.delayed;

							const isActive = activeTab === tab;

							return (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={clsx(
										'px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 border border-solid',
										isActive
											? 'bg-[#005483] text-white border-[#005483] shadow-sm'
											: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
									)}
								>
									{tab === 'In Transit' ? 'In Transit' : tab}
									<span className={clsx(
										'ml-1.5 text-[10px] px-1 rounded-full',
										isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-900 text-slate-500'
									)}>
										{count}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Scrollable List */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
					{isLoading ? (
						<div className="text-center py-10 text-slate-400 dark:text-slate-600">
							Cargando documentos...
						</div>
					) : filteredOrders.length > 0 ? (
						filteredOrders.map((order) => {
							const isSelected = order.id === activeSelectedOrderId;
							const isSelectedInRoute = selectedRouteOrderIds.includes(order.id);
							return (
								<div
									key={order.id}
									className={clsx(
										'relative border border-solid rounded-[4px] p-4 cursor-pointer transition-all duration-200 hover:shadow-md flex items-start gap-3',
										isSelected
											? 'border-[#005483] dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 border-l-[4px]'
											: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c2e]'
									)}
								>
									{/* Checkbox for Route Selection */}
									<input
										type="checkbox"
										checked={isSelectedInRoute}
										onChange={(e) => {
											e.stopPropagation();
											toggleOrderSelection(order.id);
										}}
										className="mt-1 w-4 h-4 text-[#005483] border-solid border-slate-300 rounded focus:ring-[#005483] cursor-pointer shrink-0"
									/>

									{/* Card content container */}
									<div 
										className="flex-1 flex flex-col gap-2.5" 
										onClick={() => setSelectedOrderId(order.id)}
									>
										{/* Order ID & Status */}
										<div className="flex justify-between items-center">
											<span className="text-xs font-mono font-black text-slate-800 dark:text-gray-200">
												#{order.id}
											</span>
											<span
												className={clsx(
													'text-[9px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-widest',
													order.status === 'In Transit'
														? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
														: order.status === 'Pending'
														? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
														: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
												)}
											>
												{order.status === 'In Transit' ? 'In Transit' : order.status}
											</span>
										</div>

										{/* Customer Name */}
										<div>
											<Typography className="font-extrabold text-[13px] text-slate-800 dark:text-gray-100">
												{order.customer}
											</Typography>
											<div className="flex items-center gap-1 mt-1 text-slate-500">
												<MapPin size={12} />
												<span className="text-[10px] truncate max-w-[200px] lg:max-w-[240px]">
													{order.address}
												</span>
											</div>
										</div>

										{/* ETA & Distance */}
										<div className="flex justify-between items-center pt-2 border-t border-solid border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
											<div className="flex items-center gap-1">
												<Clock size={12} />
												<span>ETA: {order.eta}</span>
											</div>
											<div className="font-semibold text-slate-600 dark:text-slate-400">
												{order.distance}
											</div>
										</div>

										{/* Warning Banner if Delayed */}
										{order.status === 'Delayed' && order.warning && (
											<div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-2 rounded-[2px] mt-1 text-[10px] font-medium border border-solid border-red-100 dark:border-red-900/20">
												<AlertTriangle size={12} className="shrink-0" />
												<span>{order.warning}</span>
											</div>
										)}
									</div>
								</div>
							);
						})
					) : (
						<div className="text-center py-10 text-slate-400 dark:text-slate-600">
							No orders found
						</div>
					)}
				</div>
			</div>

			{/* Right Column: Leaflet Map */}
			<div className="flex-1 h-full relative bg-[#e2e8f0] dark:bg-slate-950 overflow-hidden">
				<MapContainer
					center={[-34.6037, -58.3816]}
					zoom={13}
					zoomControl={false}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
						url={tileUrl}
					/>
					<ChangeView selectedOrder={selectedOrder} />
					<MapInstanceCapture setMap={setMap} />

					{filteredOrders.map((order) => {
						const isSelected = order.id === activeSelectedOrderId;
						const isSelectedInRoute = selectedRouteOrderIds.includes(order.id);
						return (
							<Marker
								key={order.id}
								position={[order.lat, order.lng]}
								icon={createCustomIcon(order.status, isSelected, isSelectedInRoute)}
								ref={(el) => {
									if (el) {
										markerRefs.current[order.id] = el;
									} else {
										delete markerRefs.current[order.id];
									}
								}}
								eventHandlers={{
									click: () => {
										setSelectedOrderId(order.id);
									},
								}}
							>
								<Popup closeButton={false} autoPan={false}>
									<div className="min-w-[180px] flex flex-col gap-1 text-slate-800 dark:text-slate-200">
										<div className="flex justify-between items-center gap-2">
											<span className="text-[10px] font-mono font-bold text-slate-400">
												#{order.id}
											</span>
											<span className={clsx(
												'text-[8px] font-black uppercase px-1.5 py-0.5 rounded-[2px]',
												order.status === 'In Transit'
													? 'bg-blue-100 text-blue-700'
													: order.status === 'Pending'
													? 'bg-amber-100 text-amber-700'
													: 'bg-red-100 text-red-700'
											)}>
												{order.status}
											</span>
										</div>
										<Typography className="font-extrabold text-[12px] !m-0 text-slate-800 dark:text-gray-100">
											{order.customer}
										</Typography>
										<div className="flex justify-between items-center mt-1 pt-1.5 border-t border-solid border-slate-100 dark:border-slate-700 text-[10px] text-slate-500">
											<span>ETA: {order.eta}</span>
											<span className="font-bold">{order.distance}</span>
										</div>
										{/* Add/Remove from Route Action Button inside Popup */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleOrderSelection(order.id);
											}}
											className={clsx(
												"mt-2.5 w-full py-1.5 text-[10px] font-bold rounded-[2px] transition-colors cursor-pointer text-white",
												isSelectedInRoute
													? "bg-red-600 hover:bg-red-700"
													: "bg-green-600 hover:bg-green-700"
											)}
										>
											{isSelectedInRoute ? 'Quitar de la Ruta' : 'Seleccionar para Ruta'}
										</button>
									</div>
								</Popup>
							</Marker>
						);
					})}
				</MapContainer>

				{/* Floating Filters Container (Top Left of Map) */}
				<div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur p-2.5 rounded-[4px] shadow-lg border border-solid border-slate-200/50 dark:border-slate-800 max-w-full overflow-x-auto z-[999]">
					<div className="flex items-center gap-1.5 text-xs text-slate-400 border-r border-solid border-slate-200 dark:border-slate-800 pr-2 mr-1">
						<Layers size={14} />
						<span className="font-bold uppercase tracking-wider text-[10px]">Filter</span>
					</div>
					<div className="flex gap-1.5 text-[10px] font-semibold">
						<span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-[2px] flex items-center gap-1 border border-solid border-slate-200/50 dark:border-slate-700/50">
							Region: BUA
							<X size={10} className="cursor-pointer hover:text-slate-900" />
						</span>
						<span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-[2px] flex items-center gap-1 border border-solid border-slate-200/50 dark:border-slate-700/50">
							Carrier: All
							<X size={10} className="cursor-pointer hover:text-slate-900" />
						</span>
					</div>
				</div>

				{/* Floating Zoom Controls (Bottom Right of Map) */}
				<div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-[999]">
					<div className="bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur rounded-[4px] shadow-lg border border-solid border-slate-200/50 dark:border-slate-800 overflow-hidden flex flex-col">
						<Tooltip title="Zoom In" placement="left">
							<IconButton size="small" onClick={handleZoomIn} sx={{ borderRadius: 0, borderBottom: '1px solid divider', p: 1.2 }}>
								<Plus size={16} className="text-slate-700 dark:text-slate-300" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Zoom Out" placement="left">
							<IconButton size="small" onClick={handleZoomOut} sx={{ borderRadius: 0, p: 1.2 }}>
								<Minus size={16} className="text-slate-700 dark:text-slate-300" />
							</IconButton>
						</Tooltip>
					</div>

					<Tooltip title="Reset View" placement="left">
						<IconButton
							onClick={handleResetView}
							size="small"
							sx={{
								backgroundColor: 'background.paper',
								boxShadow: 2,
								p: 1.2,
								borderRadius: '4px', // Sharp edges DNA
								border: '1px solid',
								borderColor: 'divider',
								'&:hover': {
									backgroundColor: 'action.hover',
								}
							}}
						>
							<RotateCcw size={16} className="text-slate-700 dark:text-slate-300" />
						</IconButton>
					</Tooltip>
				</div>
			</div>

			{/* Modal Dialog: Crear Ruta de Reparto */}
			<Dialog 
				open={isRouteModalOpen} 
				onClose={() => setIsRouteModalOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: '4px', // Sharp borders DNA
						bgcolor: 'background.paper',
						backgroundImage: 'none',
						border: '1px solid',
						borderColor: 'divider',
					}
				}}
			>
				<DialogTitle className="font-extrabold text-slate-800 dark:text-gray-100 flex justify-between items-center border-b border-solid border-slate-100 dark:border-slate-800 pb-4">
					<span>Crear Ruta de Reparto</span>
					<IconButton size="small" onClick={() => setIsRouteModalOpen(false)}>
						<X size={18} />
					</IconButton>
				</DialogTitle>
				<DialogContent className="pt-6 flex flex-col gap-5">
					{/* Route summary cards */}
					<div className="grid grid-cols-3 gap-3">
						<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
							<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pedidos</span>
							<span className="text-lg font-black text-slate-800 dark:text-gray-100">{selectedRouteOrderIds.length}</span>
						</div>
						<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
							<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Distancia Est.</span>
							<span className="text-lg font-black text-[#005483] dark:text-blue-400">{calculatedDistance} km</span>
						</div>
						<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
							<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tiempo Est.</span>
							<span className="text-lg font-black text-slate-800 dark:text-gray-100">{calculatedTime} min</span>
						</div>
					</div>

					{/* Form Fields */}
					<div className="flex flex-col gap-4">
						<Controller
							name="employee_id"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth size="small" error={!!errors.employee_id}>
									<InputLabel id="employee-label">Conductor / Técnico</InputLabel>
									<Select
										{...field}
										labelId="employee-label"
										label="Conductor / Técnico"
										sx={{ borderRadius: '4px' }}
									>
										{employees.map((emp) => (
											<MenuItem key={emp.id} value={emp.id}>
												{emp.first_name} {emp.last_name}
											</MenuItem>
										))}
									</Select>
									{errors.employee_id && (
										<FormHelperText>{errors.employee_id.message}</FormHelperText>
									)}
								</FormControl>
							)}
						/>

						<Controller
							name="notes"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Notas de la Ruta"
									placeholder="Ej: Entregar primero en Microcentro, el cliente de Puerto Madero tiene restricción de horario..."
									multiline
									rows={2}
									size="small"
									error={!!errors.notes}
									helperText={errors.notes?.message}
									fullWidth
									slotProps={{
										input: {
											sx: { borderRadius: '4px' }
										}
									}}
								/>
							)}
						/>
					</div>

					{/* Deliveries sequence list */}
					<div className="flex flex-col gap-2">
						<span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Secuencia de Entrega</span>
						<div className="border border-solid border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden bg-white dark:bg-[#131c2e] p-4 flex flex-col gap-4">
							{selectedRouteOrdersDetails.map((order, idx) => (
								<div key={order.id} className="flex gap-3 items-start relative">
									{/* Vertical dashed line indicator */}
									{idx < selectedRouteOrdersDetails.length - 1 && (
										<div className="absolute left-[11px] top-6 bottom-[-20px] w-0.5 border-l border-dashed border-slate-300 dark:border-slate-700" />
									)}
									{/* Stop number badge */}
									<div className="w-6 h-6 rounded-full bg-[#005483] text-white flex items-center justify-center text-[11px] font-black shrink-0 z-[1]">
										{idx + 1}
									</div>
									{/* Info */}
									<div className="flex-1 flex flex-col">
										<div className="flex justify-between items-center">
											<span className="text-xs font-black text-slate-800 dark:text-gray-100">{order.customer}</span>
											<span className="text-[10px] font-mono text-slate-400">#{order.id}</span>
										</div>
										<span className="text-[10px] text-slate-500 mt-0.5">{order.address}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</DialogContent>
				<DialogActions className="p-5 border-t border-solid border-slate-100 dark:border-slate-800 gap-2">
					<button
						onClick={() => setIsRouteModalOpen(false)}
						className="px-4 py-2 border border-solid border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
					>
						Cancelar
					</button>
					<button
						onClick={handleSubmit(onConfirmRoute)}
						className="px-4 py-2 bg-[#005483] hover:bg-[#004369] text-white text-xs font-bold rounded-[4px] shadow-sm transition-colors cursor-pointer"
					>
						Confirmar y Despachar
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
