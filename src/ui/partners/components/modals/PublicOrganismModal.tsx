import { useState } from 'react';
import { TextField, MenuItem, Button, Typography, Fade, Box, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { AppFormModal } from '@/components/modals/AppFormModal';

export interface PublicOrganism {
	id: string;
	nombre: string;
	codigo: string;
	tipo_organismo: string;
	direccion: string;
	responsable: string;
	is_default: boolean;
}

interface PublicOrganismModalProps {
	open: boolean;
	onClose: () => void;
	organisms: PublicOrganism[];
	onOrganismsChange: (organisms: PublicOrganism[]) => void;
}

const emptyOrganism = {
	nombre: '',
	codigo: '',
	tipo_organismo: '',
	direccion: '',
	responsable: ''
};

const tiposOrganismo = [
	{ value: 'ministerio', label: 'Ministerio' },
	{ value: 'ayuntamiento', label: 'Ayuntamiento' },
	{ value: 'comunidad_autonoma', label: 'Comunidad Autónoma' },
	{ value: 'otro', label: 'Otro' }
];

export default function PublicOrganismModal({ open, onClose, organisms, onOrganismsChange }: PublicOrganismModalProps) {
	const [form, setForm] = useState(emptyOrganism);
	const [showForm, setShowForm] = useState(organisms.length === 0);

	const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleAdd = () => {
		if (!form.nombre.trim()) return;

		const newOrganism: PublicOrganism = {
			id: crypto.randomUUID(),
			...form,
			is_default: organisms.length === 0 // first one is default
		};
		onOrganismsChange([...organisms, newOrganism]);
		setForm(emptyOrganism);
		setShowForm(false);
	};

	const handleRemove = (id: string) => {
		const updated = organisms.filter((o) => o.id !== id);

		// If we removed the default, make the first one default
		if (updated.length > 0 && !updated.some((o) => o.is_default)) {
			updated[0].is_default = true;
		}

		onOrganismsChange(updated);
	};

	const handleSetDefault = (id: string) => {
		const updated = organisms.map((o) => ({
			...o,
			is_default: o.id === id
		}));
		onOrganismsChange(updated);
	};

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		size: 'small' as const
	};

	const isFormValid = form.nombre.trim() !== '';

	return (
		<AppFormModal
			isOpen={open}
			onClose={onClose}
			title="Organismos Públicos"
			subtitle="Gestione los organismos públicos asociados a este socio"
			actions={
				<>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mr: 'auto' }}
					>
						{organisms.length} organismo{organisms.length !== 1 ? 's' : ''} asociado
						{organisms.length !== 1 ? 's' : ''}
					</Typography>
					<Button
						variant="contained"
						color="secondary"
						onClick={onClose}
					>
						Aceptar
					</Button>
				</>
			}
		>
			<Box sx={{ p: 0 }}>
				{/* LIST OF EXISTING ORGANISMS */}
				{organisms.length > 0 && (
					<Box sx={{ p: 2, pb: 0 }}>
						<div className="space-y-3">
							{organisms.map((org) => (
								<Fade
									in
									key={org.id}
								>
									<div
										className={`relative rounded-xl border p-4 transition-all duration-200 ${
											org.is_default
												? 'border-secondary ring-secondary bg-blue-50/50 ring-1 dark:bg-blue-900/10'
												: 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
										}`}
									>
										<div className="mb-2 flex items-start justify-between">
											<div
												className="flex cursor-pointer items-center select-none"
												onClick={() => handleSetDefault(org.id)}
											>
												<div
													className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
														org.is_default
															? 'border-secondary bg-secondary'
															: 'border-gray-400 bg-white dark:bg-gray-700'
													}`}
												>
													{org.is_default && (
														<div className="h-2.5 w-2.5 rounded-full bg-white" />
													)}
												</div>
												<span
													className={`text-sm font-medium ${
														org.is_default
															? 'text-secondary font-bold'
															: 'text-gray-600 dark:text-gray-400'
													}`}
												>
													{org.is_default
														? 'Predeterminado'
														: 'Establecer como predeterminado'}
												</span>
											</div>
											<IconButton
												size="small"
												onClick={() => handleRemove(org.id)}
												sx={{
													borderColor: 'divider',
													color: 'text.secondary',
													'&:hover': { bgcolor: 'action.hover', color: 'text.primary' }
												}}
											>
												<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
											</IconButton>
										</div>
										<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Nombre
												</Typography>
												<Typography
													variant="body2"
													fontWeight={600}
												>
													{org.nombre}
												</Typography>
											</div>
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Código
												</Typography>
												<Typography
													variant="body2"
													fontWeight={500}
													sx={{ fontFamily: 'monospace' }}
												>
													{org.codigo || '—'}
												</Typography>
											</div>
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Tipo
												</Typography>
												<Typography variant="body2">
													{tiposOrganismo.find((t) => t.value === org.tipo_organismo)
														?.label ||
														org.tipo_organismo ||
														'—'}
												</Typography>
											</div>
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Responsable
												</Typography>
												<Typography variant="body2">{org.responsable || '—'}</Typography>
											</div>
											<div className="col-span-2">
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Dirección
												</Typography>
												<Typography variant="body2">{org.direccion || '—'}</Typography>
											</div>
										</div>
									</div>
								</Fade>
							))}
						</div>
					</Box>
				)}

				{/* ADD FORM */}
				{showForm ? (
					<Box sx={{ p: 2 }}>
						<Typography
							variant="subtitle2"
							className="mb-3 font-bold text-gray-700 uppercase dark:text-gray-300"
						>
							Nuevo Organismo
						</Typography>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<TextField
								{...textFieldProps}
								label="Nombre del Organismo *"
								value={form.nombre}
								onChange={handleChange('nombre')}
							/>
							<TextField
								{...textFieldProps}
								label="Código"
								value={form.codigo}
								onChange={handleChange('codigo')}
							/>
							<TextField
								{...textFieldProps}
								select
								label="Tipo de Organismo"
								value={form.tipo_organismo}
								onChange={handleChange('tipo_organismo')}
							>
								<MenuItem
									value=""
									disabled
								>
									Seleccionar...
								</MenuItem>
								{tiposOrganismo.map((t) => (
									<MenuItem
										key={t.value}
										value={t.value}
									>
										{t.label}
									</MenuItem>
								))}
							</TextField>
							<TextField
								{...textFieldProps}
								label="Responsable"
								value={form.responsable}
								onChange={handleChange('responsable')}
							/>
							<div className="sm:col-span-2">
								<TextField
									{...textFieldProps}
									label="Dirección"
									value={form.direccion}
									onChange={handleChange('direccion')}
								/>
							</div>
						</div>
						<div className="mt-4 flex justify-end gap-2">
							{organisms.length > 0 && (
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={() => {
										setForm(emptyOrganism);
										setShowForm(false);
									}}
								>
									Cancelar
								</Button>
							)}
							<Button
								variant="contained"
								color="secondary"
								size="small"
								onClick={handleAdd}
								disabled={!isFormValid}
								startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
							>
								Añadir
							</Button>
						</div>
					</Box>
				) : (
					<Box sx={{ p: 2 }}>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							fullWidth
							startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
							onClick={() => setShowForm(true)}
							sx={{
								borderStyle: 'dashed',
								py: 1.5,
								fontSize: '0.85rem'
							}}
						>
							Añadir Organismo Público
						</Button>
					</Box>
				)}

				{/* EMPTY STATE */}
				{organisms.length === 0 && !showForm && (
					<Box
						className="flex h-32 cursor-pointer flex-col items-center justify-center text-gray-500"
						onClick={() => setShowForm(true)}
						sx={{ pb: 2 }}
					>
						<FuseSvgIcon
							size={48}
							className="mb-2 opacity-50"
						>
							heroicons-outline:building-library
						</FuseSvgIcon>
						<Typography>No hay organismos públicos asociados</Typography>
						<Typography
							variant="caption"
							className="mt-1"
						>
							Haga clic para añadir uno
						</Typography>
					</Box>
				)}
			</Box>
		</AppFormModal>
	);
}
