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
	Chip,
	Switch
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IRole } from '@/types/role.types';

interface RolesTableProps {
	roles: IRole[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function RolesTable(props: RolesTableProps) {
	const { roles, onEdit, onDelete, onStatusChange } = props;
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
						<TableCell sx={{ pl: 3, fontWeight: 700 }}>Nombre</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
						<TableCell
							align="right"
							sx={{ pr: 3, fontWeight: 700 }}
						>
							Acciones
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{roles?.map((role) => (
						<TableRow
							key={role.id}
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
							{/* Nombre */}
							<TableCell sx={{ pl: 3 }}>
								<Typography
									variant="subtitle2"
									fontWeight={600}
								>
									{role.name}
								</Typography>
							</TableCell>

							{/* Código */}
							<TableCell>
								<Chip
									label={role.code}
									size="small"
									sx={{
										borderRadius: 1,
										bgcolor: alpha(theme.palette.primary.main, 0.1),
										color: theme.palette.primary.main,
										fontWeight: 600,
										fontFamily: 'monospace'
									}}
								/>
							</TableCell>

							{/* Descripción */}
							<TableCell>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{role.description || '-'}
								</Typography>
							</TableCell>

							{/* Estado */}
							<TableCell>
								<Tooltip
									title={role.active ? 'Desactivar rol' : 'Activar rol'}
									placement="top"
								>
									<Switch
										checked={role.active}
										onChange={() => onStatusChange(role.id, role.active)}
										color="primary"
										size="small"
									/>
								</Tooltip>
							</TableCell>

							{/* Acciones */}
							<TableCell
								align="right"
								sx={{ pr: 3 }}
							>
								<Tooltip title="Editar rol">
									<IconButton
										size="small"
										onClick={() => onEdit(role.id)}
									>
										<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
									</IconButton>
								</Tooltip>
								<Tooltip title="Eliminar rol">
									<IconButton
										size="small"
										color="error"
										onClick={() => onDelete(role.id)}
									>
										<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}

					{(!roles || roles.length === 0) && (
						<TableRow>
							<TableCell
								colSpan={5}
								align="center"
								sx={{ py: 8 }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									No hay roles disponibles
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
