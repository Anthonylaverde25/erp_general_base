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
    Switch,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { TaxTypeEntity } from "@/domain/entities/tax_types/TaxTypeEntity";

interface TaxTypesTableProps {
    taxTypes: TaxTypeEntity[] | undefined;
    onEdit: (taxType: TaxTypeEntity) => void;
    onDelete: (id: number) => void;
    onStatusChange: (taxType: TaxTypeEntity) => void;
}

export default function TaxTypesTable(props: TaxTypesTableProps) {
    const { taxTypes, onEdit, onDelete, onStatusChange } = props;
    const theme = useTheme();

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    >
                        <TableCell sx={{ pl: 3, fontWeight: 700 }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Operación</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {taxTypes?.map((taxType) => (
                        <TableRow
                            key={taxType.id}
                            hover
                            sx={{
                                transition: "all 0.2s ease",
                                "&:last-child td": { borderBottom: 0 },
                                "&:nth-of-type(odd)": {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.4),
                                },
                                "&:nth-of-type(even)": {
                                    backgroundColor: "transparent",
                                },
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            {/* Nombre */}
                            <TableCell sx={{ pl: 3 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {taxType.name}
                                </Typography>
                            </TableCell>

                            {/* Descripción */}
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {taxType.description || "-"}
                                </Typography>
                            </TableCell>

                            {/* Operation */}
                            <TableCell>
                                <Chip
                                    label={taxType.operation_label || "-"}
                                    size="small"
                                    sx={{ width: "fit-content" }}
                                />
                            </TableCell>

                            {/* Estado */}
                            <TableCell>
                                <Switch
                                    checked={taxType.is_active}
                                    onChange={() => onStatusChange(taxType)}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </TableCell>

                            {/* Acciones */}
                            <TableCell align="right" sx={{ pr: 3 }}>
                                <Tooltip title="Editar">
                                    <IconButton size="small" onClick={() => onEdit(taxType)}>
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:pencil-square
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <IconButton size="small" color="error" onClick={() => onDelete(taxType.id)}>
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:trash
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}

                    {(!taxTypes || taxTypes.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay tipos de impuestos disponibles
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
