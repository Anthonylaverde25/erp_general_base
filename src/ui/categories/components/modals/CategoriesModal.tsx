import { Dialog, DialogContent } from "@mui/material";
import { CategoriesForm, CategoryFormMode } from "../forms/CategoriesForm";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";

interface CategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: CategoryFormMode;
    data?: CategoryEntity | null;
    initialParent?: CategoryEntity | null;
}

export function CategoriesModal({ isOpen, onClose, mode, data, initialParent }: CategoriesModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogContent>
                <CategoriesForm mode={mode} data={data} initialParent={initialParent} onCancel={onClose} />
            </DialogContent>
        </Dialog>
    );
}
