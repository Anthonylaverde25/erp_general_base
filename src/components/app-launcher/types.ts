import { LucideIcon } from 'lucide-react';

export type LauncherApp = {
	id: string;
	name: string;
	description: string;
	badge?: string;
	icon: LucideIcon;
	action: () => void | Promise<void>;
	accent?: string;
};

export type LauncherExtension = {
	id: string;
	name: string;
	description: string;
	icon: LucideIcon;
};

export type SidebarMode = 'home' | 'available' | 'recent';
