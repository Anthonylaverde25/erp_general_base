import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ContentCopy, MoreVert, Refresh } from '@mui/icons-material';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';

interface ItemProfileHeaderProps {
	item: ItemEntity;
	tabValue: number;
	onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function ItemProfileHeader({ item, tabValue, onTabChange }: ItemProfileHeaderProps) {
	return (
		<Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
			<Box
				sx={{
					px: { xs: 2, md: 3 },
					pt: { xs: 2, md: 2 },
					pb: { xs: 2, md: 2 },
					background: 'linear-gradient(180deg, rgba(29,78,216,.08), transparent)'
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

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							alignSelf: { xs: 'flex-start', sm: 'center' }
						}}
					>
						<Button
							size="small"
							variant="outlined"
							color="inherit"
							sx={{ textTransform: 'none', fontWeight: 600 }}
							startIcon={<Refresh sx={{ fontSize: 16 }} />}
						>
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
				className="flex items-center gap-2 px-3 pb-3"
				sx={{ flexWrap: 'wrap' }}
			>
				{['Resumen', 'Movimientos', 'Actividad'].map((label, index) => {
					const isActive = tabValue === index;
					return (
						<Button
							key={label}
							onClick={(e) => onTabChange(e, index)}
							size="small"
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
		</Box>
	);
}
