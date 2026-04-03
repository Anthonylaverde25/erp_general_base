import { useMemo } from 'react';
import {
	Building2,
	BarChart3,
	Users,
	Store,
	Settings2,
	Boxes,
	CalendarDays,
	WalletCards,
	Award,
	Sparkles,
	Monitor
} from 'lucide-react';
import { usePosLaunch } from '@/features/pos/hooks/usePosLaunch';
import { setPosWindowRef } from '@/utils/posWindowRef';
import { LauncherApp, LauncherExtension } from '../types';

export function useLauncherApps() {
	const { mutateAsync: launchPos } = usePosLaunch();

	const posUrl = window.location.hostname === 'localhost'
		? 'http://localhost:4000'
		: `https://pos.${window.location.hostname.replace('app.', '')}`;

	const allApps = useMemo<LauncherApp[]>(() => [
		{
			id: 'erp',
			name: 'ERP Administrativo',
			description: 'Gestion global, documentos y operaciones.',
			badge: 'ACTIVE',
			icon: Building2,
			accent: '#0b57d0',
			action: () => { window.open(`${window.location.origin}/dashboard`, '_self'); }
		},
		{
			id: 'sales',
			name: 'Ventas',
			description: 'Presupuestos, pedidos y facturacion comercial.',
			badge: 'CORE',
			icon: BarChart3,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/sales`, '_self'); }
		},
		{
			id: 'crm',
			name: 'Partners CRM',
			description: 'Clientes, contactos y seguimiento comercial.',
			badge: 'LIVE',
			icon: Users,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/partners`, '_self'); }
		},
		{
			id: 'pos',
			name: 'Punto de Venta',
			description: 'Venta rapida, caja y operacion retail.',
			badge: 'REAL-TIME',
			icon: Store,
			accent: '#2563eb',
			action: async () => {
				try {
					const { data } = await launchPos();
					const originB64 = btoa(window.location.origin);
					const posWindow = window.open(`${posUrl}?lt=${data.launch_token}&tu=${originB64}`, '_blank');
					setPosWindowRef(posWindow);
				} catch (error) {
					console.error('Failed to get POS launch token:', error);
					const posWindow = window.open(posUrl, '_blank');
					setPosWindowRef(posWindow);
				}
			}
		},
		{
			id: 'settings',
			name: 'Configuracion',
			description: 'Usuarios, permisos y ajustes del sistema.',
			badge: 'ADMIN',
			icon: Settings2,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/settings`, '_self'); }
		},
		{
			id: 'inventory',
			name: 'Inventario',
			description: 'Stock, trazabilidad y control operativo.',
			badge: 'OPS',
			icon: Boxes,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/items`, '_self'); }
		},
		{
			id: 'calendar',
			name: 'Agenda',
			description: 'Visitas, tareas y eventos del equipo.',
			badge: 'NEW',
			icon: CalendarDays,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/dashboard`, '_self'); }
		},
		{
			id: 'finance',
			name: 'Finanzas',
			description: 'Cobros, pagos y conciliacion general.',
			badge: 'SUITE',
			icon: WalletCards,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/purchases`, '_self'); }
		},
		{
			id: 'staffing',
			name: 'Staffing',
			description: 'Turnos, asistencia y coordinacion del equipo.',
			badge: 'AVAILABLE',
			icon: CalendarDays,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/dashboard`, '_self'); }
		},
		{
			id: 'pricing',
			name: 'Price Rules',
			description: 'Descuentos, margenes y reglas comerciales.',
			badge: 'AVAILABLE',
			icon: WalletCards,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/sales`, '_self'); }
		},
		{
			id: 'analytics',
			name: 'Analytics Hub',
			description: 'KPIs avanzados e inteligencia de negocio.',
			badge: 'AVAILABLE',
			icon: BarChart3,
			accent: '#2563eb',
			action: () => { window.open(`${window.location.origin}/dashboard`, '_self'); }
		}
	], [posUrl, launchPos]);

	const extensions = useMemo<LauncherExtension[]>(() => [
		{
			id: 'loyalty',
			name: 'Loyalty',
			description: 'Programas de puntos y recompensas.',
			icon: Award
		},
		{
			id: 'advisor',
			name: 'AI Advisor',
			description: 'Sugerencias, alertas e insights predictivos.',
			icon: Sparkles
		},
		{
			id: 'desktop',
			name: 'Desktop Agent',
			description: 'Sincronizacion local y tareas en segundo plano.',
			icon: Monitor
		}
	], []);

	return { allApps, extensions };
}
