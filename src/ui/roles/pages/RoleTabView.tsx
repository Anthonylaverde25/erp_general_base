import useIndexRoles from "@/features/roles/hooks/useIndexRoles";
import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import CreateRoleModal from "../components/modals/CreateRoleModal";
import UpdateRoleModal from "../components/modals/UpdateRoleModal";
import RolesTable from "../components/RolesTable";
import { IRole } from "@/types/role.types";

export default function RolesTabView() {
  const theme = useTheme();
  const { roles, isLoading, isError } = useIndexRoles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole["id"] | null>(null);

  const handleEditRole = (roleId: number) => {
    setSelectedRole(roleId);
    setUpdateModalOpen(true);
  };

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    // Implement verification logic here if needed
    console.log('Status change', id, currentStatus);
  };

  if (isLoading)
    return (
      <Box className="flex h-96 items-center justify-center">
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Box className="flex h-96 items-center justify-center">
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
            <FuseSvgIcon size={20}>
              heroicons-outline:plus
            </FuseSvgIcon>
          }
          onClick={() => setCreateModalOpen(true)}
        >
          Crear Rol
        </Button>
      </Stack>

      <RolesTable
        roles={roles}
        onEdit={handleEditRole}
        onDelete={() => { }}
        onStatusChange={handleStatusChange}
      />

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
