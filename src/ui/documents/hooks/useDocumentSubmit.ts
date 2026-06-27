import { useNavigate } from "react-router";
import type { DocumentFormValues } from "../schemas/documentSchema";
import type { DocumentOperation } from "../components/create-document/types";
import { useCreateDocument } from "@/features/documents/hooks/useCreateDocument";
import { useUpdateDocument } from "@/features/documents/hooks/useUpdateDocument";
import { useTenantModules } from "@/contexts/TenantModulesContext";

function buildPayload(data: DocumentFormValues, statusKey: string, itemType: string, typeCode?: string, operation?: DocumentOperation) {
    let finalStatus = statusKey;
    const effectiveTypeCode = data.document_type_code || typeCode;
    const isPurchase = operation === 'purchase';
    
    // If issuing (not draft) and it's a delivery note or quote, use standard keys
    if (statusKey === 'issued' && effectiveTypeCode) {
        if (effectiveTypeCode === 'DLV' || effectiveTypeCode.endsWith('DLV')) {
            // Purchase Delivery Note (PDLV) -> received
            // Sales Delivery Note (DLV, SDLV, PRDLV) -> delivered
            finalStatus = effectiveTypeCode === 'PDLV' ? 'received' : 'delivered';
        } else if (effectiveTypeCode === 'QUO' || effectiveTypeCode === 'PQUO') {
            // Quotes (QUO, PQUO) -> approved
            finalStatus = 'approved';
        }
    }

    return {
        ...data,
        status_key: finalStatus,
        // Architectural improvement: Map manual number to external_reference for purchases
        external_reference: isPurchase ? data.number : undefined,
        number: isPurchase ? undefined : data.number,
        item_type: itemType === 'service' ? 'service' : 'product',
        lines: data.lines
            .filter((i) => i.code || i.description)
            .map((i) => ({
                item_id: i.item_id || null,
                store_id: i.store_id ? Number(i.store_id) : null,
                name: i.code,
                description: i.description,
                quantity: Number(i.quantity),
                unit_price: Number(i.unitPrice),
                discount_percentage: Number(i.discount),
                tax_rates: i.taxes.map((t) => t.id),
                source_document_id: i.source_document_id ? Number(i.source_document_id) : null,
                serial_numbers: i.serial_numbers || [],
            })),
    };
}

interface UseDocumentSubmitOptions {
    operation: DocumentOperation;
    isEditMode: boolean;
    documentId?: string;
    fromDocumentId?: string | null;
    fromDocumentIds?: string[];
    itemType: string;
    documentTypeCode?: string;
    setStockConflicts?: (conflicts: any[] | null) => void;
}

/**
 * Returns submit handlers for draft and issue actions.
 * Automatically dispatches create or update depending on isEditMode.
 */
export function useDocumentSubmit({ 
    operation, 
    isEditMode, 
    documentId, 
    fromDocumentId, 
    fromDocumentIds,
    itemType,
    documentTypeCode,
    setStockConflicts
}: UseDocumentSubmitOptions) {
    const navigate = useNavigate();
    const { mutate: createDocument, isPending: isCreatingNew } = useCreateDocument();
    const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();
    const { hasModule } = useTenantModules();

    const basePath = operation === "sale" ? "sales" : "purchases";

    const submitWithStatus = (statusKey: "draft" | "issued" | string) => (data: DocumentFormValues) => {
        // Module validation (defense in depth)
        if (operation === 'sale' && !hasModule('sales')) {
            alert('El módulo de Ventas no está habilitado para esta empresa.');
            return;
        }
        if (operation === 'purchase' && !hasModule('purchases')) {
            alert('El módulo de Compras no está habilitado para esta empresa.');
            return;
        }

        if (statusKey !== "draft" && operation === "sale" && !data.number_series_id) {
            alert("Debe seleccionar una Serie de Numeración para emitir o validar este documento.");
            return;
        }

        // Validate serial numbers for serialized items in sales (stock-affecting statuses)
        if (statusKey !== "draft" && operation === "sale") {
            for (let idx = 0; idx < data.lines.length; idx++) {
                const line = data.lines[idx];
                if (line.has_serials && line.item_id) {
                    const requiredQty = Math.max(1, Math.floor(Number(line.quantity) || 1));
                    const enteredQty = line.serial_numbers?.length || 0;
                    if (enteredQty !== requiredQty) {
                        alert(`Debe ingresar exactamente ${requiredQty} números de serie para el artículo "${line.code || line.description}". (Ingresados: ${enteredQty})`);
                        return;
                    }
                }
            }
        }

        const payload = buildPayload(data, statusKey, itemType, documentTypeCode, operation) as any;

        if (isEditMode && documentId) {
            updateDocument({ id: documentId, data: payload }, {
                onSuccess: (res) => navigate(`/${basePath}/view/${res.id}`),
                onError: (error: any) => {
                    const conflicts = error.response?.data?.errors?.stock_conflicts;
                    if (conflicts && conflicts.length > 0 && setStockConflicts) {
                        setStockConflicts(conflicts);
                    } else {
                        const errMsg = error.response?.data?.message || "Error al actualizar el documento.";
                        alert(errMsg);
                    }
                }
            });
        } else {
            // Priority: Multiple IDs (Aggregation) then single ID (Conversion)
            if (fromDocumentIds && fromDocumentIds.length > 0) {
                payload.parent_ids = fromDocumentIds.map(id => Number(id));
            } else if (fromDocumentId) {
                payload.parent_ids = [Number(fromDocumentId)];
            }
            
            createDocument(payload, {
                onSuccess: (res) => navigate(`/${basePath}/view/${res.id}`),
                onError: (error: any) => {
                    const conflicts = error.response?.data?.errors?.stock_conflicts;
                    if (conflicts && conflicts.length > 0 && setStockConflicts) {
                        setStockConflicts(conflicts);
                    } else {
                        const errMsg = error.response?.data?.message || "Error al crear el documento.";
                        alert(errMsg);
                    }
                }
            });
        }
    };

    return {
        submitWithStatus,
        isPending: isCreatingNew || isUpdating,
    };
}
