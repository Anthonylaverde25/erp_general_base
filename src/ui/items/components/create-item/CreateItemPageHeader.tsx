import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Save } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import PageBreadcrumb from '@/components/PageBreadcrumb';

type CreateItemPageHeaderProps = {
	itemType: 'physical' | 'service';
	isLoading: boolean;
	isValid: boolean;
	onCancel: () => void;
	onSave: () => void;
};

function CreateItemPageHeader({ itemType, isLoading, isValid, onCancel, onSave }: CreateItemPageHeaderProps) {
	return (
		<div className="bg-background-default flex w-full flex-1 flex-col items-center justify-between space-y-2 border-b p-6 sm:flex-row sm:space-y-0 sm:px-8">
			<div className="flex flex-col items-start">
				<PageBreadcrumb className="mb-4" />
				<div className="flex items-center gap-3">
					<Button
						className="text-text-secondary hover:text-text-primary h-8 w-8 min-w-0 rounded-full p-0"
						onClick={onCancel}
					>
						<FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
					</Button>
					<div>
						<Typography
							variant="h2"
							className="text-text-primary text-2xl font-bold tracking-tight"
						>
							{itemType === 'service' ? 'Nuevo Servicio' : 'Nuevo Producto'}
						</Typography>
						<Typography
							variant="body2"
							className="text-text-secondary"
						>
							{itemType === 'service'
								? 'Información necesaria para registrar un nuevo servicio.'
								: 'Información necesaria para registrar un nuevo producto físico.'}
						</Typography>
					</div>
				</div>
			</div>
			<div className="flex gap-3">
				<Button
					variant="text"
					color="inherit"
					onClick={onCancel}
					disabled={isLoading}
					className="px-4"
				>
					Cancelar
				</Button>
				<Button
					onClick={onSave}
					variant="contained"
					color="secondary"
					disabled={!isValid || isLoading}
					startIcon={isLoading ? undefined : <Save />}
					className="px-6 shadow-none hover:shadow-sm"
				>
					{isLoading ? 'Guardando...' : `Guardar ${itemType === 'service' ? 'Servicio' : 'Producto'}`}
				</Button>
			</div>
		</div>
	);
}

export default CreateItemPageHeader;
