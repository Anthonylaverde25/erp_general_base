import { Typography } from "@mui/material";
import { CompanyEntity } from "@/domain/entities/companies/Company";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { formatDate } from "../pdf/PDFUtils";

interface DocumentPaperHeaderProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
  isFirstPage: boolean;
}

export function DocumentPaperHeader({
  document,
  activeCompany,
  isFirstPage,
}: DocumentPaperHeaderProps) {
  if (isFirstPage) {
    return (
      <>
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-10">
          <div className="flex flex-col gap-4">
            {activeCompany?.logo_url ? (
              <img
                src={activeCompany.logo_url}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <Typography
                variant="h5"
                className="font-black text-[#0f172a] dark:text-white tracking-tighter uppercase"
              >
                {activeCompany?.name}
              </Typography>
            )}
            <div className="text-[10px] text-slate-500 leading-relaxed max-w-[250px]">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                {activeCompany?.name}
              </p>
              <p>CIF: {activeCompany?.cif || ""}</p>
              <p>{activeCompany?.address}</p>
            </div>
          </div>

          <div className="text-right">
            <Typography className="text-[#0f172a] dark:text-blue-400 font-black text-3xl mb-4 tracking-widest uppercase">
              {document.document_type_name || "Documento"}
            </Typography>
            <div className="flex gap-10 justify-end">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Nº Documento
                </span>
                <span className="text-[12px] font-black text-[#0f172a] dark:text-white">
                  #{document.number_serie || "(Borrador)"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Fecha
                </span>
                <span className="text-[12px] font-bold text-[#0f172a] dark:text-white">
                  {formatDate(document.issue_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16 mt-10">
          <div>
            <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
              Destinatario / Titular
            </p>
            <p className="font-black text-[15px] text-slate-900 dark:text-white mb-2">
              {document.partner_name}
            </p>
            <div className="text-[12px] text-slate-500 space-y-1">
              <p>{document.partner_address}</p>
              <p>{document.partner_email}</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-400 dark:text-slate-400 uppercase text-[9px] mb-4 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
              Detalles del Documento
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-slate-400">Estado</span>
                <span className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[9px] bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {document.status?.name || "Borrador"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-slate-400">Vencimiento</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {formatDate(document.due_date || document.issue_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
      <div className="flex items-center gap-4">
        {activeCompany?.logo_url ? (
          <img
            src={activeCompany.logo_url}
            alt="Logo"
            className="h-6 w-auto object-contain opacity-50 grayscale"
          />
        ) : (
          <Typography
            variant="caption"
            className="font-bold text-slate-400 uppercase tracking-widest"
          >
            {activeCompany?.name}
          </Typography>
        )}
      </div>
      <div className="text-right flex gap-4 text-[10px] text-slate-500">
        <span>Nº {document.number_serie || "(Borrador)"}</span>
        <span>•</span>
        <span>{formatDate(document.issue_date)}</span>
      </div>
    </div>
  );
}
