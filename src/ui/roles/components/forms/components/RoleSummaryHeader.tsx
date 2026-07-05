import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

interface RoleSummaryHeaderProps {
	name: string;
	code: string;
	active?: boolean;
	description: string;
}

export default function RoleSummaryHeader({
	name,
	code,
	description
}: RoleSummaryHeaderProps) {
	return (
		<Box sx={{ mb: 4, px: 0.5 }}>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Typography 
						variant="caption" 
						color="text.secondary" 
						fontWeight={700} 
						sx={{ display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}
					>
						Nombre del Rol
					</Typography>
					<Typography variant="body2" fontWeight={750} color="text.primary">
						{name || '—'}
					</Typography>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Typography 
						variant="caption" 
						color="text.secondary" 
						fontWeight={700} 
						sx={{ display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}
					>
						Código
					</Typography>
					<Typography variant="body2" fontFamily="monospace" fontWeight={750} color="text.primary">
						{code || '—'}
					</Typography>
				</Grid>
				{description && (
					<Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
						<Typography 
							variant="caption" 
							color="text.secondary" 
							fontWeight={700} 
							sx={{ display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}
						>
							Descripción
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', lineHeight: 1.35 }}>
							{description}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Box>
	);
}
