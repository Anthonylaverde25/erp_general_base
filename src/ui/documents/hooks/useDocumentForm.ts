import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, type DocumentFormValues } from "../schemas/documentSchema";
import { CURRENCY_OPTIONS, makeEmptyLine, type DocumentOperation } from "../components/create-document/types";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

/** Extracts yyyy-MM-dd from an ISO datetime string or returns today */
function extractDate(d: string | null): string {
    if (!d) return new Date().toISOString().split("T")[0];
    return d.split("T")[0];
}

/** Maps a DocumentEntity (API) → DocumentFormValues (react-hook-form) */
export function mapDocumentToFormValues(doc: DocumentEntity): Partial<DocumentFormValues> {
    return {
        partner_id: doc.partner_id ?? "",
        document_type_code: doc.document_type_code || "",
        number_series_id: doc.number_series_id ?? "",
        issue_date: extractDate(doc.issue_date_raw),
        due_date: doc.due_date_raw ? extractDate(doc.due_date_raw) : "",
        number: doc.number_serie || "",
        currency: CURRENCY_OPTIONS[0],
        notes: doc.notes || "",
        tag: "",
        include_legal: false,
        apply_retention: true,
        auto_send: false,
        item_type: "product",
        lines: doc.lines.length > 0
            ? doc.lines.map((line: any) => ({
                id: String(line.id),
                item_id: line.item_id ?? undefined,
                code: line.name || "",
                description: line.description || "",
                quantity: String(line.quantity),
                unitPrice: String(line.unit_price),
                discount: String(line.discount_percentage ?? 0),
                taxes: line.taxes ? line.taxes.map((t: any) => ({
                    id: t.tax_rate_id ?? t.id ?? 0,
                    name: t.name ?? "",
                    rate: t.percentage ?? 0,
                })) : [],
                subtotal: String(line.line_subtotal),
            }))
            : [],
    };
}

/** Maps a DocumentEntity (API) → DocumentFormValues for PRE-FILLING a new document (e.g. Albaran -> Factura) */
export function mapSourceDocumentToFormValues(doc: DocumentEntity, targetCode: string): Partial<DocumentFormValues> {
    const base = mapDocumentToFormValues(doc);
    return {
        ...base,
        document_type_code: targetCode,
        number_series_id: "", // Let the user or auto-select choose the series
        number: "",
        issue_date: new Date().toISOString().split("T")[0], // Today
        due_date: "", // User must re-calculate or input
    };
}

interface UseDocumentFormOptions {
    code?: string;
    itemType: "product" | "service";
    isEditMode: boolean;
    existingDocument: DocumentEntity | undefined;
    sourceDocument?: DocumentEntity | undefined;
}

/**
 * Sets up react-hook-form for document create/edit.
 * Uses the `values` prop to auto-sync the form when `existingDocument` loads.
 */
export function useDocumentForm({ code, itemType, isEditMode, existingDocument, sourceDocument }: UseDocumentFormOptions) {
    const existingFormValues = useMemo<Partial<DocumentFormValues> | undefined>(() => {
        if (isEditMode && existingDocument) {
            return mapDocumentToFormValues(existingDocument);
        }
        if (!isEditMode && sourceDocument && code) {
            return mapSourceDocumentToFormValues(sourceDocument, code);
        }
        return undefined;
    }, [isEditMode, existingDocument, sourceDocument, code]);

    const methods = useForm<DocumentFormValues>({
        resolver: zodResolver(documentSchema),
        // `values` causes RHF to auto-reset the entire form (incl. useFieldArray) when data changes
        values: existingFormValues as DocumentFormValues | undefined,
        defaultValues: {
            partner_id: "",
            document_type_code: code || "",
            number_series_id: "",
            issue_date: new Date().toISOString().split("T")[0],
            due_date: "",
            number: "",
            currency: CURRENCY_OPTIONS[0],
            notes: "",
            tag: "",
            include_legal: false,
            apply_retention: true,
            auto_send: false,
            item_type: itemType,
            lines: [makeEmptyLine(0), makeEmptyLine(1)],
        },
    });

    return methods;
}
