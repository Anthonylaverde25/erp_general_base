import { useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box, Typography, Snackbar, Alert, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { History as HistoryIcon } from 'lucide-react';
import CashRegisterHeader from '../components/CashRegisterHeader';
import CashRegisterAnalytics from '../components/CashRegisterAnalytics';
import CashRegisterTable from '../components/CashRegisterTable';
import CashRegisterMetrics from '../components/CashRegisterMetrics';
import CashRegisterActionBar from '../components/CashRegisterActionBar';
import CashRegisterReconciliationDialog from '../components/CashRegisterReconciliationDialog';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
}));

export default function CashRegister() {
	const theme = useTheme();
	const [isOpen, setIsOpen] = useState(true);

	// Estado simulado para validación de cierre (0 = Habilitado para Arqueo)
	const [pendingApprovals, setPendingApprovals] = useState(0);

	// Estado para Arqueo de Caja
	const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	// Datos simulados
	const saldoInicial = 5000.00;
	const saldoActual = 6850.50;

	const handleConfirmReconciliation = (declaradoEfectivo: number, declaradoTarjetas: number, justificacion: string) => {
		setIsReconciliationOpen(false);
		setIsOpen(false);
		setShowSuccess(true);
	};

	return (
		<>
			<Root
				header={
					<CashRegisterHeader
						isOpen={isOpen}
						onClose={() => setIsReconciliationOpen(true)}
						isLocked={pendingApprovals > 0}
					/>
				}

				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 4 }}>
						{/* Fila superior de Métricas e Información */}
						<CashRegisterMetrics
							saldoInicial={saldoInicial}
							saldoActual={saldoActual}
							pendingApprovals={pendingApprovals}
						/>

						{/* Barra de Acciones Operativas (Componentizada) */}
						<CashRegisterActionBar isOpen={isOpen} />

						{/* Fila de Gráfico y Banner Info */}
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							<CashRegisterAnalytics />
							
							<Box sx={{
								borderLeft: '4px solid #005483',
								bgcolor: alpha(theme.palette.primary.main, 0.06),
								p: 2,
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								borderRadius: '0 4px 4px 0'
							}}>
								<HistoryIcon size={18} color={theme.palette.primary.main} />
								<Typography variant="caption" color="text.secondary" fontWeight={500}>
									Los datos históricos y el balance se actualizan en tiempo real según el cierre de terminales.
								</Typography>
							</Box>
						</Box>

						{/* Sección de Tabla */}
						<CashRegisterTable onPendingUpdate={setPendingApprovals} />
					</Box>
				}
				scroll="content"
			/>

			<CashRegisterReconciliationDialog
				open={isReconciliationOpen}
				onClose={() => setIsReconciliationOpen(false)}
				onConfirm={handleConfirmReconciliation}
			/>

			<Snackbar
				open={showSuccess}
				autoHideDuration={6000}
				onClose={() => setShowSuccess(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert severity="success" variant="filled" sx={{ width: '100%' }}>
					Caja cerrada correctamente. Reporte Z impreso.
				</Alert>
			</Snackbar>
		</>
	);
}