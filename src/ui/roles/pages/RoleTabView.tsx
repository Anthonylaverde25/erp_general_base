import useIndexRoles from "@/features/roles/hooks/useIndexRoles";
import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState, useEffect } from "react";
import CreateRoleModal from "../components/modals/CreateRoleModal";
import UpdateRoleModal from "../components/modals/UpdateRoleModal";
import RoleListSidebar from "../components/RoleListSidebar";
import RolePermissionMatrix from "../components/RolePermissionMatrix";
import { RoleType } from "@/types/role.types";

export default function RolesTabView() {
  const theme = useTheme();
  const { roles, isLoading, isError } = useIndexRoles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType["id"] | null>(null);

  // Default selection logic
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRole) {
      const superAdmin = roles.find((r) => r.code === "super_admin");
      if (superAdmin) {
        setSelectedRole(superAdmin.id);
      } else {
        setSelectedRole(roles[0].id);
      }
    }
  }, [roles, selectedRole]);

  const handleEditRole = () => {
    if (selectedRole) {
      setUpdateModalOpen(true);
    }
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

  const activeRole = roles?.find((r) => r.id === selectedRole);

  return (
    <Box
      className="flex w-full h-[calc(100vh-200px)] overflow-hidden "
      sx={{ bgcolor: 'background.paper' }}
    >
      {/* Sidebar */}
      <RoleListSidebar
        roles={roles || []}
        selectedRoleId={selectedRole}
        onSelectRole={setSelectedRole}
        onCreateRole={() => setCreateModalOpen(true)}
      />

      {/* Main Content */}
      <Box
        className="flex-1 flex flex-col overflow-hidden"
        sx={{ bgcolor: 'background.default' }}
      >
        {activeRole ? (
          <>
            {/* Role Header */}
            <Box
              className="p-6 border-b"
              sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02) }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Typography variant="h5" fontWeight={700}>
                      {activeRole.name}
                    </Typography>
                    <Chip
                      label={activeRole.code}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontFamily: "monospace",
                      }}
                    />
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {activeRole.description || "Sin descripción disponible para este rol."}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<FuseSvgIcon>heroicons-outline:pencil-square</FuseSvgIcon>}
                  onClick={handleEditRole}
                >
                  Editar Rol
                </Button>
              </Stack>
            </Box>

            {/* Permissions Matrix */}
            <Box className="flex-1 overflow-y-auto">
              <RolePermissionMatrix />
            </Box>
          </>
        ) : (
          <Box className="flex flex-col items-center justify-center h-full text-center p-8">
            <FuseSvgIcon size={64} color="disabled" className="mb-4">
              heroicons-outline:shield-exclamation
            </FuseSvgIcon>
            <Typography variant="h6" color="text.secondary">
              Selecciona un rol para ver sus detalles
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modals */}
      <CreateRoleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {selectedRole && (
        <UpdateRoleModal
          open={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          roleId={selectedRole}
        />
      )}
    </Box>
  );
}
