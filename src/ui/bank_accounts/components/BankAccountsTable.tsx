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
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { IBankAccount } from "@/types/bank_account.types";

interface BankAccountsTableProps {
    bankAccounts: IBankAccount[] | undefined;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function BankAccountsTable(props: BankAccountsTableProps) {
    const { bankAccounts, onEdit, onDelete } = props;
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
                        <TableCell sx={{ fontWeight: 700 }}>Titular</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Número de Cuenta</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>SWIFT</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {bankAccounts?.map((bankAccount) => (
                        <TableRow
                            key={bankAccount.id}
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
                                    {bankAccount.name}
                                </Typography>
                            </TableCell>

                            {/* Titular */}
                            <TableCell>
                                <Typography variant="body2">
                                    {bankAccount.account_holder}
                                </Typography>
                            </TableCell>

                            {/* Número de Cuenta */}
                            <TableCell>
                                <Typography variant="body2">
                                    {bankAccount.account_number}
                                </Typography>
                            </TableCell>

                            {/* SWIFT */}
                            <TableCell>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        color: "primary.main",
                                    }}
                                >
                                    {bankAccount.swift}
                                </Typography>
                            </TableCell>

                            {/* Acciones */}
                            <TableCell align="right" sx={{ pr: 3 }}>
                                <Tooltip title="Editar cuenta">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(bankAccount.id)}
                                    >
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:pencil-square
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar cuenta">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(bankAccount.id)}
                                    >
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:trash
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}

                    {(!bankAccounts || bankAccounts.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay cuentas bancarias disponibles
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
