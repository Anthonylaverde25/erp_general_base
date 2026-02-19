import { useMemo } from "react";
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
    Chip,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";

interface CategoriesTableProps {
    categories: CategoryEntity[] | undefined;
    isLoading?: boolean;
    showParentColumn?: boolean;
    enableGrouping?: boolean;
    onEdit: (category: CategoryEntity) => void;
    onDelete: (id: number) => void;
    onStatusChange: (category: CategoryEntity) => void;
}

export default function CategoriesTable(props: CategoriesTableProps) {
    const { categories, isLoading, showParentColumn = false, enableGrouping = false, onEdit, onDelete, onStatusChange } = props;
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
                        {showParentColumn && (
                            <TableCell sx={{ fontWeight: 700 }}>Parent Category</TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={showParentColumn ? 5 : 4} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Loading categories...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : categories && categories.length > 0 ? (
                        categories.map((category, index) => {
                            const prevCategory = categories[index - 1];
                            const showGroupHeader = enableGrouping && (!prevCategory || prevCategory.parent_id !== category.parent_id);

                            return (
                                <>
                                    {showGroupHeader && (
                                        <TableRow
                                            sx={{
                                                backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                                            }}
                                        >
                                            <TableCell colSpan={showParentColumn ? 5 : 4} sx={{ py: 1, pl: 3 }}>
                                                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                                    {category.parent_name || "Uncategorized"}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow
                                        key={category.id}
                                        hover
                                        sx={{
                                            transition: "all 0.2s ease",
                                            "&:last-child td": { borderBottom: 0 },
                                            "&:nth-of-type(odd)": {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.04), // Keeping 0.04 for now if user wants subtle, but I will prompt to 0.4 if strictly matching.
                                                // Wait, I strictly promised to match BankAccountsTable which has 0.4
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
                                        <TableCell sx={{ pl: enableGrouping ? 5 : 3 }}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {category.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                                {category.description || "-"}
                                            </Typography>
                                        </TableCell>
                                        {showParentColumn && (
                                            <TableCell>
                                                {category.parent_name ? (
                                                    <Chip
                                                        label={category.parent_name}
                                                        size="small"
                                                        variant="outlined"
                                                        color="info"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Switch
                                                checked={category.is_active}
                                                onChange={() => onStatusChange(category)}
                                                inputProps={{ "aria-label": "controlled" }}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => onEdit(category)}
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
                                                        onClick={() => onDelete(category.id)}
                                                    >
                                                        <FuseSvgIcon size={20}>
                                                            heroicons-outline:trash
                                                        </FuseSvgIcon>
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={showParentColumn ? 5 : 4} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No categories available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
