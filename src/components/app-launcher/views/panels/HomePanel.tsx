import { Box, Typography, Button } from '@mui/material';
import { Lock, Monitor } from 'lucide-react';
import { LauncherApp, LauncherExtension } from '../../types';
import { AppCard } from '../shared/AppCard';
import { ExtensionCard } from '../shared/ExtensionCard';

interface HomePanelProps {
	activeApps: LauncherApp[];
	extensions: LauncherExtension[];
	executeAppAction: (action: () => void | Promise<void>) => void;
	onClose: () => void;
}

export function HomePanel({ activeApps, extensions, executeAppAction, onClose }: HomePanelProps) {
	return (
		<Box className="flex min-w-0 flex-1 flex-col bg-[#f8fafc]">
			<Box className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
				<Box className="mb-8">
					<Box className="mb-4 flex items-baseline gap-3">
						<Typography className="text-4xl font-light tracking-tight text-slate-900">
							My Home
						</Typography>
						<Typography className="text-sm text-slate-500">
							({activeApps.length} Applications)
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
							gap: 2
						}}
					>
						{activeApps.map((app) => (
							<AppCard 
								key={app.id} 
								app={app} 
								onClick={executeAppAction} 
							/>
						))}
					</Box>
				</Box>

				<Box>
					<Box className="mb-4 flex items-center gap-4">
						<Typography className="text-3xl font-light tracking-tight text-slate-600">
							Available Extensions
						</Typography>
						<Box className="h-px flex-1 bg-slate-300" />
					</Box>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
							gap: 2,
							maxWidth: 600
						}}
					>
						{extensions.map((extension) => (
							<ExtensionCard key={extension.id} extension={extension} />
						))}
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					px: 3,
					py: 1.5,
					backgroundColor: '#ffffff',
					borderTop: '1px solid rgba(148, 163, 184, 0.28)'
				}}
			>
				<Button
					startIcon={<Lock size={16} />}
					sx={{
						color: '#0b57d0',
						fontWeight: 700,
						textTransform: 'none'
					}}
				>
					App Permissions
				</Button>

				<Box className="flex items-center gap-1.5">
					<Button
						variant="outlined"
						onClick={onClose}
						sx={{
							minWidth: 112,
							height: 46,
							borderColor: '#2563eb',
							color: '#0b57d0',
							fontWeight: 700,
							textTransform: 'none'
						}}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						startIcon={<Monitor size={16} />}
						onClick={() => {
							onClose();
							window.open(`${window.location.origin}/dashboard`, '_self');
						}}
						sx={{
							minWidth: 172,
							height: 46,
							backgroundColor: '#0b57d0',
							fontWeight: 700,
							textTransform: 'none',
							boxShadow: 'none',
							'&:hover': {
								backgroundColor: '#0a4db8',
								boxShadow: 'none'
							}
						}}
					>
						Launch Desktop
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
