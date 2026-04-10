import { ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useUser from '@auth/useUser';
import { echoInstance } from '@/infrastructure/broadcasting/echo';
import { toast } from 'sonner';

type BroadcastingProviderProps = {
	children: ReactNode;
};

/**
 * BroadcastingProvider
 * 
 * Este proveedor se encarga de:
 * 1. Escuchar eventos de Laravel Echo (WebSockets/Reverb).
 * 2. Suscribirse al canal privado de la empresa activa del usuario.
 * 3. Invalidar la caché de React Query cuando ocurren cambios "en caliente" (ej: creación de documentos desde el POS).
 */
function BroadcastingProvider({ children }: BroadcastingProviderProps) {
	const queryClient = useQueryClient();
	const { data: user } = useUser();
	const activeCompanyId = user?.active_company_id;

	useEffect(() => {
		if (!activeCompanyId) {
			return;
		}

		const channelName = `company.${activeCompanyId}`;
		console.log(`[Echo] Suscribiéndose al canal de la empresa: ${channelName}`);

		// Retrieve the JWT token — useLocalStorage stores values with JSON.stringify,
		// so raw localStorage contains extra quotes: '"eyJ..."'. JSON.parse strips them.
		const rawToken = window.localStorage.getItem('jwt_access_token');
		const token = rawToken ? JSON.parse(rawToken) : null;

		if (token) {
			// @ts-expect-error - Accessing internal Echo options to inject the Bearer token
			echoInstance.options.auth.headers.Authorization = `Bearer ${token}`;
		}
		
		// Siempre inyectamos la URL del frontend para el middleware IdentifyTenant del backend
		// @ts-expect-error
		echoInstance.options.auth.headers['X-Frontend-Url'] = window.location.origin;

		const channel = echoInstance.private(channelName);

		// Escuchar evento de creación de documentos (Ticket POS, Facturas, etc.)
		channel.listen('.document.created', (event: any) => {
			console.log('[Echo] Nuevo documento detectado:', event);
			
			// Invalidar la caché de documentos para forzar el refetch en caliente
			queryClient.invalidateQueries({ queryKey: ['documents'] });
			
            // Opcional: Notificación visual para el usuario
            toast.info('Se ha generado un nuevo documento en el sistema.', {
                description: `ID: ${event.documentId} | Tipo: ${event.documentTypeCode}`,
                duration: 4000
            });
		});

		return () => {
			console.log(`[Echo] Dejando el canal: ${channelName}`);
			echoInstance.leave(channelName);
		};
	}, [activeCompanyId, queryClient]);

	return <>{children}</>;
}

export default BroadcastingProvider;
