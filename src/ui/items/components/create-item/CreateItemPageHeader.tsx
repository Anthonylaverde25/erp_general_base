import { Button, CircularProgress } from '@mui/material';
import { Save } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

type CreateItemPageHeaderProps = {
	itemType: 'physical' | 'service';
	isLoading: boolean;
	isValid: boolean;
	onCancel: () => void;
	onSave: () => void;
	mode?: 'create' | 'edit';
};

function CreateItemPageHeader({
	itemType,
	isLoading,
	isValid,
	onCancel,
	onSave,
	mode = 'create'
}: CreateItemPageHeaderProps) {
	const isEditMode = mode === 'edit';

	const titleText =
		itemType === 'service'
			? isEditMode
				? 'Editar Servicio'
				: 'Nuevo Servicio'
			: isEditMode
				? 'Editar Producto'
				: 'Nuevo Producto';

	const subtitleText =
		itemType === 'service'
			? isEditMode
				? 'Actualiza la información del servicio.'
				: 'Información necesaria para registrar un nuevo servicio.'
			: isEditMode
				? 'Actualiza la información del producto físico.'
				: 'Información necesaria para registrar un nuevo producto físico.';

	return (
		<PageHeader
			title={titleText}
			subtitle={subtitleText}
			onBack={onCancel}
			actions={
				<>
					<Button
						variant="text"
						color="inherit"
						onClick={onCancel}
						disabled={isLoading}
						className="px-4"
						sx={{ textTransform: 'none', fontWeight: 700 }}
					>
						Cancelar
					</Button>
					<Button
						onClick={onSave}
						variant="contained"
						color="secondary"
						disabled={!isValid || isLoading}
						startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Save size={18} />}
						className="px-6 shadow-none hover:shadow-sm"
						sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px' }}
					>
						{isLoading
							? isEditMode
								? 'Actualizando...'
								: 'Guardando...'
							: isEditMode
								? `Actualizar ${itemType === 'service' ? 'Servicio' : 'Producto'}`
								: `Guardar ${itemType === 'service' ? 'Servicio' : 'Producto'}`}
					</Button>
				</>
			}
		/>
	);
}

export default CreateItemPageHeader;
