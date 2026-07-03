import { useEffect, useRef } from 'react';
import { Typography, IconButton, Tooltip } from '@mui/material';
import { Plus, Minus, Layers, RotateCcw, X } from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MockOrder } from '../types';

import 'leaflet/dist/leaflet.css';

// Helper component to update Leaflet Map center when selected order changes
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

// Helper component to capture Leaflet Map instance
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
				<div class="animate-pulse" style="
					position: absolute;
					width: ${size + 12}px;
					height: ${size + 12}px;
					border-radius: 50%;
					background-color: ${color};
					opacity: 0.3;
					animation: pulse 2s infinite ease-in-out;
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

interface DeliveryMapProps {
	filteredOrders: MockOrder[];
	selectedOrder: MockOrder | undefined;
	selectedRouteOrderIds: string[];
	activeSelectedOrderId: string;
	onSelectOrder: (orderId: string) => void;
	onToggleOrderRoute: (orderId: string) => void;
	isDarkMode: boolean;
	setMap: (map: L.Map) => void;
	handleZoomIn: () => void;
	handleZoomOut: () => void;
	handleResetView: () => void;
}

export default function DeliveryMap({
	filteredOrders,
	selectedOrder,
	selectedRouteOrderIds,
	activeSelectedOrderId,
	onSelectOrder,
	onToggleOrderRoute,
	isDarkMode,
	setMap,
	handleZoomIn,
	handleZoomOut,
	handleResetView
}: DeliveryMapProps) {
	const markerRefs = useRef<Record<string, L.Marker | null>>({});

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

	// Determine map tile provider URL based on light/dark mode
	const tileUrl = isDarkMode
		? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
		: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

	return (
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
									onSelectOrder(order.id);
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
											onToggleOrderRoute(order.id);
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
	);
}
