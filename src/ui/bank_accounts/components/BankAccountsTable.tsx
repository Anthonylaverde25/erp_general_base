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
	alpha
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IBankAccount } from '@/types/bank_account.types';

interface BankAccountsTableProps {
	bankAccounts: IBankAccount[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export default function BankAccountsTable(props: BankAccountsTableProps) {
	const { bankAccounts, onEdit, onDelete } = props;
	const theme = useTheme();

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
							Titular
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
							Número de Cuenta
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
							SWIFT
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
					{bankAccounts?.map((bankAccount, index) => (
						<TableRow
							key={bankAccount.id}
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
									{bankAccount.name}
								</Typography>
							</TableCell>

							{/* Titular */}
							<TableCell
								sx={{
									p: '6px 10px',
									fontSize: '0.8125rem',
									border: `1px solid ${theme.palette.divider}`
								}}
							>
								<Typography sx={{ fontSize: '0.8125rem' }}>{bankAccount.account_holder}</Typography>
							</TableCell>

							{/* Número de Cuenta */}
							<TableCell
								sx={{
									p: '6px 10px',
									fontSize: '0.8125rem',
									border: `1px solid ${theme.palette.divider}`
								}}
							>
								<Typography sx={{ fontSize: '0.8125rem' }}>{bankAccount.account_number}</Typography>
							</TableCell>

							{/* SWIFT */}
							<TableCell
								sx={{
									p: '6px 10px',
									fontSize: '0.8125rem',
									border: `1px solid ${theme.palette.divider}`
								}}
							>
								<Typography
									sx={{
										fontSize: '0.8125rem',
										fontWeight: 600,
										color: 'primary.main'
									}}
								>
									{bankAccount.swift}
								</Typography>
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
								<Tooltip title="Editar cuenta">
									<IconButton
										size="small"
										onClick={() => onEdit(bankAccount.id)}
									>
										<FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>
									</IconButton>
								</Tooltip>
								<Tooltip title="Eliminar cuenta">
									<IconButton
										size="small"
										color="error"
										onClick={() => onDelete(bankAccount.id)}
									>
										<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}

					{(!bankAccounts || bankAccounts.length === 0) && (
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
									No hay cuentas bancarias disponibles
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
