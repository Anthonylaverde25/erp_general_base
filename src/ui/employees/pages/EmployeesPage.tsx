import { useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box, Button, CircularProgress } from '@mui/material';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmployeeTable from '../components/EmployeeTable';
import { CreateEmployeeModal } from '@/ui/employees/components/modals/CreateEmployeeModal';
import { EditEmployeeModal } from '@/ui/employees/components/modals/EditEmployeeModal';
import { useIndexEmployees } from '@/features/employees/hooks/useIndexEmployees';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import { useDeleteEmployee } from '@/features/employees/hooks/useDeleteEmployee';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
}));

export default function EmployeesPage() {
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<EmployeeEntity | null>(null);

	const { data: employees, isLoading: loadingEmployees } = useIndexEmployees();
	const { departments, isLoading: loadingDepartments } = useIndexDepartments();
	const { handleDeleteEmployee } = useDeleteEmployee();

	const handleEdit = (employee: EmployeeEntity) => {
		setSelectedEmployee(employee);
		setOpenEditModal(true);
	};

	const handleDelete = async (id: number) => {
		if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
			try {
				await handleDeleteEmployee(id);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleCloseEdit = () => {
		setOpenEditModal(false);
		setSelectedEmployee(null);
	};

	const isLoading = loadingEmployees || loadingDepartments;

	return (
		<>
			<Root
				header={
					<PageHeader
						title="Empleados"
						subtitle="Gestione la información del personal de la empresa, departamentos y cuentas bancarias."
						actions={
							<Button
								onClick={() => setOpenCreateModal(true)}
								variant="contained"
								color="secondary"
								size="small"
								startIcon={<Plus size={18} />}
								sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
							>
								Crear Empleado
							</Button>
						}
					/>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
						{isLoading ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
								<CircularProgress color="secondary" />
							</Box>
						) : (
							<EmployeeTable
								employees={employees}
								departments={departments}
								isLoading={isLoading}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						)}
					</Box>
				}
				scroll="content"
			/>

			<CreateEmployeeModal
				open={openCreateModal}
				handleClose={() => setOpenCreateModal(false)}
			/>

			<EditEmployeeModal
				open={openEditModal}
				handleClose={handleCloseEdit}
				employee={selectedEmployee}
			/>
		</>
	);
}
