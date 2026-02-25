import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
	icon: ReactNode;
	title: string;
	description: string;
	action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 px-4 py-10 text-center">
			<div className="mb-4 flex items-center justify-center text-slate-400">{icon}</div>
			<Typography
				variant="h6"
				fontWeight={600}
				sx={{ mb: 1, fontSize: '0.95rem', color: 'text.primary' }}
			>
				{title}
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 3, maxWidth: 'sm' }}
				className="text-balance"
			>
				{description}
			</Typography>
			{action && <div>{action}</div>}
		</div>
	);
}
