import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<Box sx={{ mb: 3 }}>
			<Typography
				variant="subtitle1"
				sx={{
					fontWeight: 600,
					color: 'text.primary',
					fontSize: '0.95rem',
					letterSpacing: '0.01em'
				}}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography
					variant="caption"
					sx={{
						color: 'text.secondary',
						display: 'block',
						mt: 0.5,
						fontSize: '0.8rem'
					}}
				>
					{subtitle}
				</Typography>
			)}
		</Box>
	);
}
