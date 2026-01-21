import { Dialog, DialogContent } from "@mui/material";
import CreateRoleForm from "../forms/CreateRoleForm";

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateRoleDialog({
  open,
  onClose,
}: CreateRoleDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <CreateRoleForm onCancel={onClose} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
