import { Box, Typography, LinearProgress } from '@mui/material';
import DragHandle from '../DragHandle';

type KpiCardProps = {
	title: string;
	value: string;
	isEditing: boolean;
	subtitle?: string;
	progressPercent?: number;
	targetValue?: string;
	targetColor?: string;
};

/**
 * Reusable KPI metric card content.
 * Renders title, value, optional progress bar and target.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function KpiCard({
	title,
	value,
	isEditing,
	subtitle = 'Año actual',
	progressPercent,
	targetValue,
	targetColor = 'success.main',
}: KpiCardProps) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
				<Typography variant="subtitle1" fontWeight={600}>
					{title}
				</Typography>
				{isEditing && <DragHandle />}
			</Box>

			<Typography variant="body2" color="text.secondary" gutterBottom>
				{subtitle}
			</Typography>

			<Typography variant="h4" fontWeight={700} sx={{ mt: 'auto', textAlign: 'right' }}>
				{value}
			</Typography>

			{progressPercent !== undefined && targetValue && (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 0.5 }}>
						<Typography variant="caption" color="text.secondary">
							{progressPercent}% del objetivo
						</Typography>
						<Typography variant="caption" color={targetColor} fontWeight={600}>
							{targetValue}
						</Typography>
					</Box>
					<LinearProgress
						variant="determinate"
						value={progressPercent}
						sx={{ height: 4, borderRadius: 2, bgcolor: 'divider' }}
					/>
				</>
			)}
		</Box>
	);
}

export default KpiCard;
