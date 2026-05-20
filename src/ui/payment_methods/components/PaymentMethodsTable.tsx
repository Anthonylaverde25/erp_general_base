import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Tooltip,
	useTheme,
	alpha,
	Switch,
	Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { PaymentMethod } from '@/types/payment_method.types';

interface PaymentMethodsTableProps {
	paymentMethods: PaymentMethod[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function PaymentMethodsTable(props: PaymentMethodsTableProps) {
	const { paymentMethods, onEdit, onDelete, onStatusChange } = props;
	const theme = useTheme();

	const getTypeConfig = (type: string) => {
		const configs: Record<string, { label: string; icon: string; color: string }> = {
			cash: {
				label: 'Efectivo',
				icon: 'heroicons-outline:banknotes',
				color: theme.palette.success.main
			},
			bank_transfer: {
				label: 'Transferencia',
				icon: 'heroicons-outline:building-library',
				color: theme.palette.info.main
			},
			credit_card: {
				label: 'Tarjeta de Crédito',
				icon: 'heroicons-outline:credit-card',
				color: theme.palette.primary.main
			},
			debit_card: {
				label: 'Tarjeta de Débito',
				icon: 'heroicons-outline:credit-card',
				color: theme.palette.secondary.main
			},
			check: {
				label: 'Cheque',
				icon: 'heroicons-outline:document-text',
				color: theme.palette.warning.main
			},
			other: {
				label: 'Otro',
				icon: 'heroicons-outline:ellipsis-horizontal-circle',
				color: theme.palette.grey[600]
			}
		};
		return configs[type] || configs.other;
	};

	return (
		<TableContainer sx={{ borderRadius: 0 }}>
			<Table sx={{ minWidth: 650, borderCollapse: 'collapse', border: `1px solid ${theme.palette.divider}` }}>
				<TableHead>
					<TableRow>
						<TableCell
							sx={{
								width: 50,
								textAlign: 'center',
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							#
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Nombre
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Tipo
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Descripción
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Estado
						</TableCell>
						<TableCell
							align="right"
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Acciones
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{paymentMethods?.map((paymentMethod, index) => {
						const typeConfig = getTypeConfig(paymentMethod.type);
						return (
							<TableRow
								key={paymentMethod.id}
								hover
								sx={{
									backgroundColor:
										index % 2 === 0
											? 'transparent'
											: theme.palette.mode === 'dark'
												? 'rgba(255, 255, 255, 0.02)'
												: 'rgba(0, 0, 0, 0.01)',
									'&:hover': {
										backgroundColor:
											theme.palette.mode === 'dark'
												? 'rgba(255, 255, 255, 0.06)'
												: 'rgba(0, 0, 0, 0.03)'
									}
								}}
							>
								{/* # */}
								<TableCell
									sx={{
										width: 50,
										textAlign: 'center',
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`,
										color: theme.palette.text.secondary
									}}
								>
									{index + 1}
								</TableCell>

								{/* Nombre */}
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
									>
										{paymentMethod.name}
									</Typography>
								</TableCell>

								{/* Tipo */}
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: typeConfig.color }}
										>
											{typeConfig.icon}
										</FuseSvgIcon>
										<Typography sx={{ fontSize: '0.8125rem' }}>{typeConfig.label}</Typography>
									</Stack>
								</TableCell>

								{/* Descripción */}
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>{paymentMethod.description || '-'}</Typography>
								</TableCell>

								{/* Estado */}
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Tooltip
										title={paymentMethod.is_active ? 'Desactivar método' : 'Activar método'}
										placement="top"
									>
										<Switch
											checked={paymentMethod.is_active}
											onChange={() => onStatusChange(paymentMethod.id!, paymentMethod.is_active)}
											color="primary"
											size="small"
										/>
									</Tooltip>
								</TableCell>

								{/* Acciones */}
								<TableCell
									align="right"
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Tooltip title="Editar método">
										<IconButton
											size="small"
											onClick={() => onEdit(paymentMethod.id!)}
										>
											<FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>
										</IconButton>
									</Tooltip>
									<Tooltip title="Eliminar método">
										<IconButton
											size="small"
											color="error"
											onClick={() => onDelete(paymentMethod.id!)}
										>
											<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						);
					})}

					{(!paymentMethods || paymentMethods.length === 0) && (
						<TableRow>
							<TableCell
								colSpan={6}
								align="center"
								sx={{ py: 8, border: `1px solid ${theme.palette.divider}` }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									No hay métodos de pago disponibles
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
