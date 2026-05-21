import { Box, Card, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { Landmark } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import useCashRegisters from '@/features/cash-register/hooks/useCashRegisters';

export default function CashRegistersPage() {
	const { data: registers = [], isLoading } = useCashRegisters();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
			<PageHeader
				title="Cajas Creadas"
				subtitle="Listado de cajas registradoras de la empresa activa"
				actions={null}
			/>

			{isLoading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress size={28} />
				</Box>
			) : (
				<Card sx={{ borderRadius: '4px', border: 1, borderColor: 'divider', p: 2 }}>
					<Stack spacing={1.5}>
						{registers.map((register) => {
							const isActive = register.status !== 'inactive';
							return (
							<Box
								key={register.id}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									p: 1.5,
									border: 1,
									borderColor: 'divider',
									borderRadius: '4px',
									borderLeft: '4px solid #005483'
								}}
							>
								<Stack direction="row" spacing={1.25} alignItems="center">
									<Landmark size={16} />
									<Typography variant="subtitle2" fontWeight={800}>
										{register.name}
									</Typography>
								</Stack>
								<Chip
									size="small"
									label={isActive ? 'Activa' : 'Inactiva'}
									color={isActive ? 'success' : 'default'}
									sx={{ borderRadius: '4px', fontWeight: 700 }}
								/>
							</Box>
							);
						})}
						{registers.length === 0 && (
							<Typography variant="body2" color="text.secondary">
								No hay cajas creadas para la empresa activa.
							</Typography>
						)}
					</Stack>
				</Card>
			)}
		</Box>
	);
}
