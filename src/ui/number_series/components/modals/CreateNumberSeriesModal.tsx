import { Dialog, DialogContent } from "@mui/material";
import CreateNumberSeriesForm from "../forms/CreateNumberSeriesForm";
import useIndexDocumentTypesByCategory from "@/features/document_types/hooks/useIndexDocumentTypesByCategory";

interface CreateNumberSeriesModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateNumberSeriesModal({
    open,
    onClose,
}: CreateNumberSeriesModalProps) {
    const { documentTypes, isLoading } = useIndexDocumentTypesByCategory("sales");

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <CreateNumberSeriesForm
                    onCancel={onClose}
                    onSuccess={onClose}
                    documentTypes={documentTypes}
                    isLoadingDocumentTypes={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
}
