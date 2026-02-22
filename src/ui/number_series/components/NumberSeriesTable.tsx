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
	Stack,
	Chip
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

interface NumberSeriesTableProps {
	numberSeries: NumberSeriesEntity[] | undefined;
	onEdit: (series: NumberSeriesEntity) => void;
	onDelete: (id: number) => void;
}

export default function NumberSeriesTable(props: NumberSeriesTableProps) {
	const { numberSeries, onEdit, onDelete } = props;
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
						<TableCell sx={{ pl: 3, fontWeight: 700 }}>Tipo de Documento</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Serie</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Año</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Número Actual</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Términos</TableCell>
						<TableCell
							align="right"
							sx={{ pr: 3, fontWeight: 700 }}
						>
							Acciones
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{numberSeries?.map((series) => (
						<TableRow
							key={series.id}
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
							{/* Tipo de Documento */}
							<TableCell sx={{ pl: 3 }}>
								<Stack spacing={0.5}>
									<Typography
										variant="subtitle2"
										fontWeight={600}
									>
										{series.document_type?.name || '-'}
									</Typography>
									<Chip
										label={series.document_type?.code || '-'}
										size="small"
										sx={{ width: 'fit-content' }}
									/>
								</Stack>
							</TableCell>

							{/* Serie */}
							<TableCell>
								<Typography
									variant="body2"
									fontWeight={600}
								>
									{series.serie}
								</Typography>
							</TableCell>

							{/* Año */}
							<TableCell>
								<Typography variant="body2">{series.year}</Typography>
							</TableCell>

							{/* Número Actual */}
							<TableCell>
								<Typography
									variant="body2"
									fontWeight={600}
									color="primary"
								>
									{series.current_number}
								</Typography>
							</TableCell>

							{/* Términos */}
							<TableCell>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{series.terms || '-'}
								</Typography>
							</TableCell>

							{/* Acciones */}
							<TableCell
								align="right"
								sx={{ pr: 3 }}
							>
								<Tooltip title="Editar serie">
									<IconButton
										size="small"
										onClick={() => onEdit(series)}
									>
										<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
									</IconButton>
								</Tooltip>
								<Tooltip title="Eliminar serie">
									<IconButton
										size="small"
										color="error"
										onClick={() => onDelete(series.id)}
									>
										<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}

					{(!numberSeries || numberSeries.length === 0) && (
						<TableRow>
							<TableCell
								colSpan={6}
								align="center"
								sx={{ py: 8 }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									No hay series numéricas disponibles
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
