import { Typography, TextField, InputAdornment } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { MockOrder } from '../types';
import OrderListItemCard from './OrderListItemCard';

interface DeliveryOrdersSidebarProps {
	counts: {
		total: number;
		pending: number;
		inTransit: number;
		delayed: number;
	};
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	activeTab: 'All' | 'Pending' | 'In Transit' | 'Delayed';
	onTabChange: (tab: 'All' | 'Pending' | 'In Transit' | 'Delayed') => void;
	filteredOrders: MockOrder[];
	activeSelectedOrderId: string;
	selectedRouteOrderIds: string[];
	onSelectOrder: (orderId: string) => void;
	onToggleOrderRoute: (orderId: string) => void;
	onCreateRouteClick: () => void;
	isLoading: boolean;
}

export default function DeliveryOrdersSidebar({
	counts,
	searchQuery,
	onSearchQueryChange,
	activeTab,
	onTabChange,
	filteredOrders,
	activeSelectedOrderId,
	selectedRouteOrderIds,
	onSelectOrder,
	onToggleOrderRoute,
	onCreateRouteClick,
	isLoading
}: DeliveryOrdersSidebarProps) {
	return (
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
								onCreateRouteClick();
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
					onChange={(e) => onSearchQueryChange(e.target.value)}
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
								onClick={() => onTabChange(tab)}
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
							<OrderListItemCard
								key={order.id}
								order={order}
								isSelected={isSelected}
								isSelectedInRoute={isSelectedInRoute}
								onSelect={onSelectOrder}
								onToggleRoute={onToggleOrderRoute}
							/>
						);
					})
				) : (
					<div className="text-center py-10 text-slate-400 dark:text-slate-600">
						No orders found
					</div>
				)}
			</div>
		</div>
	);
}
