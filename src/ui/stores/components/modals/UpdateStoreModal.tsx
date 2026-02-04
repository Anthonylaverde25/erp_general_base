import { Dialog, DialogContent } from "@mui/material";
import UpdateStoreForm from "../forms/UpdateStoreForm";

interface UpdateStoreModalProps {
    open: boolean;
    onClose: () => void;
    storeId: number;
}

export default function UpdateStoreModal({
    open,
    onClose,
    storeId,
}: UpdateStoreModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <UpdateStoreForm
                    storeId={storeId}
                    onCancel={onClose}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
