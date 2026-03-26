import { CompanyEntity } from "@/domain/entities/companies/Company";

interface DocumentPageFooterProps {
  activeCompany: CompanyEntity;
  pageIndex: number;
  totalPages: number;
}

export function DocumentPageFooter({
  activeCompany,
  pageIndex,
  totalPages,
}: DocumentPageFooterProps) {
  return (
    <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
      <p className="italic">
        Generado por {activeCompany?.name}. Documento generado electrónicamente.
      </p>
      <p className="font-bold tracking-widest uppercase">
        Página {pageIndex + 1} de {totalPages}
      </p>
    </div>
  );
}
