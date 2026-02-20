import { Autorenew, Inventory2, Sell } from '@mui/icons-material';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface ItemOverviewKpisProps {
	stockActual: number;
	unidadesVendidasMes: number;
	rotacionMensual: number;
}

interface KpiCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: ReactNode;
}

function KpiCard({ title, value, subtitle, icon }: KpiCardProps) {
	return (
		<Paper
			variant="outlined"
			sx={{ p: 3, borderColor: 'divider', bgcolor: 'whitesmoke' }}
		>
			<Typography
				variant="overline"
				sx={{
					fontSize: '0.65rem',
					letterSpacing: '0.08em',
					color: 'text.secondary',
					fontWeight: 700
				}}
			>
				{title}
			</Typography>
			<Box className="flex items-center gap-3">
				<Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}>{icon}</Avatar>
				<Box>
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontSize: '0.85rem' }}
					>
						{value}
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{subtitle}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}

export default function ItemOverviewKpis({ stockActual, unidadesVendidasMes, rotacionMensual }: ItemOverviewKpisProps) {
	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
				gap: 1.5,
				mb: 3
			}}
		>
			<KpiCard
				title="Stock actual"
				value={`${stockActual} unidades disponibles`}
				subtitle="Nivel estable en almacén principal"
				icon={<Inventory2 sx={{ fontSize: 18 }} />}
			/>

			<KpiCard
				title="Unidades vendidas"
				value={`${unidadesVendidasMes} uds en el mes`}
				subtitle="Tendencia positiva de ventas"
				icon={<Sell sx={{ fontSize: 18 }} />}
			/>

			<KpiCard
				title="Rotación"
				value={`${rotacionMensual}x mensual`}
				subtitle="Rotación saludable del inventario"
				icon={<Autorenew sx={{ fontSize: 18 }} />}
			/>
		</Box>
	);
}
