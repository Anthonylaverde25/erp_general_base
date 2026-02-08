import useIndexBankAccounts from "@/features/bank_accounts/hooks/useIndexBankAccounts";
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
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useEffect, useState } from "react";
import CreateBankAccountModal from "../components/modals/CreateBankAccountModal";
import UpdateBankAccountModal from "../components/modals/UpdateBankAccountModal";
import { IBankAccount } from "@/types/bank_account.types";
import axiosInstance from "@/lib/@axios";

interface BankAccountsTabViewProps {
  createButtonText?: string;
}

export default function BankAccountsTabView({
  createButtonText = "Crear cuenta bancaria",
}: BankAccountsTabViewProps) {
  const theme = useTheme();
  const { bankAccounts, isLoading, isError } = useIndexBankAccounts();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<
    IBankAccount["id"] | null
  >(null);

  const handleEditBankAccount = (bankAccountId: IBankAccount["id"]) => {
    console.log("Editing bank account with ID:", bankAccountId);
    setSelectedBankAccount(bankAccountId);
    setUpdateModalOpen(true);
  };


  // useEffect(() => {
  //   const fetchBankAccounts = async () => {
  //     const response = await axiosInstance.get("payment-methods/");
  //     console.log(response.data);
  //   };
  //   fetchBankAccounts();
  // }, [])

  if (isLoading)
    return (
      <Box className="flex h-64 items-center justify-center">
        <Typography color="text.secondary">
          Cargando cuentas bancarias...
        </Typography>
      </Box>
    );

  if (isError)
    return (
      <Box className="flex h-64 items-center justify-center">
        <Typography color="error">
          Error al cargar las cuentas bancarias
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
              heroicons-outline:building-library
            </FuseSvgIcon>
          }
          onClick={() => setCreateModalOpen(true)}
        >
          {createButtonText}
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
                      onClick={() => handleEditBankAccount(bankAccount.id)}
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:pencil-square
                      </FuseSvgIcon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar cuenta">
                    <IconButton size="small" color="error">
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

      {/* Modals */}
      <CreateBankAccountModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {selectedBankAccount && (
        <UpdateBankAccountModal
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedBankAccount(null);
          }}
          bankAccountId={selectedBankAccount}
        />
      )}
    </Box>
  );
}
