import { Avatar, Box, Paper, Typography, CircularProgress } from '@mui/material';
import { AccountBalanceWallet, ReceiptLong } from '@mui/icons-material';
import { useShowPartnerFinancialSummary } from '@/features/partners/hooks/useShowPartnerFinancialSummary';

interface PartnerOverviewCardsProps {
	partnerId: number;
	partnerRole: string;
}

const formatCurrency = (val: number) => {
	return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
};

export default function PartnerOverviewCards({ partnerId, partnerRole }: PartnerOverviewCardsProps) {
	const { summary, isLoading } = useShowPartnerFinancialSummary(partnerId);

	if (isLoading) {
		return (
			<Box className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<Paper variant="outlined" sx={{ p: 3, display: 'flex', justifyContent: 'center', borderColor: 'divider' }}>
					<CircularProgress size={24} />
				</Paper>
				<Paper variant="outlined" sx={{ p: 3, display: 'flex', justifyContent: 'center', borderColor: 'divider' }}>
					<CircularProgress size={24} />
				</Paper>
			</Box>
		);
	}

	const salesTotal = summary?.sales_total || 0;
	const collectedTotal = summary?.collected_total || 0;
	const purchasesTotal = summary?.purchases_total || 0;
	const paidTotal = summary?.paid_total || 0;
	const pendingCollection = summary?.pending_collection || 0;
	const pendingPayment = summary?.pending_payment || 0;

	// Determine visibility of cards
	const isClient = partnerRole === 'client' || partnerRole === 'client_supplier';
	const isSupplier = partnerRole === 'supplier' || partnerRole === 'provider' || partnerRole === 'client_supplier';

	// Grid configuration
	const gridCols = isClient && isSupplier ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';

	return (
		<Box className={`grid ${gridCols} gap-4`}>
			{/* ── CARD: Pendiente de Cobro (Clients) ─────────────────── */}
			{isClient && (
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						borderColor: 'divider',
						borderRadius: 1.5,
						bgcolor: 'background.paper',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
					}}
				>
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							fontWeight={600}
							sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
						>
							Pendiente de Cobro
						</Typography>
						<Typography
							variant="h4"
							fontWeight={800}
							color={pendingCollection > 0 ? 'warning.main' : 'success.main'}
							sx={{ mt: 1, mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}
						>
							{formatCurrency(pendingCollection)}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ fontSize: '0.75rem' }}
						>
							Facturado: <span className="font-semibold">{formatCurrency(salesTotal)}</span> · Cobrado: <span className="font-semibold">{formatCurrency(collectedTotal)}</span>
						</Typography>
					</Box>
					<Avatar 
						sx={{ 
							width: 48, 
							height: 48, 
							bgcolor: pendingCollection > 0 ? 'warning.50' : 'success.50', 
							color: pendingCollection > 0 ? 'warning.main' : 'success.main' 
						}}
					>
						<AccountBalanceWallet sx={{ fontSize: 24 }} />
					</Avatar>
				</Paper>
			)}

			{/* ── CARD: Pendiente de Pago (Suppliers) ─────────────────── */}
			{isSupplier && (
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						borderColor: 'divider',
						borderRadius: 1.5,
						bgcolor: 'background.paper',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
					}}
				>
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							fontWeight={600}
							sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
						>
							Pendiente de Pago
						</Typography>
						<Typography
							variant="h4"
							fontWeight={800}
							color={pendingPayment > 0 ? 'error.main' : 'success.main'}
							sx={{ mt: 1, mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}
						>
							{formatCurrency(pendingPayment)}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ fontSize: '0.75rem' }}
						>
							Facturado: <span className="font-semibold">{formatCurrency(purchasesTotal)}</span> · Pagado: <span className="font-semibold">{formatCurrency(paidTotal)}</span>
						</Typography>
					</Box>
					<Avatar 
						sx={{ 
							width: 48, 
							height: 48, 
							bgcolor: pendingPayment > 0 ? 'error.50' : 'success.50', 
							color: pendingPayment > 0 ? 'error.main' : 'success.main' 
						}}
					>
						<ReceiptLong sx={{ fontSize: 24 }} />
					</Avatar>
				</Paper>
			)}
		</Box>
	);
}
