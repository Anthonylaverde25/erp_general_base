import { Dialog, DialogContent } from "@mui/material";
import UpdateRoleForm from "../forms/UpdateRoleForm";
import useShowRole from "@/features/roles/hooks/useShowRole";
import { RoleType } from "@/types/role.types";

interface UpdateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  roleId?: RoleType["id"];
}

export default function UpdateRoleDialog({
  open,
  onClose,
  roleId,
}: UpdateRoleDialogProps) {
  if (!roleId) return null;
  const { role, isLoading } = useShowRole(roleId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      key={roleId}
    >
      <DialogContent>
        {isLoading || !role ? (
          <div>Cargando...</div>
        ) : (
          <UpdateRoleForm role={role} onCancel={onClose} onSuccess={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
