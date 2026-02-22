import { useState } from 'react';
import { Avatar, Box, Chip, IconButton, Stack, Tooltip, Typography, Button } from '@mui/material';
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
					px: { xs: 2, md: 3 },
					pt: { xs: 2, md: 2 },
					pb: { xs: 2, md: 2 }
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
						<Avatar
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
						</Avatar>
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
							<Stack
								direction="row"
								spacing={1}
								mt={1}
								flexWrap="wrap"
								useFlexGap
							>
								<Chip
									label={item.type === 'physical' ? 'Producto Físico' : 'Servicio'}
									size="small"
									sx={{ bgcolor: 'rgba(29,78,216,.12)', color: '#1d4ed8', fontWeight: 600 }}
								/>
								<Chip
									label={item.is_active ? 'Activo' : 'Inactivo'}
									size="small"
									variant="outlined"
									sx={{ color: item.is_active ? '#15803d' : '#b91c1c' }}
								/>
							</Stack>
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
								variant="contained"
								color="primary"
								size="small"
								disableElevation
								sx={{ textTransform: 'none', fontWeight: 600, gap: 1 }}
								onClick={() => setStockModalOpen(true)}
							>
								<Inventory2 sx={{ fontSize: 18 }} />
								Agregar Stock
							</Button>
						)}
						<Button
							variant="contained"
							color="secondary"
							size="small"
							disableElevation
							sx={{ textTransform: 'none', fontWeight: 600, gap: 1 }}
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

			<Box
				className="flex flex-wrap items-center gap-2 px-3 pb-3"
			>
				{['Resumen', 'Movimientos', 'Actividad'].map((label, index) => {
					const isActive = tabValue === index;
					return (
						<Button
							key={label}
							onClick={(e) => onTabChange(e, index)}
							variant={isActive ? "contained" : "text"}
							size="small"
							disableElevation
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								bgcolor: isActive ? 'text.primary' : 'transparent',
								color: isActive ? 'background.paper' : 'text.secondary',
								'&:hover': {
									bgcolor: isActive ? 'text.primary' : 'action.hover',
								},
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
