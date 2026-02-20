import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { Edit, History, NotificationsActive, Add } from '@mui/icons-material';

interface ItemProfileSidebarProps {
	item: ItemEntity;
}

function Metric({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
			<Typography sx={{ fontSize: 11, fontWeight: 600, color: '#666' }}>{label}</Typography>
			<Typography sx={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: valueColor || '#1b1b1b' }}>
				{value}
			</Typography>
		</Box>
	);
}

export default function ItemProfileSidebar({ item }: ItemProfileSidebarProps) {
	const purchasePrice = item.purchase_price ?? 0;
	const salePrice = item.sale_price ?? 0;
	const margin = purchasePrice > 0 ? ((salePrice - purchasePrice) / purchasePrice) * 100 : 0;

	const actionBtnSx = {
		flex: '1 1 auto',
		textTransform: 'none',
		justifyContent: 'center',
		fontWeight: 600,
		fontSize: '0.8rem',
		color: 'text.primary',
		borderRadius: 0.5,
		py: 0.5,
		borderColor: 'divider',
		'&:hover': { bgcolor: 'action.hover', borderColor: 'divider' }
	} as const;

	return (
		<Box
			sx={{
				width: { xs: '100%', md: 360 },
				flexShrink: 0,
				borderRight: { xs: 0, md: 1 },
				borderBottom: { xs: 1, md: 0 },
				borderColor: '#E6EAF0 !important',
				p: 3,
				overflowY: { xs: 'visible', md: 'auto' },
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Box className="mb-2 flex flex-wrap gap-2">
				<Button
					size="small"
					variant="outlined"
					color="inherit"
					startIcon={<Edit sx={{ fontSize: 16 }} />}
					sx={actionBtnSx}
				>
					Editar
				</Button>
				<Button
					size="small"
					variant="outlined"
					color="inherit"
					startIcon={<History sx={{ fontSize: 16 }} />}
					sx={actionBtnSx}
				>
					Historial
				</Button>
				<Button
					size="small"
					variant="outlined"
					color="inherit"
					startIcon={<NotificationsActive sx={{ fontSize: 16 }} />}
					sx={actionBtnSx}
				>
					Alarma
				</Button>
				<Button
					size="small"
					variant="outlined"
					color="inherit"
					startIcon={<Add sx={{ fontSize: 16 }} />}
					sx={actionBtnSx}
				>
					Nota
				</Button>
			</Box>

			<Divider sx={{ my: 2, borderColor: 'divider' }} />

			<Typography
				variant="overline"
				sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'text.secondary', fontWeight: 700 }}
			>
				Resumen de precio
			</Typography>

			<Paper
				elevation={0}
				sx={{
					height: 62,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					px: 2,
					borderRadius: '8px',
					bgcolor: 'whitesmoke',
					mb: 1.5
				}}
			>
				<Metric
					label="Compra"
					value={`$${Math.round(purchasePrice).toLocaleString('en-US')}`}
				/>
				<Divider
					orientation="vertical"
					flexItem
				/>
				<Metric
					label="Venta"
					value={`$${Math.round(salePrice).toLocaleString('en-US')}`}
					valueColor="#1D4ED8"
				/>
				<Divider
					orientation="vertical"
					flexItem
				/>
				<Metric
					label="Margen"
					value={`${margin.toFixed(1)}%`}
					valueColor="#004D1A"
				/>
			</Paper>

			<Paper
				elevation={0}
				variant="outlined"
				sx={{ borderRadius: '14px', p: 2, mb: 1.5, borderColor: 'divider' }}
			>
				<Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Precio actual</Typography>
				<Typography sx={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 700, color: '#1D4ED8' }}>
					${salePrice.toFixed(2)}
				</Typography>
				<Typography sx={{ fontSize: 13, color: '#666', mb: 1.25 }}>
					Margen estimado: {margin.toFixed(1)}%
				</Typography>
				<Button
					fullWidth
					variant="contained"
					color="inherit"
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					Ajustar inventario
					<FuseSvgIcon
						sx={{ ml: 1 }}
						size={16}
					>
						heroicons-outline:cube
					</FuseSvgIcon>
				</Button>
			</Paper>

			<Box sx={{ flex: 1 }} />
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Button
					fullWidth
					variant="contained"
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					Ver ficha tecnica
					<FuseSvgIcon
						sx={{ ml: 1 }}
						size={16}
					>
						heroicons-outline:document-text
					</FuseSvgIcon>
				</Button>
				<Button
					fullWidth
					variant="outlined"
					color="inherit"
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					Agregar nota
					<FuseSvgIcon
						sx={{ ml: 1 }}
						size={16}
					>
						heroicons-outline:pencil-square
					</FuseSvgIcon>
				</Button>
			</Box>
		</Box>
	);
}
