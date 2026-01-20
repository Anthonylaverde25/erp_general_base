import * as React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import CreateUserForm from '../forms/CreateUserForm';

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateUserDialog({
    open,
    onClose,
}: CreateUserDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        // fullWidth
        // maxWidth="md"
        >
            <DialogContent>
                <CreateUserForm onCancel={onClose} onSuccess={onClose} />
            </DialogContent>
        </Dialog>
    );
}
