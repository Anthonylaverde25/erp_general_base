import { useMemo } from "react";
import type { DocumentFormValues } from "../schemas/documentSchema";
import type { DocumentFooterTotals } from "../components/create-document/types";

const eurFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
});

/**
 * Computes formatted footer totals (taxBase, taxAmount, withholding, netPayable)
 * reactively from the current form line values.
 */
export function useDocumentTotals(
    formLines: DocumentFormValues["lines"],
    applyRetention: boolean,
): DocumentFooterTotals {
    return useMemo(() => {
        let taxBaseValue = 0;
        let taxAmountValue = 0;

        (formLines ?? []).forEach((line) => {
            const qty = Number(line.quantity) || 0;
            const price = Number(line.unitPrice) || 0;
            const disc = Number(line.discount) || 0;

            const lineBase = qty * price * (1 - disc / 100);
            taxBaseValue += lineBase;

            (line.taxes ?? []).forEach((tax) => {
                taxAmountValue += lineBase * (tax.rate / 100);
            });
        });

        const withholdingValue = applyRetention ? taxBaseValue * 0.15 : 0;
        const netValue = taxBaseValue + taxAmountValue - withholdingValue;

        return {
            taxBase: eurFormatter.format(taxBaseValue),
            taxAmount: eurFormatter.format(taxAmountValue),
            withholding: eurFormatter.format(-withholdingValue),
            netPayable: eurFormatter.format(netValue),
        };
    }, [formLines, applyRetention]);
}
