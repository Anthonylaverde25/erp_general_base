import React from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	Box,
	Stack
} from '@mui/material';
import { Save, X } from 'lucide-react';
import { employeeSchema, EmployeeFormType } from '@/schemas/employee/employee.schema';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import useIndexJobPositions from '@/features/job-positions/hooks/useIndexJobPositions';

import { EmployeePersonalInfoSection } from './sections/EmployeePersonalInfoSection';
import { EmployeeWorkInfoSection } from './sections/EmployeeWorkInfoSection';
import { EmployeeContactSection } from './sections/EmployeeContactSection';
import { EmployeeBankAccountsSection } from './sections/EmployeeBankAccountsSection';

interface EmployeeFormProps {
	defaultValues: EmployeeFormType;
	onSubmit: (values: EmployeeFormType) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	submitLabel: string;
	isEdit?: boolean;
}

export default function EmployeeForm({
	defaultValues,
	onSubmit,
	onCancel,
	isLoading = false,
	submitLabel,
	isEdit = false
}: EmployeeFormProps) {
	const { departments } = useIndexDepartments();

	const methods = useForm<EmployeeFormType>({
		mode: 'onChange',
		resolver: zodResolver(employeeSchema),
		defaultValues
	});

	const { control, handleSubmit, setValue, formState: { isValid } } = methods;

	const selectedDepartmentId = useWatch({ control, name: 'department_id' });
	const { jobPositions } = useIndexJobPositions(selectedDepartmentId ? Number(selectedDepartmentId) : null);

	// Auto-select "General" department if not specified
	React.useEffect(() => {
		if (departments && departments.length > 0 && !selectedDepartmentId) {
			const generalDept = departments.find(d => d.code === 'GEN');
			if (generalDept) {
				setValue('department_id', String(generalDept.id));
			}
		}
	}, [departments, selectedDepartmentId, setValue]);

	// Invalidate job position if department changes
	React.useEffect(() => {
		if (selectedDepartmentId) {
			const currentJobPositionId = control._formValues.job_position_id;
			if (currentJobPositionId && jobPositions.length > 0) {
				const isValid = jobPositions.some(jp => String(jp.id) === String(currentJobPositionId));
				if (!isValid) {
					setValue('job_position_id', '');
				}
			}
		} else {
			setValue('job_position_id', '');
		}
	}, [selectedDepartmentId, jobPositions, setValue, control._formValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				{/* SECTION 1: Personal Information */}
				<EmployeePersonalInfoSection isLoading={isLoading} />

				{/* SECTION 2: Work/Labor Contract Information */}
				<EmployeeWorkInfoSection
					isLoading={isLoading}
					isEdit={isEdit}
					departments={departments || []}
					jobPositions={jobPositions || []}
				/>

				{/* SECTION 3: Contact & Address Information */}
				<EmployeeContactSection isLoading={isLoading} />

				{/* SECTION 4: Bank Accounts */}
				<EmployeeBankAccountsSection isLoading={isLoading} />

				{/* Form Actions */}
				<Stack direction="row" justifyContent="flex-end" spacing={2}>
					<Button
						onClick={onCancel}
						variant="outlined"
						color="inherit"
						startIcon={<X size={16} />}
						disabled={isLoading}
						sx={{ px: 3, textTransform: 'none', borderRadius: '4px' }}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						startIcon={<Save size={16} />}
						disabled={!isValid || isLoading}
						sx={{ px: 4, textTransform: 'none', borderRadius: '4px', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
					>
						{submitLabel}
					</Button>
				</Stack>
			</form>
		</FormProvider>
	);
}
