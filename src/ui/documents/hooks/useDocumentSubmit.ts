import { useNavigate } from "react-router";
import type { DocumentFormValues } from "../schemas/documentSchema";
import type { DocumentOperation } from "../components/create-document/types";
import { useCreateDocument } from "@/features/documents/hooks/useCreateDocument";
import { useUpdateDocument } from "@/features/documents/hooks/useUpdateDocument";

function buildPayload(data: DocumentFormValues, statusKey: "draft" | "issued") {
    return {
        ...data,
        status_key: statusKey,
        lines: data.lines
            .filter((i) => i.code || i.description)
            .map((i) => ({
                item_id: i.item_id || null,
                name: i.code,
                description: i.description,
                quantity: Number(i.quantity),
                unit_price: Number(i.unitPrice),
                discount_percentage: Number(i.discount),
                tax_rates: i.taxes.map((t) => t.id),
            })),
    };
}

interface UseDocumentSubmitOptions {
    operation: DocumentOperation;
    isEditMode: boolean;
    documentId?: string;
    fromDocumentId?: string | null;
}

/**
 * Returns submit handlers for draft and issue actions.
 * Automatically dispatches create or update depending on isEditMode.
 */
export function useDocumentSubmit({ operation, isEditMode, documentId, fromDocumentId }: UseDocumentSubmitOptions) {
    const navigate = useNavigate();
    const { mutate: createDocument, isPending: isCreatingNew } = useCreateDocument();
    const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();

    const basePath = operation === "sale" ? "sales" : "purchases";

    const submitWithStatus = (statusKey: "draft" | "issued") => (data: DocumentFormValues) => {
        if (statusKey !== "draft" && operation === "sale" && !data.number_series_id) {
            alert("Debe seleccionar una Serie de Numeración para emitir o validar este documento.");
            return;
        }

        const payload = buildPayload(data, statusKey) as any;

        if (isEditMode && documentId) {
            updateDocument({ id: documentId, data: payload }, {
                onSuccess: (res) => navigate(`/${basePath}/view/${res.id}`),
            });
        } else {
            if (fromDocumentId) {
                payload.parent_document_id = fromDocumentId;
            }
            createDocument(payload, {
                onSuccess: (res) => navigate(`/${basePath}/view/${res.id}`),
            });
        }
    };

    return {
        submitWithStatus,
        isPending: isCreatingNew || isUpdating,
    };
}
