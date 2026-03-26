import { CompanyEntity } from "@/domain/entities/companies/Company";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

interface QuoteStatusWatermarkProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
  isFirstPage: boolean;
}

export function QuoteStatusWatermark({
  document,
  activeCompany,
  isFirstPage,
}: QuoteStatusWatermarkProps) {
  const isQuote =
    document.document_type_code === "QUO" ||
    document.document_type_code === "PQUO";
  const isStampedStatus =
    document.status?.key === "approved" || document.status?.key === "rejected";

  if (!isFirstPage || !isQuote || !isStampedStatus) return null;

  const isApproved = document.status?.key === "approved";

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-[0.12] dark:opacity-[0.22] rotate-[-35deg] border-[12px] rounded-2xl px-12 py-6 flex flex-col items-center select-none
      ${isApproved ? "border-emerald-600" : "border-red-600"}`}
    >
      <h1
        className={`text-9xl font-black tracking-tighter uppercase mb-2 ${
          isApproved ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {isApproved ? "Aprobado" : "Rechazado"}
      </h1>
      <div
        className={`text-2xl font-bold uppercase tracking-[0.5em] ${
          isApproved ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {activeCompany?.name}
      </div>
    </div>
  );
}
