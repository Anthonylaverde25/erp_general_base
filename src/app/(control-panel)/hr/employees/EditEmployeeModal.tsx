import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EmployeeForm from '@/ui/employees/components/EmployeeForm';
import { defaultUpdateEmployeeValues } from '@/schemas/employee/employee.defaults';
import { mapEmployeeFormToDTO } from '@/ui/employees/components/EmployeeForm.utils';
import { useUpdateEmployee } from '@/features/employees/hooks/useUpdateEmployee';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';
import { UpdateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';

interface EditEmployeeModalProps {
	open: boolean;
	handleClose: () => void;
	employee: EmployeeEntity | null;
}

export function EditEmployeeModal({ open, handleClose, employee }: EditEmployeeModalProps) {
	const { handleUpdateEmployee, isLoading } = useUpdateEmployee();

	const onSubmit = async (values: EmployeeFormType) => {
		if (!employee) return;

		const dto = mapEmployeeFormToDTO(values, employee.company_id);
		try {
			await handleUpdateEmployee(employee.id, dto as UpdateEmployeeDTO);
			handleClose();
		} catch (error) {
			console.error(error);
		}
	};

	if (!employee) return null;

	const formValues = defaultUpdateEmployeeValues(employee.toPlainObject());

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
					borderRadius: '4px' // Sharp edges matching SAP Fiori Horizon standard
				}
			}}
		>
			<DialogContent sx={{ p: 4 }}>
				<EmployeeForm
					defaultValues={formValues}
					onSubmit={onSubmit}
					onCancel={handleClose}
					isLoading={isLoading}
					submitLabel="Guardar Cambios"
					isEdit
				/>
			</DialogContent>
		</Dialog>
	);
}
