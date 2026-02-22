import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InvoiceTemplateSelector from '../components/InvoiceTemplateSelector';
import { SUPPORTED_LANGUAGES, NUMBER_FORMATS } from '../constants/preferences';

export default function PreferencesTab() {
	const {
		register,
		watch,
		setValue,
		reset,
		formState: { isSubmitting }
	} = useFormContext<CompanySettingsForm>();
	const [isEditing, setIsEditing] = React.useState(false);
	const language = watch('preferences.language');
	const numberFormat = watch('preferences.number_format');
	const designType = watch('design_type');

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset preferences fields
		reset(undefined, { keepDefaultValues: true });
	};

	const handleSave = async () => {
		// TODO: Implement API call to save preferences data
		console.log('Saving preferences...');
		setIsEditing(false);
	};

	return (
		<Box>
			{/* Section Header with Edit Controls */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Box>
					<Typography
						variant="h6"
						fontWeight={600}
					>
						Preferencias
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Configuración de formato y visualización
					</Typography>
				</Box>
				{!isEditing ? (
					<Button
						className="btn-primary"
						variant="outlined"
						size="large"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
						onClick={handleEdit}
					>
						Editar
					</Button>
				) : (
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							className="btn-secondary"
							variant="outlined"
							color="secondary"
							size="large"
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:x-mark</FuseSvgIcon>}
							onClick={handleCancel}
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							className="btn-primary"
							variant="contained"
							color="primary"
							size="large"
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
							onClick={handleSave}
							disabled={isSubmitting}
						>
							Guardar
						</Button>
					</Box>
				)}
			</Box>

			<Box sx={{ display: 'grid', gap: 2 }}>
				<Box>
					<TextField
						{...register('preferences.language')}
						select
						label="Idioma"
						value={language || 'Español'}
						fullWidth
						size="small"
						defaultValue="Español"
						disabled={!isEditing}
					>
						{SUPPORTED_LANGUAGES.map((option) => (
							<MenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				</Box>
				<Box>
					<TextField
						{...register('preferences.number_format')}
						select
						label="Formato de número"
						value={numberFormat || '1,234.56'}
						fullWidth
						size="small"
						defaultValue="1,234.56"
						disabled={!isEditing}
					>
						{NUMBER_FORMATS.map((option) => (
							<MenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				</Box>

				<Box>
					<Typography
						variant="caption"
						sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}
					>
						Cantidad Máxima de Usuarios
					</Typography>
					<TextField
						{...register('preferences.max_users', { valueAsNumber: true })}
						type="number"
						placeholder="Ej: 3"
						fullWidth
						size="small"
						variant="filled"
						InputProps={{ readOnly: !isEditing }}
					/>
				</Box>

				{/* Invoice Template Section */}
				<Box sx={{ mt: 2 }}>
					<InvoiceTemplateSelector />
				</Box>
			</Box>
		</Box>
	);
}
