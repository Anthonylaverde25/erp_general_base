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
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { TaxRateEntity } from "@/domain/entities/tax_rates/TaxRateEntity";

interface TaxRatesTableProps {
    taxRates: TaxRateEntity[] | undefined;
    onEdit: (taxRate: TaxRateEntity) => void;
    onDelete: (id: number) => void;
}

export default function TaxRatesTable(props: TaxRatesTableProps) {
    const { taxRates, onEdit, onDelete } = props;
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
                        <TableCell sx={{ pl: 3, fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Percentage (%)</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tax Type</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {taxRates && taxRates.length > 0 ? (
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
                                <TableCell sx={{ pl: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {taxRate.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>No aplica</TableCell>
                                <TableCell>{taxRate.percentage}%</TableCell>
                                <TableCell>{taxRate.tax_type?.name || "-"}</TableCell>
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => onEdit(taxRate)}
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
                                                onClick={() => onDelete(taxRate.id!)}
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
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No tax rates available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
