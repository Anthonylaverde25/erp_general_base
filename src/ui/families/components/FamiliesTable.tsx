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
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';

interface FamiliesTableProps {
	families: FamilyEntity[] | undefined;
	isLoading?: boolean;
	onEdit: (family: FamilyEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (family: FamilyEntity) => void;
}

export default function FamiliesTable(props: FamiliesTableProps) {
	const { families, isLoading, onEdit, onDelete, onStatusChange } = props;
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
							Profit %
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
							Tax Rate
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
							Active
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
					{isLoading ? (
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
									Loading families...
								</Typography>
							</TableCell>
						</TableRow>
					) : families && families.length > 0 ? (
						families.map((family, index) => (
							<TableRow
								key={family.id}
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
										{family.name}
									</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>{family.percentage}%</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Typography sx={{ fontSize: '0.8125rem' }}>
										{family.tax_rates?.map((t) => t.name).join(', ') || '-'}
									</Typography>
								</TableCell>
								<TableCell
									sx={{
										p: '6px 10px',
										fontSize: '0.8125rem',
										border: `1px solid ${theme.palette.divider}`
									}}
								>
									<Switch
										checked={family.is_active}
										onChange={() => onStatusChange(family)}
										inputProps={{ 'aria-label': 'controlled' }}
										size="small"
									/>
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
												onClick={() => onEdit(family)}
											>
												<FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete">
											<IconButton
												color="error"
												size="small"
												onClick={() => onDelete(family.id)}
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
									No families available
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
