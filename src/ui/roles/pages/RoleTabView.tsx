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
    IconButton,
    Tooltip,
    Divider,
    Stack,
    Button
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
        <Box className="w-full overflow-hidden">
            <Stack
                className="mb-5 border-b p-4 bg-gray-50/50"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
            >
                <div>
                    {/* Left side content if any, e.g. search or filter */}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
                >
                    Crear rol
                </Button>
            </Stack>
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow className="bg-gray-50">
                            <TableCell className="pl-6 font-semibold text-gray-600">Nombre</TableCell>
                            <TableCell className="font-semibold text-gray-600">Código</TableCell>
                            <TableCell className="font-semibold text-gray-600">Descripción</TableCell>
                            <TableCell align="right" className="pr-6 font-semibold text-gray-600">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {roles?.map((role) => (
                            <TableRow
                                key={role.id}
                                hover
                                className="transition-colors"
                                sx={{ '&:last-child td': { borderBottom: 0 } }}
                            >
                                {/* Nombre */}
                                <TableCell className="pl-6">
                                    <Typography variant="subtitle2" className="font-medium">
                                        {role.name}
                                    </Typography>
                                </TableCell>

                                {/* Código como Chip */}
                                <TableCell>
                                    <Chip
                                        className="font-mono uppercase text-xs"
                                        label={role.code}
                                    // size="small"
                                    // variant="outlined"
                                    // color="primary"
                                    />
                                </TableCell>

                                {/* Descripción */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        className="max-w-sm truncate"
                                        title={role.description}
                                    >
                                        {role.description || 'Sin descripción'}
                                    </Typography>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell align="right" className="pr-6">
                                    <Tooltip title="Editar rol">
                                        <IconButton size="small">
                                            <FuseSvgIcon size={20}>
                                                heroicons-outline:pencil-square
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!roles || roles.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No hay roles disponibles
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
}
