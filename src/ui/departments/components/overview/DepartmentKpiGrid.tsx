import { Box } from '@mui/material';
import { AccountTreeOutlined, GroupOutlined, ShieldOutlined } from '@mui/icons-material';
import KpiCard from './KpiCard';
import { DepartmentStats } from './types';

interface DepartmentKpiGridProps {
	stats: DepartmentStats;
}

export default function DepartmentKpiGrid({ stats }: DepartmentKpiGridProps) {
	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
				gap: 1.5,
				mb: 5
			}}
		>
			<KpiCard
				title="Plantilla"
				value={`${stats.totalEmployees} empleados activos`}
				subtitle="Capacidad operativa actual"
				icon={<GroupOutlined sx={{ fontSize: 18 }} />}
			/>
			<KpiCard
				title="Estructura"
				value={`${stats.subDepartments} áreas dependientes`}
				subtitle="Nivel jerárquico actual"
				icon={<AccountTreeOutlined sx={{ fontSize: 18 }} />}
			/>
			<KpiCard
				title="Roles"
				value={`${stats.rolesCount} perfiles distintos`}
				subtitle="Diversidad de puestos"
				icon={<ShieldOutlined sx={{ fontSize: 18 }} />}
			/>
		</Box>
	);
}
