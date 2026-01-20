import { Dialog, DialogContent } from '@mui/material';
import UpdateRoleForm from '../forms/UpdateRoleForm';
import { Role } from '@/types/role.types';

interface UpdateRoleDialogProps {
    open: boolean;
    onClose: () => void;
    role: Role;
}

export default function UpdateRoleDialog({ open, onClose, role }: UpdateRoleDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogContent>
                <UpdateRoleForm
                    role={role}
                    onCancel={onClose}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
