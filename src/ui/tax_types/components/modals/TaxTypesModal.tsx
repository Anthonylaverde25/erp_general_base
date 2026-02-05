
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import TaxTypesForm from "../forms/TaxTypesForm";
import { TaxTypeEntity } from "@/domain/entities/tax_types/TaxTypeEntity";

interface TaxTypesModalProps {
    open: boolean;
    onClose: () => void;
    taxType?: TaxTypeEntity | null;
}

export default function TaxTypesModal({
    open,
    onClose,
    taxType,
}: TaxTypesModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>

            <DialogContent>
                <TaxTypesForm
                    taxType={taxType}
                    onCancel={onClose}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
