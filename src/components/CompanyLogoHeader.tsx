import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { Palette, Check } from 'lucide-react';
import useActiveCompany from '@/features/companies/useActiveCompany';

export default function CompanyLogoHeader() {
	const activeCompany = useActiveCompany();
	const [logoBgColor, setLogoBgColor] = useState('#ffffff');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const storageKey = activeCompany ? `company_logo_bg_color_${activeCompany.id}` : 'company_logo_bg_color_global';

	// Load stored background color
	useEffect(() => {
		const storedColor = localStorage.getItem(storageKey);
		if (storedColor) {
			setLogoBgColor(storedColor);
		} else {
			setLogoBgColor('#ffffff');
		}
	}, [storageKey]);

	if (!activeCompany?.logo_url) {
		return null;
	}

	const handleOpenModal = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSelectColor = (color: string) => {
		setLogoBgColor(color);
		localStorage.setItem(storageKey, color);
	};

	const presets = [
		{ name: 'Blanco', value: '#ffffff' },
		{ name: 'Gris Claro', value: '#f8fafc' },
		{ name: 'Gris Suave', value: '#e2e8f0' },
		{ name: 'Azul ERP', value: '#eff6ff' },
		{ name: 'Transparente', value: 'transparent' },
		{ name: 'Azul Oscuro', value: '#303952' },
		{ name: 'Carbón', value: '#0f172a' },
	];

	return (
		<>
			<div
				className="group relative flex items-center justify-center shrink-0 mx-2 px-4 py-1.5 min-w-[90px] rounded-[4px] shadow-sm transition-all duration-200"
				style={{ backgroundColor: logoBgColor }}
			>
				<img
					src={activeCompany.logo_url}
					alt={activeCompany.name || 'Company Logo'}
					className="h-7 w-auto object-contain"
				/>

				<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[4px]">
					<Tooltip title="Ajustar color de fondo" placement="top">
						<IconButton
							size="small"
							onClick={handleOpenModal}
							sx={{
								color: 'white',
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.4)',
								}
							}}
						>
							<Palette size={14} />
						</IconButton>
					</Tooltip>
				</div>
			</div>

			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				maxWidth="xs"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: '4px', // Sharp Edges design DNA
					}
				}}
			>
				<DialogTitle>
					<Typography variant="h6" className="font-bold">
						Color de Fondo del Logo
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Ajusta el color de fondo para mejorar el contraste de la marca
					</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<div className="flex flex-col gap-4 py-2">
						<div className="grid grid-cols-4 gap-2">
							{presets.map((preset) => {
								const isSelected = logoBgColor === preset.value;
								return (
									<Tooltip title={preset.name} key={preset.value}>
										<button
											type="button"
											onClick={() => handleSelectColor(preset.value)}
											className="relative h-10 w-full rounded-[4px] border border-solid border-divider transition-transform hover:scale-105 flex items-center justify-center"
											style={{
												backgroundColor: preset.value === 'transparent' ? '#ffffff' : preset.value,
												backgroundImage: preset.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
												backgroundSize: preset.value === 'transparent' ? '8px 8px' : 'auto',
												backgroundPosition: preset.value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
											}}
										>
											{preset.value === 'transparent' && (
												<div className="absolute inset-0 flex items-center justify-center bg-white/70">
													<Typography variant="caption" className="text-[10px] font-bold text-slate-700">T</Typography>
												</div>
											)}
											{isSelected && (
												<div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-[4px]">
													<Check size={16} className={preset.value === '#ffffff' || preset.value === '#f8fafc' || preset.value === 'transparent' ? 'text-black' : 'text-white'} />
												</div>
											)}
										</button>
									</Tooltip>
								);
							})}
						</div>

						<div className="flex items-center gap-3 mt-2 pt-2 border-t border-solid border-divider">
							<Typography variant="body2" className="font-medium shrink-0">
								Color personalizado:
							</Typography>
							<input
								type="color"
								value={logoBgColor.startsWith('#') && logoBgColor.length === 7 ? logoBgColor : '#ffffff'}
								onChange={(e) => handleSelectColor(e.target.value)}
								className="h-8 w-16 cursor-pointer border-none p-0 rounded-[4px]"
							/>
							<Typography variant="caption" color="text.secondary" className="font-mono">
								{logoBgColor}
							</Typography>
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal} variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#005483', '&:hover': { backgroundColor: '#004064' } }}>
						Listo
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
