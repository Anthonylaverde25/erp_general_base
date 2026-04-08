import React, { createContext, useContext, useEffect, useMemo } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { useParams, useSearchParams } from "react-router";

import { type DocumentFormValues } from "../schemas/documentSchema";
import {
    COPY_BY_OPERATION,
    getDocumentTypeCopy,
    type DocumentCreateCopy,
    type DocumentFooterTotals,
    type DocumentOperation,
} from "../components/create-document/types";

import { useDocumentForm } from "../hooks/useDocumentForm";
import { useDocumentNumberSeries } from "../hooks/useDocumentNumberSeries";
import { useDocumentTotals } from "../hooks/useDocumentTotals";
import { useDocumentSubmit } from "../hooks/useDocumentSubmit";

import useIndexDocumentTypesByModule from "@/features/document_types/hooks/useIndexDocumentTypesByModule";
import { useIndexPartners } from "@/features/partners/hooks/useIndexPartners";
import { useGetDocument } from "@/features/documents/hooks/useGetDocument";
import { useGetDocuments } from "@/features/documents/hooks/useGetDocuments";
import useIndexNumberSeries from "@/features/number_series/hooks/useIndexNumberSeries";
import { NumberSeriesEntity } from "@/domain/entities/number_series/NumberSeriesEntity";

// ─── Context Types ────────────────────────────────────────────────────────────

interface DocumentCreateContextValue {
    methods: UseFormReturn<DocumentFormValues>;
    onSubmitDraft: (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmitIssue: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isCreating: boolean;
    partnerOptions: { id: string | number; name: string; cif?: string; vat_number?: string }[];
    numberSeries: NumberSeriesEntity[];
    currentDocumentType: any;
    copy: DocumentCreateCopy;
    totals: DocumentFooterTotals;
    isDraftMode: boolean;
    itemType: "product" | "service";
    operation: DocumentOperation;
    isEditMode: boolean;
    isLoadingDocument: boolean;
    isReadOnly: boolean;
    isRestricted: boolean;
    sourcePartner?: { id: string | number; name: string; cif?: string; vat_number?: string };
}

const DocumentCreateContext = createContext<DocumentCreateContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DocumentCreateProvider({
    children,
    operation,
    documentId,
}: {
    children: React.ReactNode;
    operation: DocumentOperation;
    documentId?: string;
}) {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const itemType = (searchParams.get("item_type") as "service" | "product") || "product";
    const fromDocumentId = searchParams.get("from_document_id");
    const duplicateFromId = searchParams.get("duplicate_from");
    const fromDocumentIds = useMemo(() => {
        const ids = searchParams.get("from_document_ids");
        return ids ? ids.split(",") : [];
    }, [searchParams]);
    const isEditMode = !!documentId;

    // ─── Data fetching ──────────────────────────────────────────────────────
    const { documentTypes } = useIndexDocumentTypesByModule(operation.toUpperCase());
    const partnerType = operation === "sale" ? "customer" : "vendor";
    const { data: partners } = useIndexPartners(partnerType);
    const { data: existingDocument, isLoading: isLoadingExisting } = useGetDocument(documentId || "");
    const { data: sourceDocument, isLoading: isLoadingSource } = useGetDocument(fromDocumentId || "");
    const { data: duplicateSource, isLoading: isLoadingDuplicate } = useGetDocument(duplicateFromId || "");
    const { data: sourceDocuments, isLoading: isLoadingSources } = useGetDocuments(fromDocumentIds);

    const isLoadingDocument = isLoadingExisting || isLoadingSource || isLoadingDuplicate || isLoadingSources;

    const currentDocumentTypeCode = code || documentTypes?.[0]?.code;
    const { numberSeries } = useIndexNumberSeries(currentDocumentTypeCode);

    // ─── Form setup ─────────────────────────────────────────────────────────
    const methods = useDocumentForm({ 
        code, 
        itemType, 
        isEditMode, 
        existingDocument, 
        sourceDocument: sourceDocument || duplicateSource, 
        sourceDocuments 
    });
    const { watch, setValue, handleSubmit } = methods;
    const formLines = watch("lines");
    const applyRetention = watch("apply_retention");

    // ─── Current document type ───────────────────────────────────────────────
    const currentDocumentType = useMemo(() => {
        if (!documentTypes) return null;
        if (code) return documentTypes.find((t) => t.code === code) ?? documentTypes[0];
        return documentTypes[0];
    }, [documentTypes, code]);

    useEffect(() => {
        if (currentDocumentType?.id) {
            setValue("document_type_code", currentDocumentType.code);
        }
    }, [currentDocumentType, setValue]);

    // ─── Auto-numbering (create mode only) ──────────────────────────────────
    useDocumentNumberSeries({ numberSeries, isEditMode, watch, setValue });

    // ─── Totals ─────────────────────────────────────────────────────────────
    const totals = useDocumentTotals(formLines, applyRetention);

    // ─── Submit ─────────────────────────────────────────────────────────────
    const { submitWithStatus, isPending: isCreating } = useDocumentSubmit({
        operation,
        isEditMode,
        documentId,
        fromDocumentId,
        fromDocumentIds,
        itemType,
        documentTypeCode: currentDocumentType?.code
    });

    // ─── Partner options ─────────────────────────────────────────────────────
    const partnerOptions = useMemo(
        () => partners?.map((p) => ({ id: p.id!, name: p.name, cif: p.cif, vat_number: p.vat_number })) || [],
        [partners],
    );

    const sourcePartner = useMemo(() => {
        const source = sourceDocument || duplicateSource;
        if (source) {
            return {
                id: source.partner_id!,
                name: source.partner_name || "",
                cif: source.partner_cif || "",
                vat_number: source.partner_vat_number || ""
            };
        }
        if (sourceDocuments && sourceDocuments.length > 0) {
            const first = sourceDocuments[0];
            return {
                id: first.partner_id!,
                name: first.partner_name || "",
                cif: first.partner_cif || "",
                vat_number: first.partner_vat_number || ""
            };
        }
        return undefined;
    }, [sourceDocument, duplicateSource, sourceDocuments]);

    const copy = useMemo(() => {
        const baseCopy = COPY_BY_OPERATION[operation];
        const typeCode = code || currentDocumentType?.code;
        return getDocumentTypeCopy(operation, typeCode, baseCopy);
    }, [operation, currentDocumentType, code]);

    const isDraftMode = operation === "sale" && mode === "draft";

    const onSubmitDraft = async (e?: React.BaseSyntheticEvent) => {
        const values = methods.getValues();
        // For draft, we don't strictly require series selection via Zod but we allow it
        // We bypass standard handleSubmit validation if needed, or use a partial one
        return submitWithStatus("draft")(values);
    };

    const onSubmitIssue = handleSubmit(
        async (values) => {
            const nextStatus = copy.nextStatus || "issued";
            // Mandatory check for series ONLY on non-draft sales flows that require numbering
            if (operation === 'sale' && !values.number_series_id && !['QUO', 'DLV'].includes(currentDocumentType?.code)) {
                alert("Para procesar el documento es obligatorio seleccionar una serie de numeración.");
                return;
            }
            return submitWithStatus(nextStatus)(values);
        },
        (errors) => console.error("Validation Errors on Issue:", errors)
    );

    const value: DocumentCreateContextValue = {
        methods,
        onSubmitDraft,
        onSubmitIssue,
        isCreating,
        partnerOptions,
        sourcePartner,
        numberSeries: numberSeries || [],
        currentDocumentType,
        copy,
        totals,
        isDraftMode,
        itemType,
        operation,
        isEditMode,
        isLoadingDocument,
        isReadOnly: isEditMode && !["draft", "validated"].includes(existingDocument?.status?.key || ""),
        isRestricted: isEditMode && existingDocument?.status?.key === "validated",
    };

    return (
        <DocumentCreateContext.Provider value={value}>
            <FormProvider {...methods}>
                {children}
            </FormProvider>
        </DocumentCreateContext.Provider>
    );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useDocumentCreate() {
    const context = useContext(DocumentCreateContext);
    if (!context) {
        throw new Error("useDocumentCreate debe usarse dentro de DocumentCreateProvider");
    }
    return context;
}
