import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box, Typography, Snackbar, Alert, Button, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { History as HistoryIcon } from 'lucide-react';
import CashRegisterHeader from '../components/CashRegisterHeader';
import CashRegisterAnalytics from '../components/CashRegisterAnalytics';
import CashRegisterTable from '../components/CashRegisterTable';
import CashRegisterMetrics from '../components/CashRegisterMetrics';
import CashRegisterActionBar from '../components/CashRegisterActionBar';
import CashRegisterReconciliationDialog from '../components/CashRegisterReconciliationDialog';
import CashRegisterOpenDialog from '../components/CashRegisterOpenDialog';
import CashRegisterMovementDialog from '../components/CashRegisterMovementDialog';
import useCashRegisterCurrentSession from '@/features/cash-register/hooks/useCashRegisterCurrentSession';
import useCashRegisters from '@/features/cash-register/hooks/useCashRegisters';
import useOpenSession from '@/features/cash-register/hooks/useOpenSession';
import useCloseSession from '@/features/cash-register/hooks/useCloseSession';
import useRecordMovement from '@/features/cash-register/hooks/useRecordMovement';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default
	}
}));

export default function CashRegister() {
	const theme = useTheme();
	const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [movementDialogType, setMovementDialogType] = useState<'deposit' | 'withdrawal' | null>(null);
	const [isOpenSessionDialogOpen, setIsOpenSessionDialogOpen] = useState(false);

	const { data: currentSessionData } = useCashRegisterCurrentSession();
	const { data: registers = [] } = useCashRegisters();
	const openSessionMutation = useOpenSession();
	const closeSessionMutation = useCloseSession();
	const recordMovementMutation = useRecordMovement();

	const isOpen = currentSessionData?.active ?? false;
	const summary = useMemo(
		() =>
			currentSessionData?.summary ?? {
				opening_balance: 0,
				total_inflows: 0,
				total_outflows: 0,
				calculated_balance: 0,
				balance: 0,
				balance_percentage: 0,
				pending_approvals: 0,
				analytics: []
			},
		[currentSessionData]
	);
	const movements = currentSessionData?.movements ?? [];
	const registerName = currentSessionData?.cash_register_name ?? 'TERMINAL';
	const pendingApprovals = currentSessionData?.summary?.pending_approvals ?? 0;

	console.log('currentSessionData', currentSessionData);

	return (
		<>
			<Root
				header={
					<CashRegisterHeader
						isOpen={isOpen}
						registerName={registerName}
						onClose={() => setIsReconciliationOpen(true)}
						isLocked={pendingApprovals > 0}
					/>
				}
				content={
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3, gap: 4 }}>
						{isOpen ? (
							<>
								<CashRegisterMetrics summary={summary} pendingApprovals={pendingApprovals} />

								<CashRegisterActionBar
									isOpen={isOpen}
									onDeposit={() => setMovementDialogType('deposit')}
									onWithdrawal={() => setMovementDialogType('withdrawal')}
								/>

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
									<CashRegisterAnalytics analytics={summary.analytics ?? []} />
									<Box
										sx={{
											borderLeft: '4px solid #005483',
											bgcolor: alpha(theme.palette.primary.main, 0.06),
											p: 2,
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											borderRadius: '0 4px 4px 0'
										}}
									>
										<HistoryIcon size={18} color={theme.palette.primary.main} />
										<Typography variant="caption" color="text.secondary" fontWeight={500}>
											Los datos históricos y el balance se actualizan en tiempo real según el cierre de terminales.
										</Typography>
									</Box>
								</Box>

								<CashRegisterTable movements={movements} />
							</>
						) : (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-start',
									gap: 2,
									p: 3,
									border: `1px solid ${theme.palette.divider}`,
									borderLeft: '4px solid #005483',
									borderRadius: '4px',
									bgcolor: 'background.paper'
								}}
							>
								<Typography variant="h6" fontWeight={800}>
									No hay sesión activa en caja
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Selecciona una caja y abre sesión para comenzar a registrar movimientos.
								</Typography>
								<Button
									variant="contained"
									onClick={() => setIsOpenSessionDialogOpen(true)}
									disabled={registers.length === 0 || openSessionMutation.isPending}
									sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 700 }}
								>
									Abrir caja
								</Button>
							</Box>
						)}
					</Box>
				}
				scroll="content"
			/>

			<CashRegisterOpenDialog
				open={isOpenSessionDialogOpen}
				onClose={() => setIsOpenSessionDialogOpen(false)}
				registers={registers}
				isLoading={openSessionMutation.isPending}
				onConfirm={(cashRegisterId, notes) => {
					openSessionMutation.mutate(
						{ cash_register_id: cashRegisterId, notes },
						{ onSuccess: () => setIsOpenSessionDialogOpen(false) }
					);
				}}
			/>

			<CashRegisterReconciliationDialog
				open={isReconciliationOpen}
				onClose={() => setIsReconciliationOpen(false)}
				closingBalanceReal={summary.calculated_balance}
				isLoading={closeSessionMutation.isPending}
				onConfirm={(notes) => {
					closeSessionMutation.mutate(
						{
							closing_balance_real: summary.calculated_balance,
							notes
						},
						{
							onSuccess: () => {
								setIsReconciliationOpen(false);
								setShowSuccess(true);
							}
						}
					);
				}}
			/>

			<CashRegisterMovementDialog
				open={Boolean(movementDialogType)}
				type={movementDialogType ?? 'deposit'}
				onClose={() => setMovementDialogType(null)}
				isLoading={recordMovementMutation.isPending}
				onConfirm={(amount, notes) => {
					recordMovementMutation.mutate(
						{
							type: movementDialogType ?? 'deposit',
							amount,
							notes
						},
						{ onSuccess: () => setMovementDialogType(null) }
					);
				}}
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
