import { NoteAdd } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';

export default function ItemOverviewActivity() {
	return (
		<Paper
			variant="outlined"
			sx={{ p: 3, mb: 3, borderColor: 'divider' }}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
				<Typography
					variant="overline"
					sx={{
						fontSize: '0.65rem',
						letterSpacing: '0.08em',
						color: 'text.secondary',
						fontWeight: 700
					}}
				>
					Actividad
				</Typography>
				<Button
					size="small"
					startIcon={<NoteAdd sx={{ fontSize: 16 }} />}
					sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
				>
					Nueva actividad
				</Button>
			</Box>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ fontSize: '0.85rem' }}
			>
				No hay actividades programadas
			</Typography>
		</Paper>
	);
}
