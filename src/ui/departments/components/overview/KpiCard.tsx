import { Avatar, Box, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { ReactNode } from 'react';

interface KpiCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: ReactNode;
}

export default function KpiCard({ title, value, subtitle, icon }: KpiCardProps) {
	return (
		<Paper
			variant="outlined"
			sx={{ p: 3, borderColor: 'divider', bgcolor: 'whitesmoke' }}
		>
			<Typography
				variant="overline"
				sx={{
					fontSize: '0.65rem',
					letterSpacing: '0.08em',
					color: 'text.secondary',
					fontWeight: 700
				}}
			>
				{title}
			</Typography>
			<Box className="flex items-center gap-3">
				<Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}>{icon}</Avatar>
				<Box>
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontSize: '0.85rem' }}
					>
						{value}
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{subtitle}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}
