import React from 'react';
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	TextField,
	Button,
	Box,
	Typography,
	Divider,
	Stack,
	MenuItem,
	Card,
	CardContent
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Save, X, Plus, Trash } from 'lucide-react';
import { employeeSchema, EmployeeFormType } from '@/schemas/employee/employee.schema';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import useIndexJobPositions from '@/features/job-positions/hooks/useIndexJobPositions';
import { EmployeeStatus } from '@/domain/entities/employees/DTOs/EmployeeDTOs';

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

	const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<EmployeeFormType>({
		mode: 'onChange',
		resolver: zodResolver(employeeSchema),
		defaultValues
	});

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

	const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({
		control,
		name: 'bank_accounts'
	});

	const bankAccounts = useWatch({ control, name: 'bank_accounts' });

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		disabled: isLoading
	};

	const sectionTitleStyle = {
		fontWeight: 700,
		fontSize: '1rem',
		color: 'text.primary',
		borderLeft: '4px solid #005483',
		pl: 1.5,
		mb: 2
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* SECTION 1: Personal Information */}
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

			{/* SECTION 2: Work/Labor Contract Information */}
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
										disabled={!selectedDepartmentId}
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

			{/* SECTION 3: Contact & Address Information */}
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

			{/* SECTION 4: Bank Accounts */}
			<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px' }}>
				<CardContent sx={{ p: 3 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
						<Typography sx={{ ...sectionTitleStyle, mb: 0 }}>
							Cuentas Bancarias
						</Typography>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							startIcon={<Plus size={16} />}
							onClick={() => appendBank({ name: '', account_holder: '', account_number: '', swift: '', is_default: false })}
							disabled={isLoading}
							sx={{ textTransform: 'none', borderRadius: '4px' }}
						>
							Añadir Cuenta
						</Button>
					</Stack>

					<Stack spacing={3}>
						{bankFields.length === 0 && (
							<Box sx={{ border: '1px dashed', borderColor: 'divider', bgcolor: 'action.hover', p: 4, textAlign: 'center', borderRadius: '4px' }}>
								<Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
									No hay cuentas bancarias registradas.
								</Typography>
							</Box>
						)}
						{bankFields.map((fieldItem, index) => {
							const isDefault = bankAccounts?.[index]?.is_default;
							return (
								<Box
									key={fieldItem.id}
									sx={{
										border: '1px solid',
										borderColor: isDefault ? 'secondary.light' : 'divider',
										borderRadius: '4px',
										p: 3,
										bgcolor: isDefault ? 'action.selected' : 'transparent',
										transition: 'all 0.2s'
									}}
								>
									<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
										<Controller
											name={`bank_accounts.${index}.is_default`}
											control={control}
											render={({ field }) => (
												<Stack
													direction="row"
													spacing={1.5}
													alignItems="center"
													sx={{ cursor: 'pointer', userSelect: 'none' }}
													onClick={() => {
														bankFields.forEach((_, i) => setValue(`bank_accounts.${i}.is_default`, false));
														setValue(`bank_accounts.${index}.is_default`, true);
														field.onChange(true);
													}}
												>
													<Box
														sx={{
															width: 16,
															height: 16,
															borderRadius: '50%',
															border: '1px solid',
															borderColor: field.value ? 'secondary.main' : 'text.disabled',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															bgcolor: field.value ? 'secondary.main' : 'transparent'
														}}
													>
														{field.value && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
													</Box>
													<Typography variant="body2" fontWeight={500} color={field.value ? 'secondary.main' : 'text.secondary'}>
														{field.value ? 'Cuenta Principal' : 'Marcar como Principal'}
													</Typography>
												</Stack>
											)}
										/>
										<Button
											size="small"
											color="error"
											onClick={() => removeBank(index)}
											sx={{ minWidth: 0, p: 1 }}
											disabled={isLoading}
										>
											<Trash size={16} />
										</Button>
									</Stack>

									<Grid container spacing={2}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<Controller
												name={`bank_accounts.${index}.name`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="Banco / Entidad"
														error={!!errors.bank_accounts?.[index]?.name}
														helperText={errors.bank_accounts?.[index]?.name?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<Controller
												name={`bank_accounts.${index}.account_holder`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="Titular"
														error={!!errors.bank_accounts?.[index]?.account_holder}
														helperText={errors.bank_accounts?.[index]?.account_holder?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 8 }}>
											<Controller
												name={`bank_accounts.${index}.account_number`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="CBU / CVU / Nro. Cuenta"
														error={!!errors.bank_accounts?.[index]?.account_number}
														helperText={errors.bank_accounts?.[index]?.account_number?.message}
													/>
												)}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 4 }}>
											<Controller
												name={`bank_accounts.${index}.swift`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="SWIFT / Alias"
														error={!!errors.bank_accounts?.[index]?.swift}
														helperText={errors.bank_accounts?.[index]?.swift?.message}
													/>
												)}
											/>
										</Grid>
									</Grid>
								</Box>
							);
						})}
					</Stack>
				</CardContent>
			</Card>

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
	);
}
