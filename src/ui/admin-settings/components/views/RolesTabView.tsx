import useIndexRoles from '@/features/roles/hooks/useIndexRoles';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Box,
	Chip,
	Avatar,
	Card,
	IconButton
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

export default function RolesTabView() {
	const { roles, isLoading, isError } = useIndexRoles();

	if (isLoading)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="text.secondary">Cargando roles...</Typography>
			</Box>
		);

	if (isError)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="error">Error al cargar los roles</Typography>
			</Box>
		);

	return (
		<Card className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
			<TableContainer>
				<Table
					sx={{ minWidth: 650 }}
					aria-label="roles table"
				>
					<TableHead>
						<TableRow className="bg-white">
							<TableCell className="pl-6 font-semibold text-gray-600">ID</TableCell>
							<TableCell className="font-semibold text-gray-600">Nombre</TableCell>
							<TableCell className="font-semibold text-gray-600">Código</TableCell>
							<TableCell className="font-semibold text-gray-600">Descripción</TableCell>
							<TableCell
								align="right"
								className="pr-6 font-semibold text-gray-600"
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
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell
									component="th"
									scope="row"
									className="pl-6"
								>
									<Typography
										color="text.secondary"
										variant="body2"
									>
										#{role.id}
									</Typography>
								</TableCell>
								<TableCell>
									<Box className="flex items-center gap-3">
										<Avatar
											sx={{
												width: 32,
												height: 32,
												fontSize: 14,
												bgcolor: 'primary.light',
												color: 'primary.dark'
											}}
										>
											{role.name.charAt(0).toUpperCase()}
										</Avatar>
										<Typography
											variant="subtitle2"
											className="font-medium"
										>
											{role.name}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									<Chip
										label={role.code}
										size="small"
										variant="outlined"
										color="primary"
										className="font-mono text-xs uppercase"
									/>
								</TableCell>
								<TableCell>
									<Typography
										variant="body2"
										color="text.secondary"
										className="max-w-xs truncate"
									>
										{role.description}
									</Typography>
								</TableCell>
								<TableCell
									align="right"
									className="pr-6"
								>
									<IconButton
										size="small"
										color="inherit"
									>
										<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
									</IconButton>
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
										variant="body1"
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
		</Card>
	);
}
