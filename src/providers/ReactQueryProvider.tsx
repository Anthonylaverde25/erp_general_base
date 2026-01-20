import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

type ReactQueryProviderProps = {
	children: ReactNode;
};

/**
 * React Query Provider component that wraps the application with QueryClientProvider
 * and provides React Query DevTools in development mode.
 */
function ReactQueryProvider({ children }: ReactQueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Tiempo que los datos permanecen frescos antes de considerarse obsoletos
						staleTime: 1000 * 60 * 5, // 5 minutos
						// Tiempo que los datos se mantienen en caché
						gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
						// Reintentos en caso de error
						retry: 1,
						// Refetch automático al enfocar la ventana
						refetchOnWindowFocus: false,
						// Refetch automático al reconectar
						refetchOnReconnect: true
					},
					mutations: {
						// Reintentos para mutaciones
						retry: 0
					}
				}
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* DevTools solo en desarrollo */}
			{import.meta.env.DEV && (
				<ReactQueryDevtools
					initialIsOpen={false}
					position="bottom"
				/>
			)}
		</QueryClientProvider>
	);
}

export default ReactQueryProvider;
