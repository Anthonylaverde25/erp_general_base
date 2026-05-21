import { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import CashRegisterAnalyticsHeader from './CashRegisterAnalyticsHeader';
import CashRegisterAnalyticsChart from './CashRegisterAnalyticsChart';

interface CashRegisterAnalyticsProps {
	analytics: {
		name: string;
		ingresos: number;
		egresos: number;
		saldo_neto: number;
	}[];
}

/**
 * Módulo de Analítica de Caja (Orquestador)
 * Coordina el estado de visualización entre los controles y el gráfico.
 */
export default function CashRegisterAnalytics({ analytics }: CashRegisterAnalyticsProps) {
	const [view, setView] = useState<'all' | 'ingresos' | 'egresos'>('all');
	const [showChart, setShowChart] = useState(true);

	return (
		<Box className='border p-5 border-gray-200'>
			{/* Cabecera y Controles */}
			<CashRegisterAnalyticsHeader 
				view={view} 
				onViewChange={setView} 
				showChart={showChart}
				onToggleChart={() => setShowChart(!showChart)}
			/>

			{/* Motor Visual del Gráfico con Transición Smooth */}
			<Collapse in={showChart}>
				<Box sx={{ mt: 2 }}>
					<CashRegisterAnalyticsChart 
						view={view} 
						analytics={analytics}
					/>
				</Box>
			</Collapse>
		</Box>
	);
}
