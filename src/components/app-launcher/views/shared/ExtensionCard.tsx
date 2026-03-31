import { Box, Typography } from '@mui/material';
import { Lock } from 'lucide-react';
import { LauncherExtension } from '../../types';

interface ExtensionCardProps {
	extension: LauncherExtension;
}

export function ExtensionCard({ extension }: ExtensionCardProps) {
	const Icon = extension.icon;

	return (
		<Box
			sx={{
				minHeight: 152,
				border: '1px solid rgba(203, 213, 225, 0.7)',
				backgroundColor: 'rgba(255,255,255,0.55)',
				p: 2.5,
				opacity: 0.74
			}}
		>
			<Box className="mb-9 flex items-start justify-between">
				<Icon size={24} color="#6b7280" />
				<Lock size={14} color="#6b7280" />
			</Box>
			<Typography className="mb-1.5 text-[15px] font-semibold text-slate-600">
				{extension.name}
			</Typography>
			<Typography className="text-sm leading-5 text-slate-500">
				{extension.description}
			</Typography>
		</Box>
	);
}
