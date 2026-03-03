import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams, useNavigate } from "react-router";
import {
    documentSchema,
    type DocumentFormValues,
} from "../schemas/documentSchema";
import {
    COPY_BY_OPERATION,
    CURRENCY_OPTIONS,
    makeEmptyLine,
    type DocumentOperation,
    type DocumentCreateCopy,
    type DocumentFooterTotals,
} from "../components/create-document/types";
import useIndexDocumentTypesByModule from "@/features/document_types/hooks/useIndexDocumentTypesByModule";
import { useIndexPartners } from "@/features/partners/hooks/useIndexPartners";
import { useCreateDocument } from "@/features/documents/hooks/useCreateDocument";
import useIndexNumberSeries from "@/features/number_series/hooks/useIndexNumberSeries";
import { NumberSeriesEntity } from "@/domain/entities/number_series/NumberSeriesEntity";

interface DocumentCreateContextValue {
    methods: UseFormReturn<DocumentFormValues>;
    onSubmitDraft: (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmitIssue: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isCreating: boolean;
    partnerOptions: { id: string | number; name: string }[];
    numberSeries: NumberSeriesEntity[];
    currentDocumentType: any;
    copy: DocumentCreateCopy;
    totals: DocumentFooterTotals;
    isDraftMode: boolean;
    itemType: "item" | "service";
    operation: DocumentOperation;
}

const DocumentCreateContext = createContext<DocumentCreateContextValue | undefined>(undefined);

export function DocumentCreateProvider({
    children,
    operation,
}: {
    children: React.ReactNode;
    operation: DocumentOperation;
}) {
    const navigate = useNavigate();
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const itemType = (searchParams.get("item_type") as "service" | "item") || "item";

    const { documentTypes } = useIndexDocumentTypesByModule(operation.toUpperCase());
    const partnerType = operation === "sale" ? "customer" : "vendor";
    const { data: partners } = useIndexPartners(partnerType);
    const { mutate: createDocument, isPending: isCreating } = useCreateDocument();

    const currentDocumentTypeCode = code || documentTypes?.[0]?.code;
    const { numberSeries } = useIndexNumberSeries(currentDocumentTypeCode);

    const methods = useForm<DocumentFormValues>({
        resolver: zodResolver(documentSchema),
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

    const { watch, setValue, handleSubmit } = methods;
    const selectedNumberSeries = watch("number_series_id");
    const formLines = watch("lines");
    const applyRetention = watch("apply_retention");

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

    useEffect(() => {
        if (numberSeries && numberSeries.length > 0) {
            const activeSeriesId = selectedNumberSeries || numberSeries[0].id;
            if (!selectedNumberSeries) setValue("number_series_id", activeSeriesId);

            const activeSeries = numberSeries.find(
                (ns) => String(ns.id) === String(activeSeriesId),
            );
            if (activeSeries) {
                const nextNum = String(activeSeries.current_number + 1).padStart(4, "0");
                setValue("number", `${activeSeries.serie}-${activeSeries.year}-${nextNum}`);
            }
        }
    }, [numberSeries, selectedNumberSeries, setValue]);

    // Dynamic Totals Calculation
    const totals = useMemo(() => {
        let taxBaseValue = 0;
        let taxAmountValue = 0;

        formLines.forEach((line) => {
            const qty = Number(line.quantity) || 0;
            const price = Number(line.unitPrice) || 0;
            const disc = Number(line.discount) || 0;

            const lineBase = qty * price * (1 - disc / 100);
            taxBaseValue += lineBase;

            // Calculate taxes for this line
            line.taxes.forEach((tax) => {
                taxAmountValue += lineBase * (tax.rate / 100);
            });
        });

        const withholdingValue = applyRetention ? taxBaseValue * 0.15 : 0;
        const netValue = taxBaseValue + taxAmountValue - withholdingValue;

        const formatter = new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        });

        return {
            taxBase: formatter.format(taxBaseValue),
            taxAmount: formatter.format(taxAmountValue),
            withholding: formatter.format(-withholdingValue),
            netPayable: formatter.format(netValue),
        };
    }, [formLines, applyRetention]);

    const buildPayload = (data: DocumentFormValues, status: 'draft' | 'issued') => ({
        ...data,
        status,
        lines: data.lines
            .filter((i) => i.code || i.description)
            .map((i) => ({
                item_id: i.item_id || null,
                name: i.code,
                description: i.description,
                quantity: Number(i.quantity),
                unit_price: Number(i.unitPrice),
                discount_percentage: Number(i.discount),
                tax_rates: i.taxes.map(t => t.id)
            })),
    });

    const submitWithStatus = (status: 'draft' | 'issued') => (data: DocumentFormValues) => {
        createDocument(buildPayload(data, status) as any, {
            onSuccess: () => {
                navigate(`/${operation === "sale" ? "sales" : "purchases"}`);
            },
        });
    };

    const partnerOptions = useMemo(() => {
        return partners?.map((p) => ({ id: p.id!, name: p.name })) || [];
    }, [partners]);

    const copy = COPY_BY_OPERATION[operation];
    const isDraftMode = operation === "sale" && mode === "draft";

    const value: DocumentCreateContextValue = {
        methods,
        onSubmitDraft: handleSubmit(submitWithStatus('draft')),
        onSubmitIssue: handleSubmit(submitWithStatus('issued')),
        isCreating,
        partnerOptions,
        numberSeries: numberSeries || [],
        currentDocumentType,
        copy,
        totals,
        isDraftMode,
        itemType,
        operation,
    };

    return (
        <DocumentCreateContext.Provider value={value}>
            <FormProvider {...methods}>
                {children}
            </FormProvider>
        </DocumentCreateContext.Provider>
    );
}

export function useDocumentCreate() {
    const context = useContext(DocumentCreateContext);
    if (!context) {
        throw new Error("useDocumentCreate debe usarse dentro de DocumentCreateProvider");
    }
    return context;
}
