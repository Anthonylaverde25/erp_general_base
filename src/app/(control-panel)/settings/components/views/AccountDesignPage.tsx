'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useDropzone } from 'react-dropzone';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const users = [
	{
		username: 'adm_wilson_j',
		role: 'System Administrator',
		last: 'hace 2 min',
		active: true
	},
	{
		username: 'dev_santos_m',
		role: 'Data Architect',
		last: 'hace 1 hora',
		active: true
	},
	{
		username: 'sec_chen_l',
		role: 'Security Auditor',
		last: 'Oct 24, 2023',
		active: false
	}
];

export default function AccountDesignPage() {
	const [tab, setTab] = React.useState(0);
	const [mfa, setMfa] = React.useState(true);
	const [sso, setSso] = React.useState(true);
	const [audit, setAudit] = React.useState(false);

	// Company profile state
	const [companyName, setCompanyName] = React.useState<string>('ACME Corporation');
	const [companyUrl, setCompanyUrl] = React.useState<string>('https://acme.example');
	const [logoFile, setLogoFile] = React.useState<File | null>(null);
	const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
	const [faviconFile, setFaviconFile] = React.useState<File | null>(null);
	const [faviconPreview, setFaviconPreview] = React.useState<string | null>(null);
	const [designType, setDesignType] = React.useState<string>('standard');

	React.useEffect(() => {
		if (!logoFile) {
			setLogoPreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(logoFile);
		setLogoPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [logoFile]);

	React.useEffect(() => {
		if (!faviconFile) {
			setFaviconPreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(faviconFile);
		setFaviconPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [faviconFile]);

	const onDrop = React.useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles && acceptedFiles[0];

		if (file) setLogoFile(file);
	}, []);

	const onFaviconDrop = React.useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles && acceptedFiles[0];

		if (file) setFaviconFile(file);
	}, []);

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

	const handleUpdateCompany = () => {
		// TODO: conectar con API para guardar companyName, companyUrl y logoFile
		console.log('update company', { companyName, companyUrl, logoFile });
	};

	return (
		<Box
			className="bg-amber-700"
			sx={{ width: '100%' }}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 2,
					mb: 3,
					pb: 2.5,
					borderBottom: 1,
					borderColor: 'divider'
				}}
			>
				<Tabs
					value={tab}
					onChange={(_, v) => setTab(v)}
					variant="scrollable"
					scrollButtons="auto"
					className="bg-white"
				>
					<Tab
						icon={<FuseSvgIcon>lucide:domain</FuseSvgIcon>}
						label="Perfil de Empresa"
					/>
					<Tab
						icon={<FuseSvgIcon>heroicons:arrows-pointing-in</FuseSvgIcon>}
						label="Dirección de Facturación"
					/>
					<Tab
						icon={<FuseSvgIcon>lucide:tune</FuseSvgIcon>}
						label="Preferencias"
					/>
					<Tab
						icon={<FuseSvgIcon>lucide:alert-triangle</FuseSvgIcon>}
						label="Danger"
					/>
				</Tabs>

				<Button
					className="btn-primary"
					variant="contained"
					color="primary"
					size="large"
					startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
				>
					Guardar Configuración
				</Button>
			</Box>

			<Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Main content per tab */}
					{tab === 0 && (
						<Box sx={{ display: 'flex', gap: 3 }}>
							{/* Left: Form */}
							<Box
								sx={{
									flex: 1,
									display: 'flex',
									flexDirection: 'column',
									gap: 2
								}}
							>
								<Box>
									<Typography
										variant="caption"
										sx={{ fontWeight: 700, color: 'text.secondary' }}
									>
										Nombre de la Empresa
									</Typography>
									<TextField
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										fullWidth
										size="small"
										sx={{ mt: 1 }}
									/>
								</Box>

								<Box>
									<Typography
										variant="caption"
										sx={{ fontWeight: 700, color: 'text.secondary' }}
									>
										URL de la Empresa
									</Typography>
									<TextField
										value={companyUrl}
										onChange={(e) => setCompanyUrl(e.target.value)}
										fullWidth
										size="small"
										sx={{ mt: 1 }}
									/>
								</Box>

								<Box>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 700,
											color: 'text.primary',
											mb: 1.5,
											display: 'block',
											fontSize: '0.95rem'
										}}
									>
										Plantilla de Factura
									</Typography>
									<Typography
										variant="caption"
										sx={{
											display: 'block',
											color: 'text.secondary',
											mb: 2,
											fontSize: '0.85rem'
										}}
									>
										Selecciona el diseño para tus documentos de facturación
									</Typography>
									<Box
										sx={{
											display: 'grid',
											gridTemplateColumns: 'repeat(3, 1fr)',
											gap: 2
										}}
									>
										{[
											{
												id: 'standard',
												label: 'Estándar',
												description: 'Diseño clásico y profesional',
												icon: 'lucide:file-text'
											},
											{
												id: 'minimal',
												label: 'Minimalista',
												description: 'Limpio y moderno',
												icon: 'lucide:layout-template'
											},
											{
												id: 'large',
												label: 'Logo Grande',
												description: 'Con logo destacado',
												icon: 'lucide:image'
											}
										].map((design) => (
											<Box
												key={design.id}
												onClick={() => setDesignType(design.id)}
												sx={{
													p: 2.5,
													border: '2px solid',
													borderColor: designType === design.id ? 'primary.main' : 'divider',
													bgcolor: 'background.paper',
													cursor: 'pointer',
													transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
													fontWeight: designType === design.id ? 700 : 500,
													textAlign: 'center',
													borderRadius: 1.5,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													gap: 1.2,
													'&:hover': {
														borderColor: 'primary.main',
														boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
														transform: 'translateY(-2px)'
													}
												}}
											>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														width: 56,
														height: 56,
														borderRadius: 1.25,
														bgcolor: 'action.selected'
													}}
												>
													<FuseSvgIcon
														sx={{
															fontSize: 32,
															color: 'primary.main'
														}}
													>
														{design.icon}
													</FuseSvgIcon>
												</Box>
												<Box>
													<Typography
														variant="body2"
														sx={{
															fontWeight: designType === design.id ? 700 : 600,
															color: 'text.primary'
														}}
													>
														{design.label}
													</Typography>
													<Typography
														variant="caption"
														sx={{
															display: 'block',
															color: 'text.secondary',
															mt: 0.5,
															fontSize: '0.75rem'
														}}
													>
														{design.description}
													</Typography>
												</Box>
											</Box>
										))}
									</Box>
								</Box>
							</Box>

							{/* Right: Dropzones */}
							<Box
								sx={{
									flex: 1,
									display: 'flex',
									flexDirection: 'row',
									gap: 2
								}}
							>
								{/* Logo Dropzone */}
								<Box
									{...getRootProps()}
									sx={{
										flex: 1
									}}
								>
									<input {...getInputProps()} />
									<Box
										sx={{
											border: '2px dashed #1976d2',
											borderRadius: 1,
											p: 2,
											textAlign: 'center',
											cursor: 'pointer',
											bgcolor: isDragActive ? '#f5f5f5' : 'white',
											transition: 'all 0.3s ease',
											minHeight: '140px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											'&:hover': {
												bgcolor: 'primary.50',
												borderColor: 'primary.dark'
											}
										}}
									>
										{logoPreview ? (
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													gap: 1
												}}
											>
												<img
													src={logoPreview}
													alt="Logo"
													style={{
														maxWidth: '90%',
														maxHeight: '80px',
														objectFit: 'contain'
													}}
												/>
												<Button
													size="small"
													color="error"
													onClick={(e) => {
														e.stopPropagation();
														setLogoFile(null);
														setLogoPreview(null);
													}}
												>
													Eliminar
												</Button>
											</Box>
										) : (
											<>
												<FuseSvgIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}>
													lucide:upload-cloud
												</FuseSvgIcon>
												<Typography
													variant="body2"
													sx={{ fontWeight: 600, color: 'text.primary' }}
												>
													Logo Principal
												</Typography>
												<Typography
													variant="caption"
													sx={{ color: 'text.secondary' }}
												>
													Arrastra o haz clic
												</Typography>
											</>
										)}
									</Box>
								</Box>

								{/* Favicon Dropzone */}
								<Box
									{...getRootPropsIcon()}
									sx={{
										flex: 1
									}}
								>
									<input {...getInputPropsIcon()} />
									<Box
										sx={{
											border: '2px dashed #1976d2',
											borderRadius: 1,
											p: 2,
											textAlign: 'center',
											cursor: 'pointer',
											bgcolor: isDragActiveIcon ? '#f5f5f5' : 'white',
											transition: 'all 0.3s ease',
											minHeight: '140px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											'&:hover': {
												bgcolor: 'primary.50',
												borderColor: 'primary.dark'
											}
										}}
									>
										{faviconPreview ? (
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													gap: 1
												}}
											>
												<img
													src={faviconPreview}
													alt="Favicon"
													style={{
														width: '60px',
														height: '60px',
														objectFit: 'contain'
													}}
												/>
												<Button
													size="small"
													color="error"
													onClick={(e) => {
														e.stopPropagation();
														setFaviconFile(null);
														setFaviconPreview(null);
													}}
												>
													Eliminar
												</Button>
											</Box>
										) : (
											<>
												<FuseSvgIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}>
													lucide:favicon
												</FuseSvgIcon>
												<Typography
													variant="body2"
													sx={{ fontWeight: 600, color: 'text.primary' }}
												>
													Favicon
												</Typography>
												<Typography
													variant="caption"
													sx={{ color: 'text.secondary' }}
												>
													Arrastra o haz clic
												</Typography>
											</>
										)}
									</Box>
								</Box>
							</Box>
						</Box>
					)}

					{tab === 1 && (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<input
								placeholder="Calle y número"
								style={{ padding: 10, border: '1px solid #e0e0e0' }}
							/>
							<input
								placeholder="Ciudad"
								style={{ padding: 10, border: '1px solid #e0e0e0' }}
							/>
							<input
								placeholder="Provincia / Estado"
								style={{ padding: 10, border: '1px solid #e0e0e0' }}
							/>
							<input
								placeholder="Código Postal"
								style={{ padding: 10, border: '1px solid #e0e0e0' }}
							/>
							<input
								placeholder="País"
								style={{ padding: 10, border: '1px solid #e0e0e0' }}
							/>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									justifyContent: 'flex-end',
									mt: 1
								}}
							>
								<Button
									className="btn-secondary"
									variant="outlined"
								>
									Cancelar
								</Button>
								<Button
									className="btn-primary"
									variant="contained"
									color="primary"
								>
									Guardar Dirección
								</Button>
							</Box>
						</Box>
					)}

					{tab === 2 && (
						<Box sx={{ display: 'grid', gap: 2 }}>
							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Idioma
								</Typography>
								<select
									style={{
										width: '100%',
										padding: 10,
										border: '1px solid #e0e0e0'
									}}
								>
									<option>Español</option>
									<option>Inglés</option>
								</select>
							</Box>
							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Formato de número
								</Typography>
								<select
									style={{
										width: '100%',
										padding: 10,
										border: '1px solid #e0e0e0'
									}}
								>
									<option>1,234.56</option>
									<option>1.234,56</option>
								</select>
							</Box>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									justifyContent: 'flex-end',
									mt: 1
								}}
							>
								<Button
									className="btn-secondary"
									variant="outlined"
								>
									Cancelar
								</Button>
								<Button
									className="btn-primary"
									variant="contained"
									color="primary"
								>
									Guardar Preferencias
								</Button>
							</Box>
						</Box>
					)}

					{tab === 3 && (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Typography sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>Danger</Typography>
							<Typography color="text.secondary">
								Acciones destructivas relacionadas con la cuenta de la empresa.
							</Typography>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									justifyContent: 'flex-end',
									mt: 2
								}}
							>
								<Button
									className="btn-secondary"
									variant="outlined"
								>
									Cancelar
								</Button>
								<Button
									className="btn-primary"
									variant="contained"
									color="error"
								>
									Eliminar Empresa
								</Button>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
}
