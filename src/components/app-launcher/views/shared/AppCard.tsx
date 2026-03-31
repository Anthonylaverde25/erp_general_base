import { Box, Typography } from '@mui/material';
import { LauncherApp } from '../../types';

interface AppCardProps {
	app: LauncherApp;
	onClick: (action: () => void | Promise<void>) => void;
}

export function AppCard({ app, onClick }: AppCardProps) {
	const Icon = app.icon;

	return (
		<Box
			onClick={() => onClick(app.action)}
			sx={{
				minHeight: 172,
				cursor: 'pointer',
				border: '1px solid rgba(148, 163, 184, 0.28)',
				backgroundColor: '#fff',
				p: 2.5,
				transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
				'&:hover': {
					transform: 'translateY(-3px)',
					borderColor: 'rgba(37, 99, 235, 0.4)',
					boxShadow: '0 18px 40px rgba(37, 99, 235, 0.12)'
				}
			}}
		>
			<Box className="mb-7 flex items-start justify-between">
				<Icon size={24} color={app.accent || '#2563eb'} />
				{app.badge && (
					<Typography className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
						{app.badge}
					</Typography>
				)}
			</Box>

			<Typography className="mb-1.5 text-[15px] font-semibold text-slate-900">
				{app.name}
			</Typography>
			<Typography className="text-sm leading-5 text-slate-500">
				{app.description}
			</Typography>
		</Box>
	);
}
