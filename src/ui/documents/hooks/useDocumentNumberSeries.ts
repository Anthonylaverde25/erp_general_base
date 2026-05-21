import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { DocumentFormValues } from "../schemas/documentSchema";
import type { NumberSeriesEntity } from "@/domain/entities/number_series/NumberSeriesEntity";

interface UseDocumentNumberSeriesOptions {
    numberSeries: NumberSeriesEntity[] | undefined;
    isEditMode: boolean;
    watch: UseFormWatch<DocumentFormValues>;
    setValue: UseFormSetValue<DocumentFormValues>;
}

/**
 * Automatically selects the first number series and generates
 * the next document number when in create mode.
 */
export function useDocumentNumberSeries({
    numberSeries,
    isEditMode,
    watch,
    setValue,
}: UseDocumentNumberSeriesOptions) {
    const selectedNumberSeries = watch("number_series_id");

    useEffect(() => {
        if (isEditMode || !numberSeries || numberSeries.length === 0) return;

        // If no series is selected, select the first one by default
        if (!selectedNumberSeries) {
            setValue("number_series_id", String(numberSeries[0].id));
            return;
        }

        // Si el usuario ha seleccionado una serie, previsualizamos el numero
        const activeSeries = numberSeries.find(
            (ns) => String(ns.id) === String(selectedNumberSeries),
        );

        if (activeSeries) {
            const nextNum = String(activeSeries.current_number + 1).padStart(6, "0");
            setValue("number", `${activeSeries.serie}-${activeSeries.year}-${nextNum}`);
        } else {
            setValue("number", "");
        }
    }, [numberSeries, selectedNumberSeries, setValue, isEditMode]);
}
