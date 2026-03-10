import type { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  ClipboardCheck,
  SendHorizonal,
  Truck,
} from "lucide-react";

export type LifecycleStep = { key: string; label: string };
export type NextAction = {
  label: string;
  nextStatus: string;
  Icon: LucideIcon;
  variant: "indigo" | "green";
};

const INVOICE_CODES = ["INV", "PINV"];
const DELIVERY_CODES = ["DLV", "PDLV"];
const QUOTE_CODES = ["QUO", "PQUO"];

const isInvoice = (code: string) => INVOICE_CODES.includes(code);
const isDelivery = (code: string) => code === "DLV";
const isPurchaseDelivery = (code: string) => code === "PDLV";
const isDeliveryFamily = (code: string) => DELIVERY_CODES.includes(code);
export const isQuote = (code: string) => QUOTE_CODES.includes(code);

export const canRevert = (statusKey: string) =>
  ["validated", "approved"].includes(statusKey);

export function buildLifecycleSteps(
  docTypeCode: string,
  operation: string,
  statusKey: string,
): LifecycleStep[] | null {
  if (isInvoice(docTypeCode)) {
    const isSale = operation === "sale";
    const finalKey = isSale ? "collected" : "paid";
    const steps: LifecycleStep[] = [
      { key: "draft", label: "Borrador" },
      { key: "approved", label: "Aprobada" },
      { key: "issued", label: "Emitida" },
    ];

    if (statusKey === "partially_collected" || statusKey === "partially_paid") {
      steps.push({
        key: statusKey,
        label: isSale ? "Cobro Parcial" : "Pago Parcial",
      });
    }

    steps.push({
      key: finalKey,
      label: isSale ? "Cobrada" : "Pagada",
    });

    return steps;
  }

  if (isDelivery(docTypeCode)) {
    return [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: "delivered", label: "Entregado" },
      { key: "invoiced", label: "Facturado" },
    ];
  }

  if (isPurchaseDelivery(docTypeCode)) {
    return [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: "received", label: "Recibido" },
      { key: "invoiced", label: "Facturado" },
    ];
  }

  if (isQuote(docTypeCode)) {
    const approvedKey = statusKey === "rejected" ? "rejected" : "approved";
    const approvedLabel = statusKey === "rejected" ? "Rechazado" : "Aprobado";
    return [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: approvedKey, label: approvedLabel },
    ];
  }

  return null;
}

export function resolveNextAction(
  docTypeCode: string,
  statusKey: string,
  operation: string,
): NextAction | null {
  if (isInvoice(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Aprobar",
        nextStatus: "approved",
        Icon: CheckCircle,
        variant: "indigo",
      };
    if (statusKey === "approved")
      return {
        label: "Emitir factura",
        nextStatus: "issued",
        Icon: SendHorizonal,
        variant: "green",
      };
  }

  if (isDelivery(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: ClipboardCheck,
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Registrar entrega",
        nextStatus: "delivered",
        Icon: Truck,
        variant: "green",
      };
  }

  if (isPurchaseDelivery(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: ClipboardCheck,
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Registrar recepción",
        nextStatus: "received",
        Icon: Truck,
        variant: "green",
      };
  }

  if (isQuote(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: ClipboardCheck,
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Aprobar",
        nextStatus: "approved",
        Icon: CheckCircle,
        variant: "green",
      };
  }

  return null;
}

export function canShowPostDeliveredActions(
  docTypeCode: string,
  statusKey: string,
  isAlreadyInvoiced: boolean,
) {
  const isDelivered = statusKey === "delivered" || statusKey === "received";
  const quoteApproved = statusKey === "approved";

  const deliveryFlow =
    isDeliveryFamily(docTypeCode) && (isDelivered || isAlreadyInvoiced);
  const quoteFlow =
    isQuote(docTypeCode) && (quoteApproved || isAlreadyInvoiced);

  return deliveryFlow || quoteFlow;
}

export function getConversionTargetType(
  docTypeCode: string,
  operation: string,
) {
  if (isQuote(docTypeCode)) {
    return operation === "sale" ? "DLV" : "PDLV";
  }
  return operation === "sale" ? "INV" : "PINV";
}
