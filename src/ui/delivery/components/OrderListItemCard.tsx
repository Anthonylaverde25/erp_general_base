import { Typography } from '@mui/material';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { MockOrder } from '../types';

interface OrderListItemCardProps {
	order: MockOrder;
	isSelected: boolean;
	isSelectedInRoute: boolean;
	onSelect: (orderId: string) => void;
	onToggleRoute: (orderId: string) => void;
}

export default function OrderListItemCard({
	order,
	isSelected,
	isSelectedInRoute,
	onSelect,
	onToggleRoute
}: OrderListItemCardProps) {
	return (
		<div
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
					onToggleRoute(order.id);
				}}
				className="mt-1 w-4 h-4 text-[#005483] border-solid border-slate-300 rounded focus:ring-[#005483] cursor-pointer shrink-0"
			/>

			{/* Card content container */}
			<div
				className="flex-1 flex flex-col gap-2.5"
				onClick={() => onSelect(order.id)}
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
}
