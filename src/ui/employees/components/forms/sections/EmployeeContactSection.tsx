import { Controller, useFormContext } from 'react-hook-form';
import {
	TextField,
	Typography,
	Card,
	CardContent,
	Stack
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';

interface EmployeeContactSectionProps {
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

export function EmployeeContactSection({ isLoading }: EmployeeContactSectionProps) {
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
		<Grid container spacing={4}>
			{/* Contact Details */}
			<Grid size={{ xs: 12, md: 6 }}>
				<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px', height: '100%' }}>
					<CardContent sx={{ p: 3 }}>
						<Typography sx={sectionTitleStyle}>
							Datos de Contacto
						</Typography>
						<Stack spacing={3}>
							<Controller
								name="contact_email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										{...textFieldProps}
										type="email"
										label="Correo Electrónico"
										error={!!errors.contact_email}
										helperText={errors.contact_email?.message}
									/>
								)}
							/>
							<Controller
								name="contact_phone"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										{...textFieldProps}
										label="Teléfono"
										error={!!errors.contact_phone}
										helperText={errors.contact_phone?.message}
									/>
								)}
							/>
						</Stack>
					</CardContent>
				</Card>
			</Grid>

			{/* Address Details */}
			<Grid size={{ xs: 12, md: 6 }}>
				<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px', height: '100%' }}>
					<CardContent sx={{ p: 3 }}>
						<Typography sx={sectionTitleStyle}>
							Dirección
						</Typography>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12 }}>
								<Controller
									name="address_street"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											{...textFieldProps}
											label="Dirección"
											error={!!errors.address_street}
											helperText={errors.address_street?.message}
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Controller
									name="address_city"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											{...textFieldProps}
											label="Ciudad"
											error={!!errors.address_city}
											helperText={errors.address_city?.message}
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Controller
									name="address_postal_code"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											{...textFieldProps}
											label="Código Postal"
											error={!!errors.address_postal_code}
											helperText={errors.address_postal_code?.message}
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Controller
									name="address_state"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											{...textFieldProps}
											label="Provincia / Estado"
											error={!!errors.address_state}
											helperText={errors.address_state?.message}
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Controller
									name="address_country"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											{...textFieldProps}
											label="País"
											error={!!errors.address_country}
											helperText={errors.address_country?.message}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}
