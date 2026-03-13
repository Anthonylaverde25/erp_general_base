import { X, Printer, Download, RefreshCcw, MoreHorizontal, PenLine, Share2 } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { HEADER_BTN_CLASS } from "./DocumentShowHeader.helpers";
import { CompanyEntity } from "@/domain/entities/companies/Company";
import React, { Suspense } from "react";

const PDFDownloadLink = React.lazy(() => import("@react-pdf/renderer").then(m => ({ default: m.PDFDownloadLink })));
const DocumentPDF = React.lazy(() => import("./DocumentPDF"));

interface HeaderTitleProps {
  document: DocumentEntity;
  onClose: () => void;
}

export function HeaderTitle({ document, onClose }: HeaderTitleProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer p-1"
      >
        <X className="w-5 h-5" />
      </button>
      <div className=" p-2 flex flex-col gap-1">
        <div className="">
          <h1 className="text-sm font-bold truncate max-w-[300px] text-gray-900 dark:text-gray-100 leading-tight">
            {document.document_type_name || "Documento"}:{" "}
            {document.partner_name} - {document.number_serie || "Borrador"}
          </h1>
        </div>
      </div>
    </div>
  );
}

interface HeaderActionsProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
  isPrinting: boolean;
  onPrint: () => void;
}

export function HeaderActions({ document, activeCompany, isPrinting, onPrint }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={onPrint} 
        disabled={isPrinting}
        className={HEADER_BTN_CLASS}
      >
        <Printer className="w-3.5 h-3.5" />
        {isPrinting ? "..." : "Imprimir"}
      </button>

      <Suspense fallback={<button className={HEADER_BTN_CLASS} disabled><Download className="w-3.5 h-3.5" />...</button>}>
        <PDFDownloadLink
          document={<DocumentPDF document={document} activeCompany={activeCompany} />}
          fileName={`${document.number_serie || "Borrador"}.pdf`}
          className={HEADER_BTN_CLASS}
        >
          {({ loading }: { loading: boolean }) => (
            <>
              <Download className="w-3.5 h-3.5" />
              {loading ? "..." : "Descargar"}
            </>
          )}
        </PDFDownloadLink>
      </Suspense>

      <button className={HEADER_BTN_CLASS}>
        <RefreshCcw className="w-3.5 h-3.5" />
        Convertir
      </button>
    </div>
  );
}

interface HeaderMoreMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isEditable: boolean;
  onEdit: () => void;
}

export function HeaderMoreMenu({ menuOpen, setMenuOpen, isEditable, onEdit }: HeaderMoreMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <button className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
        <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
            {isEditable && (
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <PenLine className="w-3.5 h-3.5 text-amber-500" />
                Editar borrador
              </button>
            )}
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Share2 className="w-3.5 h-3.5 text-gray-400" />
              Compartir
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Download className="w-3.5 h-3.5 text-gray-400" />
              Exportar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
