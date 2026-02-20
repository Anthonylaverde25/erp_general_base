import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import { TrendingUp, NoteAdd } from '@mui/icons-material';
import { SectionTitle } from './PartnerProfileShared';

export default function PartnerOverviewCards() {
	return (
		<Box className="grid grid-cols-1 gap-3 md:grid-cols-2">
			<Paper
				variant="outlined"
				sx={{
					p: 3,
					borderColor: 'divider'
				}}
			>
				<SectionTitle>Oportunidades abiertas</SectionTitle>
				<Box className="flex items-center gap-3">
					<Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}>
						<TrendingUp sx={{ fontSize: 18 }} />
					</Avatar>
					<Box>
						<Typography
							variant="body2"
							fontWeight={600}
							sx={{ fontSize: '0.85rem' }}
						>
							Embudo de ventas
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Maximiza tus oportunidades de venta a través de un CRM personalizado
						</Typography>
					</Box>
				</Box>
			</Paper>

			<Paper
				variant="outlined"
				sx={{
					p: 3,
					borderColor: 'divider'
				}}
			>
				<SectionTitle>Notas</SectionTitle>
				<Button
					size="small"
					startIcon={<NoteAdd sx={{ fontSize: 16 }} />}
					sx={{
						textTransform: 'none',
						fontWeight: 600,
						fontSize: '0.8rem',
						color: 'primary.main',
						p: 0,
						minWidth: 0
					}}
				>
					Nueva nota
				</Button>
			</Paper>
		</Box>
	);
}
