import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { IDepartment } from '@/types/department.types';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import DepartmentFilesList from '../components/DepartmentFilesList';

function findDepartmentByCode(departments: IDepartment[], targetCode: string): IDepartment | null {
	for (const department of departments) {
		if (department.code === targetCode) {
			return department;
		}

		if (department.children && department.children.length > 0) {
			const found = findDepartmentByCode(department.children, targetCode);

			if (found) return found;
		}
	}

	return null;
}

export default function DepartmentDocumentsPage() {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const { departments, isLoading } = useIndexDepartments();

	const selectedDepartment = useMemo(() => {
		if (!departments || !code) return null;

		return findDepartmentByCode(departments, code);
	}, [departments, code]);

	if (isLoading) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="text.secondary">Cargando documentos del departamento...</Typography>
			</Box>
		);
	}

	if (!selectedDepartment) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="error">No se encontró el departamento solicitado.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 3,
					flexWrap: 'wrap',
					gap: 2
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton
						size="small"
						onClick={() => navigate(`/departments/${selectedDepartment.code}`)}
						sx={{ bgcolor: 'action.hover' }}
					>
						<ArrowBack fontSize="small" />
					</IconButton>
					<Box>
						<Typography
							variant="h5"
							fontWeight={700}
						>
							Documentos del departamento
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{selectedDepartment.code} • {selectedDepartment.name}
						</Typography>
					</Box>
				</Box>
			</Box>

			<DepartmentFilesList departmentId={selectedDepartment.id} />
		</Box>
	);
}
