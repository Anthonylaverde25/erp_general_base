import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, IconButton, Tooltip, Button } from '@mui/material';
import { ContentCopy, Inventory2, MoreVert, Refresh } from '@mui/icons-material';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import StockMovementModal from './StockMovementModal';
import PageHeader from '@/components/PageHeader';

interface ItemProfileHeaderProps {
	item: ItemEntity;
	tabValue: number;
	onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function ItemProfileHeader({ item, tabValue, onTabChange }: ItemProfileHeaderProps) {
	const [stockModalOpen, setStockModalOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<PageHeader
				title={item.name}
				subtitle={`SKU: ${item.sku} · Unidad: ${item.unit_name || 'N/A'}`}
				onBack={() => navigate('/items')}
				actions={
					<>
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
									borderRadius: '4px',
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
								borderRadius: '4px',
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
					</>
				}
			/>

			<Box className="flex flex-wrap items-center gap-2 px-8 pb-4">
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
								borderRadius: '4px',
								border: '1px solid',
								borderColor: isActive ? '#005483' : 'divider',
								bgcolor: isActive ? '#005483' : 'transparent',
								'&:hover': {
									bgcolor: isActive ? '#004369' : 'action.hover',
									color: isActive ? '#ffffff' : 'text.primary',
									borderColor: isActive ? '#005483' : 'divider'
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
