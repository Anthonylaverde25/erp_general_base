import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
	TextField,
	Typography,
	MenuItem,
	Card,
	CardContent
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';

interface EmployeeWorkInfoSectionProps {
	isLoading: boolean;
	isEdit: boolean;
	departments: any[];
	jobPositions: any[];
}

const sectionTitleStyle = {
	fontWeight: 700,
	fontSize: '1rem',
	color: 'text.primary',
	borderLeft: '4px solid #005483',
	pl: 1.5,
	mb: 2
};

export function EmployeeWorkInfoSection({
	isLoading,
	isEdit,
	departments,
	jobPositions
}: EmployeeWorkInfoSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<EmployeeFormType>();

	const selectedDepartmentId = useWatch({ control, name: 'department_id' });

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		disabled: isLoading
	};

	return (
		<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px' }}>
			<CardContent sx={{ p: 3 }}>
				<Typography sx={sectionTitleStyle}>
					Información Laboral
				</Typography>
				<Grid container spacing={3}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="department_id"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									select
									label="Departamento"
									error={!!errors.department_id}
									helperText={errors.department_id?.message}
									value={field.value || ''}
								>
									<MenuItem value=""><em>Ninguno</em></MenuItem>
									{departments?.map((dept) => (
										<MenuItem key={dept.id} value={String(dept.id)}>
											{dept.name}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="job_position_id"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									select
									label="Puesto de Trabajo"
									error={!!errors.job_position_id}
									helperText={errors.job_position_id?.message}
									value={field.value || ''}
									disabled={!selectedDepartmentId || isLoading}
								>
									<MenuItem value=""><em>Ninguno</em></MenuItem>
									{jobPositions?.map((pos) => (
										<MenuItem key={pos.id} value={String(pos.id)}>
											{pos.name}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</Grid>
					{isEdit && (
						<Grid size={{ xs: 12, sm: 6 }}>
							<Controller
								name="status"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										{...textFieldProps}
										select
										label="Estado Laboral"
										required
										error={!!errors.status}
										helperText={errors.status?.message}
									>
										<MenuItem value="active">Activo</MenuItem>
										<MenuItem value="inactive">Inactivo</MenuItem>
										<MenuItem value="on_leave">Licencia / Vacaciones</MenuItem>
										<MenuItem value="terminated">Desvinculado</MenuItem>
									</TextField>
								)}
							/>
						</Grid>
					)}
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="hire_date"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									type="date"
									label="Fecha de Contratación"
									required
									InputLabelProps={{ shrink: true }}
									error={!!errors.hire_date}
									helperText={errors.hire_date?.message}
								/>
							)}
						/>
					</Grid>
					{isEdit && (
						<Grid size={{ xs: 12, sm: 6 }}>
							<Controller
								name="termination_date"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										{...textFieldProps}
										type="date"
										label="Fecha de Cese"
										InputLabelProps={{ shrink: true }}
										error={!!errors.termination_date}
										helperText={errors.termination_date?.message}
										value={field.value || ''}
									/>
								)}
							/>
						</Grid>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
}
