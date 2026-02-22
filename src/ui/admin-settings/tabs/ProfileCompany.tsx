import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';
import useActiveCompany from '@/features/companies/useActiveCompany';
import useUpdateCompany from '@/features/companies/hooks/useUpdateCompany';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SectionHeader from '../components/SectionHeader';

export default function ProfileCompany() {
	const {
		register,
		setValue,
		watch,
		reset,
		formState: { isSubmitting, isDirty }
	} = useFormContext<CompanySettingsForm>();
	const activeCompany = useActiveCompany();
	const { mutateAsync: updateCompany, isPending } = useUpdateCompany();

	// Modal State
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState({
		name: '',
		cif: '',
		website: '',
		brandColor: '#1976d2'
	});

	const handleOpenModal = () => {
		if (activeCompany) {
			setModalData({
				name: activeCompany.name || '',
				cif: activeCompany.cif || '',
				website: activeCompany.website || '',
				brandColor: activeCompany.brandColor || '#1976d2'
			});
		}

		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setModalData({
			...modalData,
			[e.target.name]: e.target.value
		});
	};

	const handleModalSave = async () => {
		if (!activeCompany) return;

		try {
			await updateCompany({
				id: activeCompany.id,
				data: modalData
			});
			setOpenModal(false);
		} catch (error) {
			console.error('Failed to update company via modal', error);
		}
	};

	console.log('activeCompany', activeCompany);

	// Watch fields for logic and previews
	const logoFile = watch('logo');
	const faviconFile = watch('favicon');

	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

	const currentLogo = logoPreview || activeCompany?.logo_url;
	// Favicon might not exist on Company entity yet, so we just use preview
	const currentFavicon = faviconPreview || activeCompany?.favicon_url;

	useEffect(() => {
		if (!logoFile) {
			setLogoPreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(logoFile);
		setLogoPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [logoFile]);

	useEffect(() => {
		if (!faviconFile) {
			setFaviconPreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(faviconFile);
		setFaviconPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [faviconFile]);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles && acceptedFiles[0];

			if (file) {
				if (file.size > 5 * 1024 * 1024) {
					// 5MB limit
					// You might want to use enqueueSnackbar here if available, but for now console error or alert
					console.error('File too large. Max 5MB.');
					return;
				}

				if (activeCompany) {
					// Optimistic update
					const objectUrl = URL.createObjectURL(file);
					setLogoPreview(objectUrl);
					setValue('logo', file); // Keep form sync just in case

					try {
						await updateCompany({
							id: activeCompany.id,
							data: { logo: file }
						});
					} catch (error) {
						console.error('Failed to upload logo', error);
						setLogoPreview(null); // Revert on error
					}
				}
			}
		},
		[activeCompany, updateCompany, setValue]
	);

	const onFaviconDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles && acceptedFiles[0];

			if (file) {
				if (file.size > 5 * 1024 * 1024) {
					// 5MB limit
					console.error('File too large. Max 5MB.');
					return;
				}

				if (activeCompany) {
					// Optimistic update
					const objectUrl = URL.createObjectURL(file);
					setFaviconPreview(objectUrl);
					setValue('favicon', file);

					try {
						await updateCompany({
							id: activeCompany.id,
							data: { favicon: file }
						});
					} catch (error) {
						console.error('Failed to upload favicon', error);
						setFaviconPreview(null);
					}
				}
			}
		},
		[activeCompany, updateCompany, setValue]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'image/*': [] },
		maxFiles: 1
	});

	const {
		getRootProps: getRootPropsIcon,
		getInputProps: getInputPropsIcon,
		isDragActive: isDragActiveIcon
	} = useDropzone({
		onDrop: onFaviconDrop,
		accept: { 'image/*': [] },
		maxFiles: 1
	});

	return (
		<Box>
			{/* Section Header with Edit Controls */}
			<Box className="mb-2 flex justify-end border p-2">
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						className="btn-primary"
						variant="contained"
						color="primary"
						size="large"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil-square</FuseSvgIcon>}
						onClick={handleOpenModal}
					>
						Editar
					</Button>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				{/* 1. SECTION: GENERAL & BRANDING */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
						gap: 6
					}}
				>
					{/* LEFT: DETAILS FORM */}
					<Box>
						<SectionHeader
							title="Información General"
							subtitle="Detalles básicos de la empresa"
						/>

						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
								gap: 3
							}}
						>
							<Box sx={{ gridColumn: '1 / -1' }}>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}
								>
									Nombre de la Empresa
								</Typography>
								<TextField
									{...register('name')}
									fullWidth
									size="small"
									variant="filled"
									InputProps={{ readOnly: true }}
								/>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}
								>
									CIF / NIF
								</Typography>
								<TextField
									{...register('cif')}
									placeholder="Ej: A12345678"
									fullWidth
									size="small"
									variant="filled"
									InputProps={{ readOnly: true }}
								/>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}
								>
									URL de la Empresa
								</Typography>
								<TextField
									{...register('website')}
									fullWidth
									size="small"
									variant="filled"
									InputProps={{ readOnly: true }}
								/>
							</Box>

							<Box>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}
								>
									Cantidad Máxima de Usuarios
								</Typography>
								<TextField
									value={activeCompany?.settings?.maxUsers || ''}
									fullWidth
									size="small"
									variant="filled"
									disabled
									InputProps={{ readOnly: true }}
								/>
							</Box>

							<Box>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}
								>
									Zona Horaria
								</Typography>
								<TextField
									value={activeCompany?.settings?.timezone || ''}
									fullWidth
									size="small"
									variant="filled"
									disabled
									InputProps={{ readOnly: true }}
								/>
							</Box>

							<Box sx={{ gridColumn: '1 / -1' }}>
								<Typography
									variant="caption"
									sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}
								>
									Color Corporativo
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: 1,
											bgcolor: watch('brandColor') || '#1976d2',
											border: '1px solid',
											borderColor: 'divider',
											boxShadow: 1
										}}
									/>
									<Box sx={{ flex: 1, maxWidth: 200 }}>
										<TextField
											{...register('brandColor')}
											type="color"
											fullWidth
											size="small"
											sx={{
												"& input[type='color']": {
													height: '48px',
													cursor: 'pointer',
													p: 0,
													border: 'none'
												},
												'& .MuiOutlinedInput-root': { p: 0.5 }
											}}
											variant="outlined"
										/>
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>

					{/* RIGHT: BRANDING ASSETS */}
					<Box>
						<SectionHeader
							title="Logo y Favicon"
							subtitle="Gestiona el logo y favicon de tu empresa"
						/>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
							{/* Logo Dropzone */}
							<Box
								{...getRootProps()}
								sx={{
									border: '2px dashed',
									borderColor: isDragActive ? 'primary.main' : 'divider',
									borderRadius: 2,
									p: 3,
									textAlign: 'center',
									cursor: 'pointer',
									bgcolor: isDragActive ? 'action.hover' : 'background.paper',
									transition: 'all 0.2s ease',
									minHeight: '140px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
									'&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
								}}
							>
								<input {...getInputProps()} />
								{currentLogo ? (
									<>
										<Box
											sx={{
												height: 80,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '100%'
											}}
										>
											<img
												src={currentLogo}
												alt="Logo"
												style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
											/>
										</Box>
										<IconButton
											onClick={async (e) => {
												e.stopPropagation();

												if (activeCompany) {
													setLogoPreview(null);
													setValue('logo', null);
													try {
														await updateCompany({
															id: activeCompany.id,
															data: { logo: null }
														});
													} catch (error) {
														console.error('Failed to delete logo', error);
													}
												}
											}}
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												bgcolor: 'background.paper',
												boxShadow: 1,
												'&:hover': { bgcolor: 'action.hover' }
											}}
											size="small"
										>
											<FuseSvgIcon size={16}>heroicons-outline:x-mark</FuseSvgIcon>
										</IconButton>
									</>
								) : (
									<>
										<FuseSvgIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }}>
											lucide:upload-cloud
										</FuseSvgIcon>
										<Typography
											variant="body2"
											fontWeight={600}
											color="text.primary"
										>
											Logo
										</Typography>
									</>
								)}
							</Box>

							{/* Favicon Dropzone */}
							<Box
								{...getRootPropsIcon()}
								sx={{
									border: '2px dashed',
									borderColor: isDragActiveIcon ? 'primary.main' : 'divider',
									borderRadius: 2,
									p: 2,
									textAlign: 'center',
									cursor: 'pointer',
									bgcolor: isDragActiveIcon ? 'action.hover' : 'background.paper',
									transition: 'all 0.2s ease',
									minHeight: '100px',
									display: 'flex',
									flexDirection: 'row', // Horizontal for icon to save space? Or stick to column. Column is fine.
									alignItems: 'center',
									justifyContent: 'center',
									gap: 2,
									position: 'relative',
									'&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
								}}
							>
								<input {...getInputPropsIcon()} />
								{currentFavicon ? (
									<>
										<Box
											sx={{
												height: 40,
												width: 40,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<img
												src={currentFavicon}
												alt="Favicon"
												style={{ width: '100%', height: '100%', objectFit: 'contain' }}
											/>
										</Box>
										<IconButton
											onClick={async (e) => {
												e.stopPropagation();

												if (activeCompany) {
													setFaviconPreview(null);
													setValue('favicon', null);
													try {
														await updateCompany({
															id: activeCompany.id,
															data: { favicon: null }
														});
													} catch (error) {
														console.error('Failed to delete favicon', error);
													}
												}
											}}
											sx={{
												position: 'absolute',
												top: 4,
												right: 4,
												bgcolor: 'background.paper',
												boxShadow: 1,
												padding: 0.5,
												'&:hover': { bgcolor: 'action.hover' }
											}}
											size="small"
										>
											<FuseSvgIcon size={14}>heroicons-outline:x-mark</FuseSvgIcon>
										</IconButton>
									</>
								) : (
									<>
										<FuseSvgIcon sx={{ fontSize: 24, color: 'text.secondary' }}>
											lucide:image
										</FuseSvgIcon>
										<Box textAlign="left">
											<Typography
												variant="body2"
												fontWeight={600}
												color="text.primary"
											>
												Favicon
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												32x32px
											</Typography>
										</Box>
									</>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Edit Company Modal */}
			<Dialog
				open={openModal}
				onClose={handleCloseModal}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Editar Información de la Empresa</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
						<TextField
							label="Nombre de la Empresa"
							name="name"
							value={modalData.name}
							onChange={handleModalChange}
							fullWidth
							variant="filled"
						/>
						<TextField
							label="CIF / NIF"
							name="cif"
							value={modalData.cif}
							onChange={handleModalChange}
							fullWidth
							variant="filled"
						/>
						<TextField
							label="Sitio Web"
							name="website"
							value={modalData.website}
							onChange={handleModalChange}
							fullWidth
							variant="filled"
						/>
						<Box>
							<Typography
								variant="caption"
								sx={{ mb: 1, display: 'block' }}
							>
								Color Corporativo
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: 1,
										bgcolor: modalData.brandColor,
										border: '1px solid',
										borderColor: 'divider'
									}}
								/>
								<TextField
									name="brandColor"
									type="color"
									value={modalData.brandColor}
									onChange={handleModalChange}
									fullWidth
									variant="filled"
									sx={{
										"& input[type='color']": {
											height: '40px',
											cursor: 'pointer',
											p: 0,
											border: 'none'
										}
									}}
								/>
							</Box>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseModal}
						color="secondary"
					>
						Cancelar
					</Button>
					<Button
						onClick={handleModalSave}
						variant="contained"
						color="primary"
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
