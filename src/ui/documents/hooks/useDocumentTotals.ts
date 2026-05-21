import { useMemo } from "react";
import type { DocumentFormValues } from "../schemas/documentSchema";
import type { DocumentFooterTotals } from "../components/create-document/types";
import { useIndexTaxRates } from "@/features/tax_rates/hooks/useIndexTaxRates";

const eurFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
});

/**
 * Computes formatted footer totals (taxBase, taxAmount, withholding, surcharge, netPayable, hasSurcharge)
 * reactively from the current form line values.
 */
export function useDocumentTotals(
    formLines: DocumentFormValues["lines"],
): DocumentFooterTotals {
    const { data: allTaxRates } = useIndexTaxRates();

    return useMemo(() => {
        let taxBaseValue = 0;
        let taxAmountValue = 0;
        let withholdingValue = 0;
        let surchargeValue = 0;

        (formLines ?? []).forEach((line) => {
            const qty = Number(line.quantity) || 0;
            const price = Number(line.unitPrice) || 0;
            const disc = Number(line.discount) || 0;

            const lineBase = qty * price * (1 - disc / 100);
            taxBaseValue += lineBase;

            (line.taxes ?? []).forEach((tax) => {
                const taxVal = lineBase * (tax.rate / 100);
                
                // Retrieve tax type code from tax item, or lookup in allTaxRates by rate ID
                let typeCode = tax.tax_type_code;
                if (!typeCode && allTaxRates) {
                    const matchedRate = allTaxRates.find((r) => r.id === tax.id);
                    if (matchedRate && matchedRate.tax_type) {
                        typeCode = matchedRate.tax_type.code;
                    }
                }

                if (typeCode === "surcharge") {
                    surchargeValue += taxVal;
                } else if (tax.operation === "subtract" || tax.tax_operation === "subtract" || typeCode === "withholding") {
                    withholdingValue += taxVal;
                } else {
                    taxAmountValue += taxVal;
                }
            });
        });

        const netValue = taxBaseValue + taxAmountValue + surchargeValue - withholdingValue;

        return {
            taxBase: eurFormatter.format(taxBaseValue),
            taxAmount: eurFormatter.format(taxAmountValue),
            withholding: eurFormatter.format(withholdingValue > 0 ? -withholdingValue : 0),
            surcharge: eurFormatter.format(surchargeValue),
            netPayable: eurFormatter.format(netValue),
            hasSurcharge: surchargeValue > 0,
        };
    }, [formLines, allTaxRates]);
}
