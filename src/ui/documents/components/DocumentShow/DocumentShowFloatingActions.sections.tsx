import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Package,
  RotateCcw,
  ShoppingCart,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";

import DocumentPDF from "./DocumentPDF";
import type { CompanyEntity } from "@/domain/entities/companies/Company";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import {
  LifecycleStep,
  NextAction,
  getConversionTargetType,
  isPurchaseOrder,
  isQuote,
  resolveFastTrackAction,
} from "./DocumentShowFloatingActions.helpers";
import DocumentActionSplitButton from "./components/DocumentActionSplitButton";

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
  console.log('steps', steps)

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
  onOpenConversion: (mode: "full" | "partial") => void;
  onOpenBudget: (mode: "full" | "partial") => void;
  onOpenPurchaseOrder: () => void;
}) {
  const navigate = useNavigate();

  // States for Albaran Split Button
  const [openAlbaran, setOpenAlbaran] = useState(false);
  const anchorRefAlbaran = useRef<HTMLDivElement>(null);

  // States for Invoice Split Button
  const [openInvoice, setOpenInvoice] = useState(false);
  const anchorRefInvoice = useRef<HTMLDivElement>(null);

  const handleToggleAlbaran = () => setOpenAlbaran((prev) => !prev);
  const handleToggleInvoice = () => setOpenInvoice((prev) => !prev);

  const handleCloseAlbaran = (event: any) => {
    if (anchorRefAlbaran.current && anchorRefAlbaran.current.contains(event.target as HTMLElement)) return;
    setOpenAlbaran(false);
  };

  const handleCloseInvoice = (event: any) => {
    if (anchorRefInvoice.current && anchorRefInvoice.current.contains(event.target as HTMLElement)) return;
    setOpenInvoice(false);
  };

  const handleInstantConversion = () => {
    if (isQuote(docTypeCode) || isPurchaseOrder(docTypeCode)) {
      onOpenBudget("full");
      return;
    }
    onOpenConversion("full");
  };

  const handlePartialConversion = () => {
    onOpenBudget("partial");
    setOpenAlbaran(false);
  };

  const handlePartialInvoiceConversion = () => {
    onOpenConversion("partial");
    setOpenInvoice(false);
  };

  const handleReturn = () => {
    navigate(`/${module}/create/${operation === "sale" ? "SDLV" : "PRDLV"}`);
    setOpenOps(false);
  };

  const isConversionAvailable = isQuote(docTypeCode) || isPurchaseOrder(docTypeCode);
  const isDeliveryFlow = !isConversionAvailable && !isAlreadyInvoiced && (docTypeCode === "DLV" || docTypeCode === "PDLV");
  const isPOAvailable = docTypeCode === "QUO" || docTypeCode === "PQUO";

  return (
    <div className="flex items-center gap-2 px-2">
      {/* 1. Botón: Orden de Compra (Si aplica) */}
      {isPOAvailable && (
        <button
          onClick={onOpenPurchaseOrder}
          className="px-3 h-7 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Orden Compra
        </button>
      )}

      {/* 2. Botón: Devolución (Solo si NO es presupuesto y NO está facturado) */}
      {!isAlreadyInvoiced && !isQuote(docTypeCode) && (
        <button
          onClick={() =>
            navigate(
              `/${module}/create/${operation === "sale" ? "SDLV" : "PRDLV"}`,
            )
          }
          className="px-3 h-7 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        >
          <Package className="w-3.5 h-3.5" />
          Devolución
        </button>
      )}

      {/* 3. Split Button: Conversión (Albarán / Factura) */}
      {isConversionAvailable && (
        <React.Fragment>
          <div className="flex items-center h-7 overflow-hidden rounded border border-indigo-200 dark:border-indigo-800" ref={anchorRefAlbaran}>
            <button
              onClick={handleInstantConversion}
              disabled={isAlreadyInvoiced}
              title={
                isAlreadyInvoiced
                  ? "Este documento ya fue procesado"
                  : "Convertir todo a albarán"
              }
              className="px-3 h-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors disabled:opacity-40 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-r border-indigo-200 dark:border-indigo-800"
            >
              <FileText className="w-3.5 h-3.5" />
              Crear Albarán
            </button>
            <button
              onClick={handleToggleAlbaran}
              disabled={isAlreadyInvoiced}
              className="px-1 h-full flex items-center justify-center transition-colors disabled:opacity-40 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Popper
            open={openAlbaran}
            anchorEl={anchorRefAlbaran.current}
            role={undefined}
            transition
            disablePortal
            placement="bottom-end"
            sx={{ zIndex: 1000 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-end" ? "right top" : "right bottom",
                }}
              >
                <Paper className="mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden rounded-md min-w-[180px]">
                  <ClickAwayListener onClickAway={handleCloseAlbaran}>
                    <MenuList id="albaran-split-button-menu" autoFocusItem className="py-0">
                      <MenuItem
                        onClick={handleInstantConversion}
                        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:hover:bg-indigo-900/20 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Albaranar Todo
                      </MenuItem>
                      <MenuItem
                        onClick={handlePartialConversion}
                        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Albaranar por Líneas
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      )}

      {isDeliveryFlow && (
        <React.Fragment>
          <div className="flex items-center h-7 overflow-hidden rounded border border-emerald-200 dark:border-emerald-800" ref={anchorRefInvoice}>
            <button
              onClick={handleInstantConversion}
              className="px-3 h-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-r border-emerald-200 dark:border-emerald-800"
            >
              <FileText className="w-3.5 h-3.5" />
              Crear Factura
            </button>
            <button
              onClick={handleToggleInvoice}
              className="px-1 h-full flex items-center justify-center transition-colors bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Popper
            open={openInvoice}
            anchorEl={anchorRefInvoice.current}
            role={undefined}
            transition
            disablePortal
            placement="bottom-end"
            sx={{ zIndex: 1000 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-end" ? "right top" : "right bottom",
                }}
              >
                <Paper className="mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden rounded-md min-w-[180px]">
                  <ClickAwayListener onClickAway={handleCloseInvoice}>
                    <MenuList id="invoice-split-button-menu" autoFocusItem className="py-0">
                      <MenuItem
                        onClick={handleInstantConversion}
                        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Facturar Todo
                      </MenuItem>
                      <MenuItem
                        onClick={handlePartialInvoiceConversion}
                        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Facturar por Líneas
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      )}
    </div>
  );
}

export function PrimaryActions({
  statusKey,
  docTypeCode,
  isUpdating,
  nextAction,
  fastTrackAction,
  onStatusChange,
}: {
  statusKey: string;
  docTypeCode: string;
  isUpdating: boolean;
  nextAction: NextAction | null;
  fastTrackAction: NextAction | null;
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

      <DocumentActionSplitButton
        primaryAction={nextAction}
        fastTrackAction={fastTrackAction}
        onAction={onStatusChange}
        disabled={isUpdating}
      />
    </div>
  );
}
