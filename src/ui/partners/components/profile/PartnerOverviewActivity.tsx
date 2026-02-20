import { Button, Paper, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SectionTitle } from './PartnerProfileShared';

export default function PartnerOverviewActivity() {
	return (
		<Paper
			variant="outlined"
			sx={{
				p: 3,
				mb: 3,
				borderColor: 'divider'
			}}
		>
			<SectionTitle
				action={
					<Button
						size="small"
						startIcon={<Add sx={{ fontSize: 16 }} />}
						sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
					>
						Nueva actividad
					</Button>
				}
			>
				Próximas actividades
			</SectionTitle>
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
