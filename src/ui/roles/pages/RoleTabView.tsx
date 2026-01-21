import useIndexRoles from "@/features/roles/hooks/useIndexRoles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import CreateRoleModal from "../components/modals/CreateRoleModal";
import UpdateRoleModal from "../components/modals/UpdateRoleModal";
import { RoleType } from "@/types/role.types";

export default function RolesTabView() {
  const theme = useTheme();
  const { roles, isLoading, isError } = useIndexRoles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [assignPermissionsModalOpen, setAssignPermissionsModalOpen] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType["id"] | null>(null);

  const handleEditRole = (roleId: RoleType["id"]) => {
    console.log("Editing role with ID:", roleId);
    setSelectedRole(roleId);
    setUpdateModalOpen(true);
  };

  const handleAssignPermissions = (roleId: RoleType["id"]) => {
    console.log("Assigning permissions to role with ID:", roleId);
    setSelectedRole(roleId);
    setAssignPermissionsModalOpen(true);
  };

  if (isLoading)
    return (
      <Box className="flex h-64 items-center justify-center">
        <Typography color="text.secondary">Cargando roles...</Typography>
      </Box>
    );

  if (isError)
    return (
      <Box className="flex h-64 items-center justify-center">
        <Typography color="error">Error al cargar los roles</Typography>
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
            <FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>
          }
          onClick={() => setCreateModalOpen(true)}
        >
          Crear rol
        </Button>
      </Stack>

      {/* Table Section */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <TableCell sx={{ pl: 3, fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
              <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {roles?.map((role) => (
              <TableRow
                key={role.id}
                hover
                sx={{
                  transition: "all 0.2s ease",
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                {/* Nombre */}
                <TableCell sx={{ pl: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {role.name}
                  </Typography>
                </TableCell>

                {/* Código */}
                <TableCell>
                  <Chip label={role.code} size="small" variant="outlined" />
                </TableCell>

                {/* Descripción */}
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={role.description}
                  >
                    {role.description || "Sin descripción"}
                  </Typography>
                </TableCell>

                {/* Acciones */}
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Tooltip title="Editar rol">
                    <IconButton
                      size="small"
                      onClick={() => handleEditRole(role.id)}
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:pencil-square
                      </FuseSvgIcon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Asignar permisos">
                    <IconButton
                      size="small"
                      onClick={() => handleAssignPermissions(role.id)}
                    >
                      <FuseSvgIcon size={20}>heroicons-outline:key</FuseSvgIcon>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {(!roles || roles.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay roles disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modals */}
      <CreateRoleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {selectedRole && (
        <UpdateRoleModal
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedRole(null);
          }}
          roleId={selectedRole}
        />
      )}
    </Box>
  );
}
