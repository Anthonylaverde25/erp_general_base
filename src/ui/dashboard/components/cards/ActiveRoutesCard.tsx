import { Box, Typography, Button, Divider, CircularProgress } from '@mui/material';
import { Truck, Calendar, ArrowUpRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useIndexRoutes } from '@/features/routes/hooks/useIndexRoutes';

/**
 * Dashboard card to show scheduled and in_progress routes with real-time metrics.
 */
function ActiveRoutesCard() {
	const navigate = useNavigate();
	const { data: routes = [], isLoading } = useIndexRoutes();

	// Calculate counts for active statuses
	const scheduledCount = routes.filter((r) => r.status === 'scheduled').length;
	const inProgressCount = routes.filter((r) => r.status === 'in_progress').length;

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				<CircularProgress size={24} color="primary" />
			</Box>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
			
			{/* Card Header */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Compass size={18} className="text-[#005483] dark:text-blue-400" />
					<Typography variant="subtitle1" fontWeight={700} className="text-slate-800 dark:text-gray-200">
						Rutas de Reparto
					</Typography>
				</Box>
			</Box>

			{/* Grid Metrics */}
			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, flex: 1, alignItems: 'center' }}>
				
				{/* Scheduled Routes Metric */}
				<Box className="flex flex-col gap-1.5 p-3 rounded-[4px] bg-slate-50 dark:bg-slate-900/40 border border-solid border-slate-100 dark:border-slate-800/60">
					<Box className="flex items-center justify-between">
						<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
							Programadas
						</span>
						<Calendar size={15} className="text-amber-500" />
					</Box>
					<Typography variant="h5" fontWeight={900} className="text-slate-800 dark:text-slate-100 mt-1">
						{scheduledCount}
					</Typography>
				</Box>

				{/* In Progress Routes Metric */}
				<Box className="flex flex-col gap-1.5 p-3 rounded-[4px] bg-blue-50/20 dark:bg-blue-950/10 border border-solid border-blue-100/30 dark:border-blue-900/20 relative overflow-hidden">
					{inProgressCount > 0 && (
						<span className="absolute top-1.5 right-1.5 flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
					)}
					<Box className="flex items-center justify-between">
						<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
							En Ruta
						</span>
						<Truck size={15} className="text-[#005483] dark:text-blue-400" />
					</Box>
					<Typography variant="h5" fontWeight={900} className="text-slate-800 dark:text-slate-100 mt-1">
						{inProgressCount}
					</Typography>
				</Box>

			</Box>

			<Divider sx={{ my: 1.5, borderColor: 'divider' }} />

			{/* Action Button */}
			<Button
				variant="text"
				color="primary"
				size="small"
				onClick={() => navigate('/delivery/route-list')}
				endIcon={<ArrowUpRight size={14} />}
				sx={{
					mt: 'auto',
					alignSelf: 'flex-start',
					textTransform: 'none',
					fontWeight: 700,
					fontSize: '11px',
					padding: '4px 8px',
					borderRadius: '4px',
					'&:hover': {
						backgroundColor: 'action.hover',
					}
				}}
			>
				Gestionar Repartos
			</Button>

		</Box>
	);
}

export default ActiveRoutesCard;
