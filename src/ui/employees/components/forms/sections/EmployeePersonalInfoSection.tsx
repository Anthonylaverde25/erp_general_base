import { Controller, useFormContext } from 'react-hook-form';
import {
	TextField,
	Typography,
	MenuItem,
	Card,
	CardContent
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';

interface EmployeePersonalInfoSectionProps {
	isLoading: boolean;
}

const sectionTitleStyle = {
	fontWeight: 700,
	fontSize: '1rem',
	color: 'text.primary',
	borderLeft: '4px solid #005483',
	pl: 1.5,
	mb: 2
};

export function EmployeePersonalInfoSection({ isLoading }: EmployeePersonalInfoSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<EmployeeFormType>();

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		disabled: isLoading
	};

	return (
		<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px' }}>
			<CardContent sx={{ p: 3 }}>
				<Typography sx={sectionTitleStyle}>
					Información Personal
				</Typography>
				<Grid container spacing={3}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="first_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Nombre"
									required
									error={!!errors.first_name}
									helperText={errors.first_name?.message}
								/>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="last_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Apellido"
									required
									error={!!errors.last_name}
									helperText={errors.last_name?.message}
								/>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="document_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									select
									label="Tipo de Documento"
									required
									error={!!errors.document_type}
									helperText={errors.document_type?.message}
								>
									<MenuItem value="DNI">DNI</MenuItem>
									<MenuItem value="NIE">NIE</MenuItem>
									<MenuItem value="Pasaporte">Pasaporte</MenuItem>
									<MenuItem value="RUT">RUT</MenuItem>
									<MenuItem value="Cédula">Cédula</MenuItem>
								</TextField>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="document_number"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Número de Documento"
									required
									error={!!errors.document_number}
									helperText={errors.document_number?.message}
								/>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="birth_date"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									type="date"
									label="Fecha de Nacimiento"
									InputLabelProps={{ shrink: true }}
									error={!!errors.birth_date}
									helperText={errors.birth_date?.message}
									value={field.value || ''}
								/>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									select
									label="Género"
									error={!!errors.gender}
									helperText={errors.gender?.message}
									value={field.value || ''}
								>
									<MenuItem value=""><em>Sin especificar</em></MenuItem>
									<MenuItem value="male">Masculino</MenuItem>
									<MenuItem value="female">Femenino</MenuItem>
									<MenuItem value="other">Otro</MenuItem>
								</TextField>
							)}
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
