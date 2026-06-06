import { useMemo } from "react";
import { useTheme } from "@mui/material";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { CompanyEntity } from "@/domain/entities/companies/Company";
import { DocumentLinesTable } from "./components/paper/DocumentLinesTable";
import { DocumentPageFooter } from "./components/paper/DocumentPageFooter";
import { DocumentPageSummary } from "./components/paper/DocumentPageSummary";
import { DocumentPaperHeader } from "./components/paper/DocumentPaperHeader";
import { QuoteStatusWatermark } from "./components/paper/QuoteStatusWatermark";
import DocumentSuccessorAlert from "./DocumentSuccessorAlert";
import {
  chunkArray,
  LINES_PER_PAGE,
  sortLinesByPredecessor,
} from "./components/paper/paperUtils";

interface DocumentShowPaperProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
}

export default function DocumentShowPaper({
  document,
  activeCompany,
}: DocumentShowPaperProps) {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === "dark";

  console.log("document", document.canReceivePayments());
  console.log("document status", document.documentStatus);
  // console.log("¿Es instancia?", document instanceof DocumentEntity);
  // console.log("Método:", document.canReceivePayments);


  const isProcessableDocType = [
    "QUO",
    "PQUO",
    "ORD",
    "PORD",
    "DLV",
    "PDLV",
    "TKT",
  ].includes(document.document_type_code || "");
  const hasPredecessors = (document.predecessors?.length ?? 0) > 0;
  const hasDiscounts = document.lines.some((line) => line.discount_percent > 0);

  // Keeping this explicit makes future design tuning easy.
  const descriptionMinWidth = 100;

  const pages = useMemo(() => {
    if (!document.lines || document.lines.length === 0) return [[]];
    const sortedLines = sortLinesByPredecessor(
      document.lines,
      document.predecessors ?? [],
    );
    return chunkArray(sortedLines, LINES_PER_PAGE);
  }, [document.lines, document.predecessors]);

  const totalPages = pages.length;
  const validationUrl = `https://erp.tuempresa.com/verify/${document.id || document.number_serie
    }`;

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <DocumentSuccessorAlert document={document} />
      {pages.map((pageLines, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === totalPages - 1;

        return (
          <section
            key={`page-${pageIndex}`}
            className="bg-white dark:bg-[#0f172a] w-full max-w-[21cm] shadow-2xl border border-gray-200 dark:border-gray-800 min-h-[29.7cm] relative flex flex-col text-[#1e293b] dark:text-gray-100 overflow-hidden"
            id={`invoice-sheet-page-${pageIndex + 1}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="h-1 w-full bg-[#0f172a] dark:bg-blue-500" />

            <QuoteStatusWatermark
              document={document}
              activeCompany={activeCompany}
              isFirstPage={isFirstPage}
            />

            <div className="p-[1.5cm] flex flex-col flex-1">
              <DocumentPaperHeader
                document={document}
                activeCompany={activeCompany}
                isFirstPage={isFirstPage}
              />

              <div className="flex-1 mt-6">
                <DocumentLinesTable
                  pageLines={pageLines}
                  isDark={isDark}
                  hasPredecessors={hasPredecessors}
                  hasDiscounts={hasDiscounts}
                  isProcessableDocType={isProcessableDocType}
                  descriptionMinWidth={descriptionMinWidth}
                  predecessors={document.predecessors}
                  isCreditNote={document.document_type_code === 'CRN' || document.document_type_code === 'PCN'}
                />
              </div>

              {isLastPage && (
                <DocumentPageSummary
                  document={document}
                  validationUrl={validationUrl}
                />
              )}

              <DocumentPageFooter
                activeCompany={activeCompany}
                pageIndex={pageIndex}
                totalPages={totalPages}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
