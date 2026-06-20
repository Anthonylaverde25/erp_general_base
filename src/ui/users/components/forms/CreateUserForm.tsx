import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
	TextField,
	Button,
	Box,
	Typography,
	Divider,
	InputAdornment,
	IconButton,
	Stack,
	Fade,
	MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Shield, Save, Close, Badge } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';

import useIndexRoles from '@/features/roles/hooks/useIndexRoles';
import useCreateUser from '@/features/users/hooks/useCreateUser';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import useIndexJobPositions from '@/features/job-positions/hooks/useIndexJobPositions';
import { CreateUserFormType, createUserSchema } from '@/schemas/user/user.schema';
import { defaultCreateUserValues } from '@/schemas/user/user.defaults';
import { ICreateUser } from '@/types/user.types';

interface CreateUserFormProps {
	onCancel: () => void;
	onSuccess?: () => void;
}

export default function CreateUserForm({ onCancel, onSuccess }: CreateUserFormProps) {
	const { handleCreateUser, isLoading } = useCreateUser();
	const { roles } = useIndexRoles();
	const { departments } = useIndexDepartments();

	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

	const { control, formState, handleSubmit, setValue } = useForm<CreateUserFormType>({
		mode: 'onChange',
		resolver: zodResolver(createUserSchema),
		defaultValues: defaultCreateUserValues
	});

	const { errors, isValid } = formState;

	const selectedDepartmentId = useWatch({ control, name: 'department_id' });
	const { jobPositions } = useIndexJobPositions(selectedDepartmentId ? Number(selectedDepartmentId) : null);

	// Reset job position when department changes
	React.useEffect(() => {
		setValue('job_position_id', 0);
	}, [selectedDepartmentId, setValue]);

	const onSubmit = async (data: CreateUserFormType) => {
		try {
			const payload: ICreateUser = {
				name: data.name,
				last_name: data.last_name,
				email: data.email,
				password: data.password,
				password_confirmation: data.password_confirmation,
				phone: data.phone || '',
				department_ids: [],
				role_id: data.role_id,
				department_id: data.department_id,
				job_position_id: data.job_position_id,
				document_type: data.document_type,
				document_number: data.document_number
			};

			await handleCreateUser(payload);
			onSuccess?.();
			onCancel();
		} catch (error) {
			console.error(error);
		}
	};

	const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
			sx={{ mb: 2 }}
		>
			<Icon
				fontSize="small"
				color="primary"
			/>
			<Typography
				variant="subtitle1"
				fontWeight={600}
				color="text.primary"
			>
				{title}
			</Typography>
		</Stack>
	);

	return (
		<Fade
			in
			timeout={400}
		>
			<Box>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={4}>
						{/* Header */}
						<Box>
							<Typography
								variant="h5"
								fontWeight={700}
								gutterBottom
							>
								Crear nuevo usuario
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Complete la información para registrar un nuevo usuario en el sistema
							</Typography>
						</Box>

						<Divider />

						{/* Información Personal */}
						<Box>
							<SectionTitle
								icon={Person}
								title="Información personal"
							/>

							<Stack spacing={3}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
								>
									<Controller
										name="name"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Nombre"
												placeholder="Ej: Juan"
												error={!!errors.name}
												helperText={errors.name?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>

									<Controller
										name="last_name"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Apellido"
												placeholder="Ej: Pérez García"
												error={!!errors.last_name}
												helperText={errors.last_name?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>
								</Stack>

								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
								>
									<Controller
										name="email"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Correo electrónico"
												placeholder="usuario@empresa.com"
												type="email"
												error={!!errors.email}
												helperText={errors.email?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>

									<Controller
										name="phone"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Teléfono"
												placeholder="+54 11 1234-5678"
												type="tel"
												error={!!errors.phone}
												helperText={errors.phone?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>
								</Stack>
							</Stack>
						</Box>

						{/* Seguridad */}
						<Box>
							<SectionTitle
								icon={Lock}
								title="Seguridad de la cuenta"
							/>

							<Stack spacing={3}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
								>
									<Controller
										name="password"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Contraseña"
												placeholder="Mínimo 8 caracteres"
												type={showPassword ? 'text' : 'password'}
												error={!!errors.password}
												helperText={errors.password?.message}
												fullWidth
												variant="filled"
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																size="small"
																onClick={() => setShowPassword((v) => !v)}
																edge="end"
																tabIndex={-1}
															>
																{showPassword ? (
																	<VisibilityOff fontSize="small" />
																) : (
																	<Visibility fontSize="small" />
																)}
															</IconButton>
														</InputAdornment>
													)
												}}
											/>
										)}
									/>

									<Controller
										name="password_confirmation"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Confirmar contraseña"
												placeholder="Repita la contraseña"
												type={showConfirmPassword ? 'text' : 'password'}
												error={!!errors.password_confirmation}
												helperText={errors.password_confirmation?.message}
												fullWidth
												variant="outlined"
												size="small"
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																size="small"
																onClick={() => setShowConfirmPassword((v) => !v)}
																edge="end"
																tabIndex={-1}
															>
																{showConfirmPassword ? (
																	<VisibilityOff fontSize="small" />
																) : (
																	<Visibility fontSize="small" />
																)}
															</IconButton>
														</InputAdornment>
													)
												}}
											/>
										)}
									/>
								</Stack>
							</Stack>
						</Box>

						{/* Información Laboral */}
						<Box>
							<SectionTitle
								icon={Badge}
								title="Información laboral"
							/>

							<Stack spacing={3}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
								>
									<Controller
										name="document_type"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Tipo de documento"
												error={!!errors.document_type}
												helperText={errors.document_type?.message}
												fullWidth
												variant="filled"
											>
												<MenuItem value="DNI">DNI</MenuItem>
												<MenuItem value="NIE">NIE</MenuItem>
												<MenuItem value="Pasaporte">Pasaporte</MenuItem>
												<MenuItem value="RUT">RUT</MenuItem>
												<MenuItem value="Cédula">Cédula</MenuItem>
											</TextField>
										)}
									/>

									<Controller
										name="document_number"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Número de documento"
												placeholder="Ej: 12345678Z"
												error={!!errors.document_number}
												helperText={errors.document_number?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>
								</Stack>

								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
								>
									<Controller
										name="department_id"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Departamento"
												error={!!errors.department_id}
												helperText={errors.department_id?.message}
												fullWidth
												variant="filled"
												value={field.value === undefined ? '' : field.value}
												onChange={(e) => {
													const val = Number(e.target.value);
													field.onChange(val);
												}}
											>
												<MenuItem
													value={0}
													disabled
												>
													<em>Seleccione un departamento</em>
												</MenuItem>
												{departments?.map((dept) => (
													<MenuItem
														key={dept.id}
														value={dept.id}
													>
														{dept.name}
													</MenuItem>
												))}
											</TextField>
										)}
									/>

									<Controller
										name="job_position_id"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Puesto de trabajo"
												error={!!errors.job_position_id}
												helperText={errors.job_position_id?.message}
												fullWidth
												variant="filled"
												value={field.value === undefined ? '' : field.value}
												disabled={!selectedDepartmentId || selectedDepartmentId === 0}
												onChange={(e) => {
													const val = Number(e.target.value);
													field.onChange(val);
												}}
											>
												<MenuItem
													value={0}
													disabled
												>
													<em>Seleccione un puesto de trabajo</em>
												</MenuItem>
												{jobPositions?.map((pos) => (
													<MenuItem
														key={pos.id}
														value={pos.id}
													>
														{pos.name}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Stack>
							</Stack>
						</Box>

						{/* Roles */}
						<Box>
							<SectionTitle
								icon={Shield}
								title="Roles y permisos"
							/>

							<Controller
								name="role_id"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										select
										label="Seleccionar rol"
										error={!!errors.role_id}
										helperText={
											errors.role_id?.message || 'Asigne el rol correspondiente al usuario'
										}
										fullWidth
										variant="filled"
										value={field.value || ''}
									>
										{roles?.map((role) => (
											<MenuItem
												key={role.id}
												value={role.id}
											>
												<Stack>
													<Typography
														variant="body2"
														fontWeight={500}
													>
														{role.name}
													</Typography>
													{role.description && (
														<Typography
															variant="caption"
															color="text.secondary"
														>
															{role.description}
														</Typography>
													)}
												</Stack>
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</Box>

						{/* Actions */}
						<Divider />

						<Stack
							direction="row"
							justifyContent="flex-end"
							spacing={2}
							sx={{ pt: 1 }}
						>
							<Button
								className="btn-secondary"
								onClick={onCancel}
								disabled={isLoading}
								startIcon={<Close />}
								sx={{
									px: 3,
									textTransform: 'none',
									fontWeight: 600,
									borderRadius: 1.5
								}}
							>
								Cancelar
							</Button>

							<Button
								className="btn-primary"
								type="submit"
								variant="contained"
								disabled={!isValid || isLoading}
								startIcon={<Save />}
								sx={{
									px: 4,
									textTransform: 'none',
									fontWeight: 600,
									borderRadius: 1.5,
									boxShadow: 2,
									'&:hover': {
										boxShadow: 4
									}
								}}
							>
								{isLoading ? 'Guardando...' : 'Crear usuario'}
							</Button>
						</Stack>
					</Stack>
				</form>
			</Box>
		</Fade>
	);
}
