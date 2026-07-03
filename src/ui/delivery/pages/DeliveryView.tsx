import { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { toast } from 'sonner';
import { useParams, Navigate, useLocation } from 'react-router';
import L from 'leaflet';

import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import { useIndexEmployees } from '@/features/employees/hooks/useIndexEmployees';
import { useCreateRoute } from '@/features/routes/hooks/useCreateRoute';
import { CreateRouteFormType } from '@/schemas/route/route.schema';

import { MockOrder } from '../types';
import DeliveryOrdersSidebar from '../components/DeliveryOrdersSidebar';
import DeliveryMap from '../components/DeliveryMap';
import CreateRouteDialog from '../components/CreateRouteDialog';

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

	const theme = useTheme();
	const isDarkMode = theme.palette.mode === 'dark';

	// Load real employees and mutation for creating routes
	const { data: employeesData } = useIndexEmployees();
	const employees = employeesData || [];
	const { mutate: createRoute, isPending: isSubmitting } = useCreateRoute();

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

	// Counts
	const counts = useMemo(() => {
		const total = orders.length;
		const pending = orders.filter((o) => o.status === 'Pending').length;
		const inTransit = orders.filter((o) => o.status === 'In Transit').length;
		const delayed = orders.filter((o) => o.status === 'Delayed').length;
		return { total, pending, inTransit, delayed };
	}, [orders]);

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
			},
			onError: (err) => {
				toast.error(`Error al crear la ruta: ${err.message}`);
			}
		});
	};

	if (!isValidCode || !isValidItemType) {
		return <Navigate to="/delivery/DLV?item_type=service" replace />;
	}

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
			<DeliveryOrdersSidebar
				counts={counts}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				filteredOrders={filteredOrders}
				activeSelectedOrderId={activeSelectedOrderId}
				selectedRouteOrderIds={selectedRouteOrderIds}
				onSelectOrder={setSelectedOrderId}
				onToggleOrderRoute={toggleOrderSelection}
				onCreateRouteClick={() => setIsRouteModalOpen(true)}
				isLoading={isLoading}
			/>

			{/* Right Column: Leaflet Map */}
			<DeliveryMap
				filteredOrders={filteredOrders}
				selectedOrder={selectedOrder}
				selectedRouteOrderIds={selectedRouteOrderIds}
				activeSelectedOrderId={activeSelectedOrderId}
				onSelectOrder={setSelectedOrderId}
				onToggleOrderRoute={toggleOrderSelection}
				isDarkMode={isDarkMode}
				setMap={setMap}
				handleZoomIn={handleZoomIn}
				handleZoomOut={handleZoomOut}
				handleResetView={handleResetView}
			/>

			{/* Modal Dialog: Crear Ruta de Reparto */}
			<CreateRouteDialog
				isOpen={isRouteModalOpen}
				onClose={() => setIsRouteModalOpen(false)}
				selectedOrders={selectedRouteOrdersDetails}
				employees={employees}
				isSubmitting={isSubmitting}
				onSubmit={onConfirmRoute}
			/>
		</div>
	);
}
