import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EmployeeForm from '@/ui/employees/components/EmployeeForm';
import { defaultCreateEmployeeValues } from '@/schemas/employee/employee.defaults';
import { mapEmployeeFormToDTO } from '@/ui/employees/components/EmployeeForm.utils';
import { useCreateEmployee } from '@/features/employees/hooks/useCreateEmployee';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';
import { CreateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';

interface CreateEmployeeModalProps {
	open: boolean;
	handleClose: () => void;
}

export function CreateEmployeeModal({ open, handleClose }: CreateEmployeeModalProps) {
	const { handleCreateEmployee, isLoading } = useCreateEmployee();
	const activeCompany = useActiveCompany();

	const onSubmit = async (values: EmployeeFormType) => {
		if (!activeCompany?.id) return;

		const dto = mapEmployeeFormToDTO(values, activeCompany.id);
		try {
			await handleCreateEmployee(dto as CreateEmployeeDTO);
			handleClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					bgcolor: 'background.default',
					minHeight: '600px',
					width: '100%',
					borderRadius: '4px' // Sharp edges
				}
			}}
		>
			<DialogContent sx={{ p: 4 }}>
				<EmployeeForm
					defaultValues={defaultCreateEmployeeValues}
					onSubmit={onSubmit}
					onCancel={handleClose}
					isLoading={isLoading}
					submitLabel="Crear Empleado"
				/>
			</DialogContent>
		</Dialog>
	);
}
