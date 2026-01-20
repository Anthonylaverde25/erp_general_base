import { Dialog, DialogContent } from '@mui/material';
import UpdateUserForm from '../forms/UpdateUserForm';
import { UserType } from '@/types/user.types';

interface UpdateUserDialogProps {
    open: boolean;
    onClose: () => void;
    user: UserType;
}

export default function UpdateUserDialog({ open, onClose, user }: UpdateUserDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}

        >
            <DialogContent>
                <UpdateUserForm
                    user={user}
                    onCancel={onClose}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
