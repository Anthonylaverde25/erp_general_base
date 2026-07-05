import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { 
	TextField, 
	Stack, 
	Box, 
	Typography, 
	Switch, 
	FormControlLabel 
} from '@mui/material';
import { Badge, Code, Description, AssignmentInd } from '@mui/icons-material';

interface RoleInfoStepProps {
	control: Control<any>;
	errors: FieldErrors<any>;
	isLoading: boolean;
	isLoadingCatalog: boolean;
	allPermissions: boolean;
	onToggleAllPermissions: (checked: boolean) => void;
}

export default function RoleInfoStep({
	control,
	errors,
	isLoading,
	isLoadingCatalog,
	allPermissions,
	onToggleAllPermissions
}: RoleInfoStepProps) {
	
	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		disabled: isLoading,
		InputProps: {
			sx: {
				borderRadius: 0
			}
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
		<Box sx={{ px: 0.5, py: 1 }}>
			<SectionTitle
				icon={AssignmentInd}
				title="Detalles del Rol"
			/>

			<Stack spacing={3}>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="Nombre del rol"
							placeholder="Ej: Supervisor de Facturación"
							required
							error={!!errors.name}
							helperText={errors.name?.message as string}
							InputProps={{
								sx: { borderRadius: 0 },
								startAdornment: (
									<Badge
										color="action"
										fontSize="small"
										sx={{ mr: 1 }}
									/>
								)
							}}
						/>
					)}
				/>

				<Controller
					name="code"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="Código"
							placeholder="Ej: SUPERVISOR_BILLING"
							required
							error={!!errors.code}
							helperText={(errors.code?.message as string) || 'Código único del sistema'}
							inputProps={{
								style: { textTransform: 'uppercase', fontFamily: 'monospace' }
							}}
							onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
							InputProps={{
								sx: { borderRadius: 0 },
								startAdornment: (
									<Code
										color="action"
										fontSize="small"
										sx={{ mr: 1 }}
									/>
								)
							}}
						/>
					)}
				/>

				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="Descripción"
							placeholder="Describe las tareas y alcances operativos..."
							required
							multiline
							rows={3}
							error={!!errors.description}
							helperText={errors.description?.message as string}
							InputProps={{
								sx: { borderRadius: 0 },
								startAdornment: (
									<Description
										color="action"
										fontSize="small"
										sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }}
									/>
								)
							}}
						/>
					)}
				/>


				<FormControlLabel
					control={
						<Switch
							checked={allPermissions}
							onChange={(e) => onToggleAllPermissions(e.target.checked)}
							color="primary"
							disabled={isLoadingCatalog}
						/>
					}
					label={
						<Box sx={{ ml: 1 }}>
							<Typography
								variant="body2"
								fontWeight={600}
							>
								Permisos totales (Superusuario)
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ display: 'block', mt: 0.2 }}
							>
								Asigna automáticamente todos los accesos del sistema a este rol
							</Typography>
						</Box>
					}
					sx={{ mt: 1, alignItems: 'flex-start' }}
				/>
			</Stack>
		</Box>
	);
}
