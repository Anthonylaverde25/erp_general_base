import { AppFormModal } from "@/components/modals/AppFormModal";
import { PartnersForm } from "../forms/PartnersForm";
import { useShowPartner } from "@/features/partners/hooks/useShowPartner";

interface UpdatePartnerModalProps {
    open: boolean;
    onClose: () => void;
    partnerId?: number;
}

export default function UpdatePartnerModal({
    open,
    onClose,
    partnerId,
}: UpdatePartnerModalProps) {
    if (!partnerId) return null;
    const { partner, isLoading } = useShowPartner(partnerId);

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            key={partnerId}
            maxWidth="md"
            title="Editar Socio"
            hideCancel
            actions={<></>}
        >
            <div className="p-0">
                {isLoading || !partner ? (
                    <div className="p-4 text-center">Cargando...</div>
                ) : (
                    <PartnersForm data={partner} onCancel={onClose} onSuccess={onClose} />
                )}
            </div>
        </AppFormModal>
    );
}
