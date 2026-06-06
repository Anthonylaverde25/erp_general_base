import { QRCodeSVG } from "qrcode.react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { formatCurrency } from "./paperUtils";

interface DocumentPageSummaryProps {
  document: DocumentEntity;
  validationUrl: string;
}

export function DocumentPageSummary({
  document,
  validationUrl,
}: DocumentPageSummaryProps) {
  const isCreditNote = document.document_type_code === 'CRN' || document.document_type_code === 'PCN';

  return (
    <div className="flex justify-between items-end mt-8">
      <div className="w-32 h-32 flex flex-col items-center justify-center p-2 border border-slate-200 dark:border-slate-800 rounded bg-white">
        <QRCodeSVG value={validationUrl} size={100} level="M" />
        <span className="text-[7px] text-slate-400 mt-2 uppercase tracking-widest">
          Verificación QR
        </span>
      </div>

      <div className="w-72 space-y-1">
        <div className="flex justify-between text-[11px] px-2 py-1">
          <span className="text-slate-400 uppercase tracking-wider text-[9px]">
            Suma Bases
          </span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">
            {formatCurrency(isCreditNote ? -document.subtotal : document.subtotal)}
          </span>
        </div>

        {document.discount_total > 0 && (
          <div className="flex justify-between text-[11px] px-2 py-1 text-orange-600 dark:text-orange-400">
            <span className="uppercase tracking-wider text-[9px]">
              Total Descuento
            </span>
            <span className="font-bold">
              -{formatCurrency(document.discount_total)}
            </span>
          </div>
        )}

        {document.tax_summaries?.map((tax) => (
          <div
            key={`${tax.name}-${tax.rate}`}
            className="flex justify-between text-[11px] px-2 py-1"
          >
            <span className="text-slate-400 uppercase tracking-wider text-[9px]">
              {tax.name} ({tax.rate}%)
            </span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {formatCurrency(isCreditNote ? -tax.tax_amount : tax.tax_amount)}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center p-3 mt-4 border-t-2 border-[#0f172a] dark:border-blue-500 bg-slate-50 dark:bg-slate-900/50 rounded-b">
          <span className="font-black uppercase text-[11px] tracking-[0.2em] text-[#0f172a] dark:text-white">
            Total Neto
          </span>
          <span className="text-2xl font-black text-[#0f172a] dark:text-white">
            {formatCurrency(isCreditNote ? -document.total : document.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
