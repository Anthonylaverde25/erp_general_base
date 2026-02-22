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
import { UnitEntity } from '@/domain/entities/units/UnitEntity';

interface UnitsTableProps {
	units: UnitEntity[] | undefined;
	isLoading?: boolean;
	onEdit: (unit: UnitEntity) => void;
	onDelete: (id: number) => void;
}

export default function UnitsTable(props: UnitsTableProps) {
	const { units, isLoading, onEdit, onDelete } = props;
	const theme = useTheme();

	return (
		<TableContainer>
			<Table sx={{ minWidth: 650 }}>
				<TableHead>
					<TableRow
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.15),
							borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
						}}
					>
						<TableCell sx={{ pl: 3, fontWeight: 700 }}>Code</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Unit Type</TableCell>
						<TableCell
							align="right"
							sx={{ pr: 3, fontWeight: 700 }}
						>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell
								colSpan={4}
								align="center"
								sx={{ py: 8 }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Loading units...
								</Typography>
							</TableCell>
						</TableRow>
					) : units && units.length > 0 ? (
						units.map((unit) => (
							<TableRow
								key={unit.id}
								hover
								sx={{
									transition: 'all 0.2s ease',
									'&:last-child td': { borderBottom: 0 },
									'&:nth-of-type(odd)': {
										backgroundColor: alpha(theme.palette.action.hover, 0.4)
									},
									'&:nth-of-type(even)': {
										backgroundColor: 'transparent'
									},
									'&:hover': {
										backgroundColor: alpha(theme.palette.primary.main, 0.08)
									}
								}}
							>
								<TableCell sx={{ pl: 3 }}>
									<Typography
										variant="subtitle2"
										fontWeight={600}
									>
										{unit.code}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">{unit.name}</Typography>
								</TableCell>
								<TableCell>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{unit.unit_type_name || '-'}
									</Typography>
								</TableCell>
								<TableCell
									align="right"
									sx={{ pr: 3 }}
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
												onClick={() => onEdit(unit)}
											>
												<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete">
											<IconButton
												color="error"
												size="small"
												onClick={() => onDelete(unit.id)}
											>
												<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
											</IconButton>
										</Tooltip>
									</Stack>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={4}
								align="center"
								sx={{ py: 8 }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									No units available
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
