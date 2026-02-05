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
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import useIndexNumberSeries from "@/features/number_series/hooks/useIndexNumberSeries";

import { useState } from "react";
import CreateNumberSeriesModal from "./modals/CreateNumberSeriesModal";

export default function NumberSeriesTabView() {
    const theme = useTheme();
    const { numberSeries, isLoading, isError } = useIndexNumberSeries();
    const [createModalOpen, setCreateModalOpen] = useState(false);

    if (isLoading)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">
                    Cargando series numéricas...
                </Typography>
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="error">
                    Error al cargar las series numéricas
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
                    onClick={() => setCreateModalOpen(true)}
                >
                    Crear serie
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
                            <TableCell sx={{ pl: 3, fontWeight: 700 }}>Tipo de Documento</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Serie</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Año</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Número Actual</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Términos</TableCell>
                            <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
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
                                {/* Tipo de Documento */}
                                <TableCell sx={{ pl: 3 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {series.document_type?.name || "-"}
                                        </Typography>
                                        <Chip
                                            label={series.document_type?.code || "-"}
                                            size="small"
                                            sx={{ width: "fit-content" }}
                                        />
                                    </Stack>
                                </TableCell>

                                {/* Serie */}
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {series.serie}
                                    </Typography>
                                </TableCell>

                                {/* Año */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {series.year}
                                    </Typography>
                                </TableCell>

                                {/* Número Actual */}
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="primary">
                                        {series.current_number}
                                    </Typography>
                                </TableCell>

                                {/* Términos */}
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {series.terms || "-"}
                                    </Typography>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Tooltip title="Editar serie">
                                        <IconButton size="small">
                                            <FuseSvgIcon size={20}>
                                                heroicons-outline:pencil-square
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar serie">
                                        <IconButton size="small" color="error">
                                            <FuseSvgIcon size={20}>
                                                heroicons-outline:trash
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!numberSeries || numberSeries.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay series numéricas disponibles
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateNumberSeriesModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </Box>
    );
}
