import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Stack,
    Button,
    useTheme,
    alpha,
    IconButton,
    Tooltip,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useIndexTaxRates } from "@/features/tax_rates/hooks/useIndexTaxRates";
import { TaxRateEntity } from "@/domain/entities/tax_rates/TaxRateEntity";
import { TaxRatesModal } from "./modals/TaxRatesModal";

export default function TaxRatesTabView() {
    const theme = useTheme();
    const { data: taxRates, isLoading } = useIndexTaxRates();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRateEntity | null>(null);

    const handleCreate = () => {
        setSelectedTaxRate(null);
        setIsModalOpen(true);
    };

    const handleEdit = (taxRate: TaxRateEntity) => {
        setSelectedTaxRate(taxRate);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTaxRate(null);
    };

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
                    Create Tax Rate
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
                            <TableCell sx={{ pl: 3, fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Percentage (%)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Tax Type</TableCell>
                            <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Loading tax rates...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : taxRates && taxRates.length > 0 ? (
                            taxRates.map((taxRate) => (
                                <TableRow
                                    key={taxRate.id}
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
                                    <TableCell sx={{ pl: 3 }}>{taxRate.name}</TableCell>
                                    <TableCell>{taxRate.percentage}%</TableCell>
                                    <TableCell>{taxRate.tax_type?.name || "-"}</TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleEdit(taxRate)}
                                                >
                                                    <FuseSvgIcon size={20}>
                                                        heroicons-outline:pencil-square
                                                    </FuseSvgIcon>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => console.log("Delete tax rate", taxRate.id)}
                                                >
                                                    <FuseSvgIcon size={20}>
                                                        heroicons-outline:trash
                                                    </FuseSvgIcon>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No tax rates available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TaxRatesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedTaxRate}
            />
        </Box>
    );
}
