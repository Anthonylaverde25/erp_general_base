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
    Switch,
    Stack,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";

interface FamiliesTableProps {
    families: FamilyEntity[] | undefined;
    isLoading?: boolean;
    onEdit: (family: FamilyEntity) => void;
    onDelete: (id: number) => void;
    onStatusChange: (family: FamilyEntity) => void;
}

export default function FamiliesTable(props: FamiliesTableProps) {
    const { families, isLoading, onEdit, onDelete, onStatusChange } = props;
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
                        <TableCell sx={{ fontWeight: 700 }}>Profit %</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tax Rate</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Loading families...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : families && families.length > 0 ? (
                        families.map((family) => (
                            <TableRow
                                key={family.id}
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
                                        {family.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{family.percentage}%</TableCell>
                                <TableCell>
                                    {family.tax_rates?.map((t) => t.name).join(", ") || "-"}
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={family.is_active}
                                        onChange={() => onStatusChange(family)}
                                        inputProps={{ "aria-label": "controlled" }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => onEdit(family)}
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
                                                onClick={() => onDelete(family.id)}
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
                                    No families available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
