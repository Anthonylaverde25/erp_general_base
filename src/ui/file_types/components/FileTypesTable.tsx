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
    Switch
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

interface FileTypesTableProps {
    fileTypes: FileTypeEntity[] | undefined;
    onEdit: (fileType: FileTypeEntity) => void;
    onDelete: (id: number) => void;
    onStatusChange: (fileType: FileTypeEntity) => void;
}

export default function FileTypesTable(props: FileTypesTableProps) {
    const { fileTypes, onEdit, onDelete, onStatusChange } = props;
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
                    {fileTypes?.map((fileType) => (
                        <TableRow
                            key={fileType.id}
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
                                    {fileType.name}
                                </Typography>
                            </TableCell>

                            {/* Descripción */}
                            <TableCell>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {fileType.description || '-'}
                                </Typography>
                            </TableCell>

                            {/* Estado */}
                            <TableCell>
                                <Switch
                                    checked={fileType.is_active}
                                    onChange={() => onStatusChange(fileType)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </TableCell>

                            {/* Acciones */}
                            <TableCell
                                align="right"
                                sx={{ pr: 3 }}
                            >
                                <Tooltip title="Editar">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(fileType)}
                                    >
                                        <FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(fileType.id)}
                                    >
                                        <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}

                    {(!fileTypes || fileTypes.length === 0) && (
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
                                    No hay tipos de archivos disponibles
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
