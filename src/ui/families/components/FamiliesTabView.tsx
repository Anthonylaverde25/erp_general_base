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
    Switch,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useIndexFamilies } from "@/features/families/hooks/useIndexFamilies";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";
import { FamiliesModal } from "./modals/FamiliesModal";
import { useUpdateFamily } from "@/features/families/hooks/useUpdateFamily";
import { useToggleFamilyStatus } from "@/features/families/hooks/useToggleFamilyStatus";

export default function FamiliesTabView() {
    const theme = useTheme();
    const { data: families, isLoading } = useIndexFamilies();
    const updateFamily = useUpdateFamily();
    const toggleFamilyStatus = useToggleFamilyStatus();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<FamilyEntity | null>(null);

    const handleCreate = () => {
        setSelectedFamily(null);
        setIsModalOpen(true);
    };

    const handleEdit = (family: FamilyEntity) => {
        setSelectedFamily(family);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFamily(null);
    };

    const handleStatusChange = (family: FamilyEntity) => {
        toggleFamilyStatus.mutate({
            id: family.id,
            status: !family.is_active,
        });
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
                    Create Family
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
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
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
                                        {family.tax_rate?.name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={family.is_active}
                                            onChange={() => handleStatusChange(family)}
                                            inputProps={{ "aria-label": "controlled" }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleEdit(family)}
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
                                                    onClick={() => console.log("Delete family", family.id)}
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
                                        No families available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <FamiliesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedFamily}
            />
        </Box>
    );
}
