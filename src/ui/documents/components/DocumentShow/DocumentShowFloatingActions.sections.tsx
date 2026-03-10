import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ChevronRight,
  FileText,
  Package,
  RotateCcw,
  ShoppingCart,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

import DocumentPDF from "./DocumentPDF";
import type { CompanyEntity } from "@/domain/entities/companies/Company";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import {
  LifecycleStep,
  NextAction,
  getConversionTargetType,
  isPurchaseOrder,
  isQuote,
} from "./DocumentShowFloatingActions.helpers";

const CTA_VARIANTS = {
  indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
  green: "bg-emerald-600 hover:bg-emerald-700 text-white",
} as const;

export function LifecycleStepper({
  steps,
  currentKey,
}: {
  steps: LifecycleStep[] | null;
  currentKey: string;
}) {
  if (!steps) return <div />;

  const currentIdx = steps.findIndex((step) => step.key === currentKey);

  return (
    <ol className="flex items-center h-full">
      {steps.map((step, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        return (
          <li key={step.key} className="flex items-center h-full">
            <span
              className={[
                "flex items-center h-full px-3 text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-colors",
                done
                  ? "text-emerald-600 dark:text-emerald-400 border-transparent"
                  : "",
                current
                  ? "text-indigo-600 dark:text-indigo-400 border-indigo-500 dark:border-indigo-400"
                  : "",
                !done && !current
                  ? "text-gray-400 dark:text-gray-600 border-transparent"
                  : "",
              ].join(" ")}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight
                className={`w-3 h-3 flex-shrink-0 ${i < currentIdx ? "text-emerald-400" : "text-gray-300 dark:text-gray-700"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function SecondaryActions({
  document,
  activeCompany,
  isRevertible,
  onRevert,
  disableRevert,
}: {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
  isRevertible: boolean;
  onRevert: () => void;
  disableRevert: boolean;
}) {
  return (
    <div className="flex items-center h-full divide-x divide-gray-200 dark:divide-gray-700">
      <div className="flex items-center px-2">
        <PDFDownloadLink
          document={
            <DocumentPDF document={document} activeCompany={activeCompany} />
          }
          fileName={`${document.number_serie || "Borrador"}.pdf`}
          className="px-2 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-wide transition-colors"
        >
          {({ loading }) => (loading ? "..." : "PDF")}
        </PDFDownloadLink>
      </div>

      {isRevertible && (
        <div className="flex items-center px-2">
          <button
            onClick={onRevert}
            disabled={disableRevert}
            className="px-2 py-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-wide flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" />
            Revertir
          </button>
        </div>
      )}
    </div>
  );
}

export function PostDeliveredActions({
  document,
  module,
  docTypeCode,
  operation,
  isAlreadyInvoiced,
  onOpenConversion,
  onOpenBudget,
  onOpenPurchaseOrder,
}: {
  document: DocumentEntity;
  module: string;
  docTypeCode: string;
  operation: string;
  isAlreadyInvoiced: boolean;
  onOpenConversion: () => void;
  onOpenBudget: () => void;
  onOpenPurchaseOrder: () => void;
}) {
  const navigate = useNavigate();

  const handlePrefilledCreation = () => {
    const targetType = getConversionTargetType(docTypeCode, operation);
    navigate(`/${module}/create/${targetType}?from_document_id=${document.id}`);
  };

  const handleInstantConversion = () => {
    if (isQuote(docTypeCode) || isPurchaseOrder(docTypeCode)) {
      onOpenBudget();
      return;
    }
    onOpenConversion();
  };

  return (
    <div className="flex items-center gap-1 px-2">
      {/* ok */}

      <button
        onClick={handleInstantConversion}
        disabled={isAlreadyInvoiced}
        title={
          isAlreadyInvoiced
            ? "Este documento ya fue procesado"
            : "Convertir instantáneamente"
        }
        className="px-2 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 uppercase tracking-wide flex items-center gap-1 transition-colors disabled:opacity-40"
      >
        <FileText className="w-3 h-3" />
        {isQuote(docTypeCode) || isPurchaseOrder(docTypeCode)
          ? "Crear Albarán 2 (API)"
          : "Crear Factura 2 (API)"}
      </button>

      {(docTypeCode === "QUO" || docTypeCode === "PQUO") && (
        <button
          onClick={onOpenPurchaseOrder}
          className="px-2 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 uppercase tracking-wide flex items-center gap-1 transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          Generar Orden de Compra
        </button>
      )}

      {!isAlreadyInvoiced && (
        <button
          onClick={() =>
            navigate(
              `/${module}/create/${operation === "sale" ? "SDLV" : "PRDLV"}`,
            )
          }
          className="px-2 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-wide flex items-center gap-1 transition-colors"
        >
          <Package className="w-3 h-3" />
          Devolución
        </button>
      )}
    </div>
  );
}

export function PrimaryActions({
  statusKey,
  docTypeCode,
  isUpdating,
  nextAction,
  onStatusChange,
}: {
  statusKey: string;
  docTypeCode: string;
  isUpdating: boolean;
  nextAction: NextAction | null;
  onStatusChange: (next: string) => void;
}) {
  if (!nextAction) return null;

  return (
    <div className="flex items-center pl-3 gap-2">
      {statusKey === "validated" && isQuote(docTypeCode) && (
        <button
          onClick={() => onStatusChange("rejected")}
          disabled={isUpdating}
          className="px-4 h-7 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors disabled:opacity-60 bg-red-600 hover:bg-red-700 text-white"
        >
          <X className="w-3.5 h-3.5" />
          {isUpdating ? "..." : "Rechazar"}
        </button>
      )}

      <button
        onClick={() => onStatusChange(nextAction.nextStatus)}
        disabled={isUpdating}
        className={`px-4 h-7 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors disabled:opacity-60 ${CTA_VARIANTS[nextAction.variant]}`}
      >
        <nextAction.Icon className="w-3.5 h-3.5" />
        {isUpdating ? "Procesando..." : nextAction.label}
      </button>
    </div>
  );
}
