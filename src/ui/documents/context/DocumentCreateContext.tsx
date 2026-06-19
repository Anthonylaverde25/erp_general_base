import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, UseFormReturn, useWatch } from "react-hook-form";
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
import useActiveCompany from "@/features/companies/useActiveCompany";
import axiosInstance from "@/lib/@axios";

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
    stockConflicts: any[] | null;
    setStockConflicts: React.Dispatch<React.SetStateAction<any[] | null>>;
    lineStockWarnings: Record<string, {
        available_stock: number;
        is_insufficient: boolean;
        deficit: number;
        alternative_stores: any[];
        store_id: number;
        store_name: string;
        is_resolved?: boolean;
    }>;
    setLineStockWarnings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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
    let formLines: any = undefined;
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
    const [stockConflicts, setStockConflicts] = useState<any[] | null>(null);

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
    formLines = useWatch({
        control: methods.control,
        name: "lines",
    });

    const activeCompany = useActiveCompany();
    const defaultStoreId = activeCompany?.settings?.defaultStoreId;

    const [lineStockWarnings, setLineStockWarnings] = useState<Record<string, {
        available_stock: number;
        is_insufficient: boolean;
        deficit: number;
        alternative_stores: any[];
        store_id: number;
        store_name: string;
        is_resolved?: boolean;
    }>>({});

    const checkLineStock = async (lineId: string, itemId: number, storeId: number, quantity: number) => {
        try {
            const response = await axiosInstance.get(`/items/${itemId}/stock-availability`, {
                params: {
                    store_id: storeId,
                    quantity: quantity
                }
            });
            const data = response.data;
            setLineStockWarnings(prev => {
                const updated = { ...prev };
                if (data.is_insufficient) {
                    updated[lineId] = {
                        available_stock: data.available_stock,
                        is_insufficient: true,
                        deficit: data.deficit,
                        alternative_stores: data.alternative_stores,
                        store_id: storeId,
                        store_name: data.store_name
                    };
                } else {
                    delete updated[lineId];
                }
                return updated;
            });
        } catch (error) {
            console.error("Failed to check line stock:", error);
        }
    };

    const removeLineStockWarning = (lineId: string) => {
        setLineStockWarnings(prev => {
            const updated = { ...prev };
            if (updated[lineId]) {
                delete updated[lineId];
                return updated;
            }
            return prev;
        });
    };

    // Debounced stock checker
    useEffect(() => {
        // Do not check stock if loading, itemType is service, or it is a purchase document
        if (isLoadingDocument || itemType !== "product" || operation === "purchase") return;

        const timer = setTimeout(() => {
            if (!formLines || formLines.length === 0) return;

            // Clean up warnings for deleted lines
            const currentLineIds = new Set(formLines.map((l: any) => l.id));
            setLineStockWarnings(prev => {
                const updated = { ...prev };
                let changed = false;
                Object.keys(updated).forEach(id => {
                    if (!currentLineIds.has(id)) {
                        delete updated[id];
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });

            // Check stock for each active line
            formLines.forEach((line: any) => {
                const itemId = Number(line.item_id);
                const qty = Number(line.quantity);
                const targetStoreId = Number(line.store_id || defaultStoreId);

                if (itemId && qty > 0 && targetStoreId) {
                    checkLineStock(line.id, itemId, targetStoreId, qty);
                } else {
                    if (line.id) {
                        removeLineStockWarning(line.id);
                    }
                }
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [formLines, defaultStoreId, itemType, isLoadingDocument, operation]);

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
    const totals = useDocumentTotals(formLines);

    // ─── Submit ─────────────────────────────────────────────────────────────
    const { submitWithStatus, isPending: isCreating } = useDocumentSubmit({
        operation,
        isEditMode,
        documentId,
        fromDocumentId,
        fromDocumentIds,
        itemType,
        documentTypeCode: currentDocumentType?.code,
        setStockConflicts,
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
        (errors) => {
            console.error("Validation Errors on Issue:", errors);
            if (errors.due_date) {
                alert(errors.due_date.message);
            } else {
                alert("Por favor, revise los errores en el formulario.");
            }
        }
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
        stockConflicts,
        setStockConflicts,
        lineStockWarnings,
        setLineStockWarnings,
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
