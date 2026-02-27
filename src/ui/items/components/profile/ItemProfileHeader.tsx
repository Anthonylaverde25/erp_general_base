import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Button } from '@mui/material';
import { ContentCopy, Inventory2, MoreVert, Refresh } from '@mui/icons-material';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import StockMovementModal from './StockMovementModal';

interface ItemProfileHeaderProps {
	item: ItemEntity;
	tabValue: number;
	onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function ItemProfileHeader({ item, tabValue, onTabChange }: ItemProfileHeaderProps) {
	const [stockModalOpen, setStockModalOpen] = useState(false);

	const getInitials = (text: string) => {
		const parts = text.trim().split(' ');

		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
		}

		return text.substring(0, 2).toUpperCase();
	};

	const stringToColor = (str: string) => {
		let hash = 0;
		for (let i = 0; i < str.length; i += 1) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = hash % 360;
		return `hsl(${hue}, 65%, 50%)`;
	};

	return (
		<Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
			<Box
				sx={{
					p: 0,
					pb: 2
				}}
			>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<PageBreadcrumb />
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						width: '100%',
						justifyContent: 'space-between',
						gap: 2,
						mt: 2
					}}
				>
					<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
						{/* <Avatar
							src={item.image}
							variant="rounded"
							sx={{
								width: 56,
								height: 56,
								bgcolor: stringToColor(item.name || 'item'),
								fontWeight: 700,
								fontSize: '1rem',
								flexShrink: 0
							}}
						>
							{getInitials(item.name || 'Item')}
						</Avatar> */}
						<Box>
							<Typography
								variant="h5"
								fontWeight={700}
								sx={{ lineHeight: 1.1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
							>
								{item.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								SKU: {item.sku} · Unidad: {item.unit_name || 'N/A'}
							</Typography>
						</Box>
					</Box>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							alignSelf: { xs: 'flex-start', sm: 'center' }
						}}
					>
						{item.type === 'physical' && (
							<Button
								variant="outlined"
								color="inherit"
								size="small"
								disableElevation
								sx={{
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '0.75rem',
									color: 'text.secondary',
									py: 0.5,
									px: 1.5,
									borderRadius: 0.5,
									borderColor: 'divider',
									bgcolor: 'transparent',
									gap: 1,
									'&:hover': {
										bgcolor: 'action.hover',
										color: 'text.primary',
										borderColor: 'divider'
									}
								}}
								onClick={() => setStockModalOpen(true)}
							>
								<Inventory2 sx={{ fontSize: 18 }} />
								Agregar Stock
							</Button>
						)}
						<Button
							variant="outlined"
							color="inherit"
							size="small"
							disableElevation
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								fontSize: '0.75rem',
								color: 'text.secondary',
								py: 0.5,
								px: 1.5,
								borderRadius: 0.5,
								borderColor: 'divider',
								bgcolor: 'transparent',
								gap: 1,
								'&:hover': {
									bgcolor: 'action.hover',
									color: 'text.primary',
									borderColor: 'divider'
								}
							}}
						>
							<Refresh sx={{ fontSize: 18 }} />
							Actualizar
						</Button>
						<Tooltip title="Copiar SKU">
							<IconButton size="small">
								<ContentCopy fontSize="small" />
							</IconButton>
						</Tooltip>
						<IconButton size="small">
							<MoreVert fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</Box>

			<Box className="flex flex-wrap items-center gap-2 px-3 pb-3">
				{['Resumen', 'Movimientos', 'Actividad'].map((label, index) => {
					const isActive = tabValue === index;
					return (
						<Button
							key={label}
							onClick={(e) => onTabChange(e, index)}
							size="small"
							disableElevation
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								fontSize: '0.75rem',
								color: isActive ? '#ffffff' : 'text.secondary',
								py: 0.5,
								px: 1.5,
								borderRadius: 0.5,
								border: '1px solid',
								borderColor: isActive ? '#1b1b1b' : 'divider',
								bgcolor: isActive ? '#1b1b1b' : 'transparent',
								'&:hover': {
									bgcolor: isActive ? '#333333' : 'action.hover',
									color: isActive ? '#ffffff' : 'text.primary',
									borderColor: isActive ? '#1b1b1b' : 'divider'
								}
							}}
						>
							{label}
						</Button>
					);
				})}
			</Box>

			{item.type === 'physical' && (
				<StockMovementModal
					open={stockModalOpen}
					onClose={() => setStockModalOpen(false)}
					itemId={item.id}
					itemName={item.name}
					totalStock={item.total_stock}
				/>
			)}
		</Box>
	);
}
