import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Stack,
    Button,
    useTheme,
    alpha,
    Chip,
    Switch,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import useIndexTaxTypes from "@/features/tax_types/hooks/useIndexTaxTypes";
import useUpdateTaxType from "@/features/tax_types/hooks/useUpdateTaxType";
import { TaxTypeEntity } from "@/domain/entities/tax_types/TaxTypeEntity";
import TaxTypesModal from "./modals/TaxTypesModal";

export default function TaxTypesTabView() {
    const theme = useTheme();
    const { taxTypes, isLoading, isError } = useIndexTaxTypes();
    const { handleUpdateTaxType } = useUpdateTaxType();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTaxType, setSelectedTaxType] = useState<TaxTypeEntity | null>(null);

    const handleCreate = () => {
        setSelectedTaxType(null);
        setModalOpen(true);
    };

    const handleEdit = (taxType: TaxTypeEntity) => {
        setSelectedTaxType(taxType);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete tax type clicked", id);
        // TODO: Implement delete functionality
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTaxType(null);
    };

    const handleStatusChange = async (taxType: TaxTypeEntity) => {
        try {
            await handleUpdateTaxType({
                id: taxType.id,
                code: taxType.code,
                name: taxType.name,
                description: taxType.description || "",
                is_active: !taxType.is_active,
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (isLoading)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">
                    Cargando tipos de impuestos...
                </Typography>
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="error">
                    Error al cargar los tipos de impuestos
                </Typography>
            </Box>
        );

    return (
        <Box className="w-full overflow-hidden">
            {/* Header Section */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <div />
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={
                        <FuseSvgIcon size={20}>
                            heroicons-outline:plus
                        </FuseSvgIcon>
                    }
                    onClick={handleCreate}
                >
                    Crear tipo de impuesto
                </Button>
            </Stack>

            {/* Table Section */}
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

                                {/* Estado */}
                                <TableCell>
                                    <Switch
                                        checked={taxType.is_active}
                                        onChange={() => handleStatusChange(taxType)}
                                        inputProps={{ "aria-label": "controlled" }}
                                    />
                                </TableCell>

                                {/* Acciones */}
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Tooltip title="Editar">
                                        <IconButton size="small" onClick={() => handleEdit(taxType)}>
                                            <FuseSvgIcon size={20}>
                                                heroicons-outline:pencil-square
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton size="small" color="error" onClick={() => handleDelete(taxType.id)}>
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
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay tipos de impuestos disponibles
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TaxTypesModal
                open={modalOpen}
                onClose={handleCloseModal}
                taxType={selectedTaxType}
            />
        </Box>
    );
}
