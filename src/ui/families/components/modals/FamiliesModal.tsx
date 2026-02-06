import { Dialog, DialogContent } from "@mui/material";
import { FamiliesForm } from "../forms/FamiliesForm";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";

interface FamiliesModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: FamilyEntity | null;
}

export function FamiliesModal({ isOpen, onClose, data }: FamiliesModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogContent>
                <FamiliesForm data={data} onCancel={onClose} />
            </DialogContent>
        </Dialog>
    );
}
