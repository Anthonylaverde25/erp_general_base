import { Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AssignCollaboratorsModal from './AssignCollaboratorsModal';
import AssignManagerModal from './AssignManagerModal';

import useShowDepartment from '@/features/departments/hooks/useShowDepartment';
import { IDepartment } from '@/types/department.types';
import DepartmentOverviewHeader from './overview/DepartmentOverviewHeader';
import DepartmentOverviewActions from './overview/DepartmentOverviewActions';
import DepartmentKpiGrid from './overview/DepartmentKpiGrid';
import SubDepartmentsSection from './overview/SubDepartmentsSection';
import RecentEmployeesSection from './overview/RecentEmployeesSection';
import RecentEmployeeDrawer from './overview/RecentEmployeeDrawer';
import { DepartmentOverviewModel } from './overview/types';
import DepartmentFilesList from './DepartmentFilesList';

interface DepartmentOverviewProps {
	departmentId: number | null;
}

function CenteredMessage({ message }: { message: string }) {
	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 4
			}}
		>
			<Typography
				color="text.secondary"
				variant="h6"
			>
				{message}
			</Typography>
		</Box>
	);
}

function toOverviewModel(department: IDepartment): DepartmentOverviewModel {
	return {
		name: department.name,
		code: department.code,
		description: department.description || 'Sin descripción',
		active: department.is_active,
		manager: department.manager || { initials: 'ND', name: 'No asignado' },
		stats: {
			totalEmployees: department.users?.length || 0,
			subDepartments: department.children?.length || 0,
			rolesCount: new Set(department.users?.map((user) => user.role_id)).size || 0
		},
		recentEmployees:
			department.users?.slice(0, 5).map((user) => ({
				id: user.id,
				name: `${user.name} ${user.last_name || ''}`,
				role: 'Empleado',
				initials: user.name?.substring(0, 2).toUpperCase() || 'E'
			})) || [],
		subDepartments:
			department.children?.map((subDepartment) => ({
				id: subDepartment.id,
				name: subDepartment.name,
				code: subDepartment.code,
				employees: subDepartment.users?.length || 0
			})) || []
	};
}

export default function DepartmentOverview({ departmentId }: DepartmentOverviewProps) {
	const navigate = useNavigate();
	const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] = useState(false);
	const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false);
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
	const { department, isLoading } = useShowDepartment(departmentId);

	if (!departmentId) {
		return <CenteredMessage message="Selecciona un departamento del menú lateral para ver sus detalles." />;
	}

	if (isLoading) {
		return <CenteredMessage message="Cargando información del departamento..." />;
	}

	if (!department) {
		return <CenteredMessage message="Departamento no encontrado." />;
	}

	const overviewModel = toOverviewModel(department);
	const hasManager = !!department.manager_id;

	return (
		<Box sx={{ flex: 1, p: 3, overflowY: { xs: 'visible', md: 'auto' } }}>
			<DepartmentOverviewHeader department={overviewModel} />

			{!hasManager ? (
				<Box
					sx={{
						mt: 4,
						p: 6,
						textAlign: 'center',
						backgroundColor: 'background.paper',
						borderRadius: 2,
						border: '1px dashed',
						borderColor: 'divider'
					}}
				>
					<Typography
						variant="h6"
						color="text.primary"
						gutterBottom
					>
						Departamento Restringido
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
					>
						Este departamento no tiene un administrador asignado. Las funciones y visualización del
						departamento están deshabilitadas hasta que se asigne un administrador.
					</Typography>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setIsAssignManagerModalOpen(true)}
					>
						Asignar Administrador
					</Button>
				</Box>
			) : (
				<>
					<DepartmentOverviewActions
						onAddCollaborator={() => setIsAddCollaboratorModalOpen(true)}
						onViewAllDocuments={() => navigate(`/departments/${overviewModel.code}/documents`)}
					/>

					<DepartmentKpiGrid stats={overviewModel.stats} />

					<Box className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						<Box className="space-y-8 lg:col-span-8">
							<SubDepartmentsSection
								subDepartments={overviewModel.subDepartments}
								onSelectSubDepartment={(code) => navigate(`/departments/${code}`)}
							/>

							<RecentEmployeesSection
								recentEmployees={overviewModel.recentEmployees}
								onAddCollaborator={() => setIsAddCollaboratorModalOpen(true)}
								onSelectEmployee={(userId) => setSelectedEmployeeId(userId)}
							/>
						</Box>

						<Box className="lg:sticky lg:top-4 lg:col-span-4 lg:self-start">
							<DepartmentFilesList departmentId={departmentId} />
						</Box>
					</Box>
				</>
			)}

			<AssignCollaboratorsModal
				open={isAddCollaboratorModalOpen}
				onClose={() => setIsAddCollaboratorModalOpen(false)}
				departmentId={departmentId}
			/>

			<AssignManagerModal
				open={isAssignManagerModalOpen}
				onClose={() => setIsAssignManagerModalOpen(false)}
				departmentId={departmentId}
			/>

			<RecentEmployeeDrawer
				open={selectedEmployeeId !== null}
				onClose={() => setSelectedEmployeeId(null)}
				userId={selectedEmployeeId}
			/>
		</Box>
	);
}
