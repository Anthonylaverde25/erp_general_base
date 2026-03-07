import React, { createContext, useContext, useEffect, useMemo } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { useParams, useSearchParams } from "react-router";

import { type DocumentFormValues } from "../schemas/documentSchema";
import {
    COPY_BY_OPERATION,
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
    itemType: "item" | "service";
    operation: DocumentOperation;
    isEditMode: boolean;
    isLoadingDocument: boolean;
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
    const itemType = (searchParams.get("item_type") as "service" | "item") || "item";
    const fromDocumentId = searchParams.get("from_document_id");
    const isEditMode = !!documentId;

    // ─── Data fetching ──────────────────────────────────────────────────────
    const { documentTypes } = useIndexDocumentTypesByModule(operation.toUpperCase());
    const partnerType = operation === "sale" ? "customer" : "vendor";
    const { data: partners } = useIndexPartners(partnerType);
    const { data: existingDocument, isLoading: isLoadingExisting } = useGetDocument(documentId || "");
    const { data: sourceDocument, isLoading: isLoadingSource } = useGetDocument(fromDocumentId || "");

    const isLoadingDocument = isLoadingExisting || isLoadingSource;

    const currentDocumentTypeCode = code || documentTypes?.[0]?.code;
    const { numberSeries } = useIndexNumberSeries(currentDocumentTypeCode);

    // ─── Form setup ─────────────────────────────────────────────────────────
    const methods = useDocumentForm({ code, itemType, isEditMode, existingDocument, sourceDocument });
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
    });

    // ─── Partner options ─────────────────────────────────────────────────────
    const partnerOptions = useMemo(
        () => partners?.map((p) => ({ id: p.id!, name: p.name, cif: p.cif, vat_number: p.vat_number })) || [],
        [partners],
    );

    const copy = COPY_BY_OPERATION[operation];
    const isDraftMode = operation === "sale" && mode === "draft";

    const value: DocumentCreateContextValue = {
        methods,
        onSubmitDraft: handleSubmit(submitWithStatus("draft")),
        onSubmitIssue: handleSubmit(submitWithStatus("issued")),
        isCreating,
        partnerOptions,
        numberSeries: numberSeries || [],
        currentDocumentType,
        copy,
        totals,
        isDraftMode,
        itemType,
        operation,
        isEditMode,
        isLoadingDocument,
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
