import { useState, useMemo } from 'react';
import { SidebarMode } from '../types';
import { useLauncherApps } from './useLauncherApps';

export function useAppLauncher() {
	const [open, setOpen] = useState(false);
	const [sidebarMode, setSidebarMode] = useState<SidebarMode>('home');
	
	// Estado simulado de aplicaciones que el usuario tiene 'activas' en su home
	const [activeAppIds, setActiveAppIds] = useState<string[]>([
		'erp',
		'sales',
		'crm',
		'pos',
		'settings',
		'inventory',
		'calendar',
		'finance'
	]);

	const { allApps, extensions } = useLauncherApps();

	const activeApps = useMemo(
		() => allApps.filter((app) => activeAppIds.includes(app.id)),
		[activeAppIds, allApps]
	);

	const availableApps = useMemo(
		() => allApps.filter((app) => !activeAppIds.includes(app.id)),
		[activeAppIds, allApps]
	);

	const handleOpen = () => setOpen(true);
	
	const handleClose = () => setOpen(false);

	const handleActivateApp = (appId: string) => {
		setActiveAppIds((current) => (current.includes(appId) ? current : [...current, appId]));
	};

	const executeAppAction = (action: () => void | Promise<void>) => {
		handleClose();
		action();
	};

	return {
		open,
		handleOpen,
		handleClose,
		sidebarMode,
		setSidebarMode,
		activeApps,
		availableApps,
		extensions,
		handleActivateApp,
		executeAppAction
	};
}
