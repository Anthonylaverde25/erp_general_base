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
	Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';

interface TaxRatesTableProps {
	taxRates: TaxRateEntity[] | undefined;
	onEdit: (taxRate: TaxRateEntity) => void;
	onDelete: (id: number) => void;
}

export default function TaxRatesTable(props: TaxRatesTableProps) {
	const { taxRates, onEdit, onDelete } = props;
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
							Name
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
							Description
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
							Percentage (%)
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
							Tax Type
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
							Actions
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{taxRates && taxRates.length > 0 ? (
						taxRates.map((taxRate, index) => (
							<TableRow
								key={taxRate.id}
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
										{taxRate.name}
									</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>No aplica</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>{taxRate.percentage}%</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>{taxRate.tax_type?.name || '-'}</Typography>
								</TableCell>
								<TableCell
									align="right"
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Stack
										direction="row"
										justifyContent="flex-end"
										spacing={1}
									>
										<Tooltip title="Edit">
											<IconButton
												color="primary"
												size="small"
												onClick={() => onEdit(taxRate)}
											>
												<FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete">
											<IconButton
												color="error"
												size="small"
												onClick={() => onDelete(taxRate.id!)}
											>
												<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
											</IconButton>
										</Tooltip>
									</Stack>
								</TableCell>
							</TableRow>
						))
					) : (
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
									No tax rates available
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
