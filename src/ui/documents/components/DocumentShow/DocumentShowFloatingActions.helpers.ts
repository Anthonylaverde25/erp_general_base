// No unnecessary lucide imports since we use strings now for mapping to MUI

export type LifecycleStep = { key: string; label: string };
export type NextAction = {
  label: string;
  nextStatus: string;
  Icon: string;
  variant: "indigo" | "green";
};

const INVOICE_CODES = ["INV", "PINV"];
const DELIVERY_CODES = ["DLV", "PDLV"];
const QUOTE_CODES = ["QUO", "PQUO"];
const PURCHASE_ORDER_CODES = ["PORD"];

const isInvoice = (code: string) => INVOICE_CODES.includes(code);
const isDelivery = (code: string) => code === "DLV";
const isPurchaseDelivery = (code: string) => code === "PDLV";
const isDeliveryFamily = (code: string) => DELIVERY_CODES.includes(code);
export const isQuote = (code: string) => QUOTE_CODES.includes(code);
export const isPurchaseOrder = (code: string) =>
  PURCHASE_ORDER_CODES.includes(code);

export const canRevert = (statusKey: string) =>
  ["validated", "approved", "issued", "shipped"].includes(statusKey);

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
      { key: "validated", label: "Validado" },
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
    const steps: LifecycleStep[] = [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: "delivered", label: "Entregado" },
    ];

    if (statusKey === "pending_invoice") {
      steps.push({ key: "pending_invoice", label: "Pendiente Facturar" });
    }

    if (statusKey === "partially_collected") {
      steps.push({ key: "partially_collected", label: "Parcialmente Cobrado" });
    }

    steps.push({ key: "invoiced", label: "Facturado" });
    return steps;
  }

  if (isPurchaseDelivery(docTypeCode)) {
    const steps: LifecycleStep[] = [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: "received", label: "Recibido" },
    ];

    if (statusKey === "pending_invoice") {
      steps.push({ key: "pending_invoice", label: "Pendiente Facturar" });
    }

    if (statusKey === "partially_paid") {
      steps.push({ key: "partially_paid", label: "Parcialmente Pagado" });
    }

    steps.push({ key: "invoiced", label: "Facturado" });
    return steps;
  }

  if (isQuote(docTypeCode)) {
    const approvedKey = statusKey === "rejected" ? "rejected" : "approved";
    const approvedLabel = statusKey === "rejected" ? "Rechazado" : "Aprobado";
    
    const steps: LifecycleStep[] = [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: approvedKey, label: approvedLabel },
    ];

    if (statusKey === 'partially_converted') {
      steps.push({ key: "partially_converted", label: "Parcial" });
    }

    if (statusKey === 'converted') {
      steps.push({ key: "partially_converted", label: "Parcial" });
      steps.push({ key: "converted", label: "Convertido" });
    }

    return steps;
  }

  if (isPurchaseOrder(docTypeCode)) {
    const steps: LifecycleStep[] = [
      { key: "draft", label: "Borrador" },
      { key: "validated", label: "Validado" },
      { key: "ordered", label: "Pedido" },
    ];

    if (statusKey === 'partially_converted') {
      steps.push({ key: "partially_converted", label: "Parcial" });
    }

    if (statusKey === 'converted') {
      steps.push({ key: "partially_converted", label: "Parcial" });
      steps.push({ key: "converted", label: "Convertido" });
    }

    return steps;
  }

  return null;
}

export function resolveNextAction(
  docTypeCode: string,
  statusKey: string,
  operation: string,
): NextAction | null {
  if (statusKey === 'converted') return null;

  if (isInvoice(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: "ClipboardCheck",
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Emitir factura",
        nextStatus: "issued",
        Icon: "SendHorizonal",
        variant: "green",
      };
  }

  if (isDelivery(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: "ClipboardCheck",
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Registrar entrega",
        nextStatus: "delivered",
        Icon: "Truck",
        variant: "green",
      };
    if (statusKey === "delivered")
      return {
        label: "Marcar para Facturar",
        nextStatus: "pending_invoice",
        Icon: "FileClock",
        variant: "indigo",
      };
  }

  if (isPurchaseDelivery(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: "ClipboardCheck",
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Registrar recepción",
        nextStatus: "received",
        Icon: "Truck",
        variant: "green",
      };
    if (statusKey === "received")
      return {
        label: "Marcar para Facturar",
        nextStatus: "pending_invoice",
        Icon: "FileClock",
        variant: "indigo",
      };
  }

  if (isQuote(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: "ClipboardCheck",
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Aprobar",
        nextStatus: "approved",
        Icon: "CheckCircle",
        variant: "green",
      };
  }

  if (isPurchaseOrder(docTypeCode)) {
    if (statusKey === "draft")
      return {
        label: "Validar",
        nextStatus: "validated",
        Icon: "ClipboardCheck",
        variant: "indigo",
      };
    if (statusKey === "validated")
      return {
        label: "Realizar pedido",
        nextStatus: "ordered",
        Icon: "Truck",
        variant: "green",
      };
  }

  return null;
}

export function resolveFastTrackAction(
  docTypeCode: string,
  statusKey: string,
  operation: string,
): NextAction | null {
  if (statusKey !== "draft") return null;

  if (isInvoice(docTypeCode)) {
    return {
      label: "Emitir",
      nextStatus: "issued",
      Icon: "Zap",
      variant: "green",
    };
  }

  if (isDelivery(docTypeCode)) {
    return {
      label: "Entregar",
      nextStatus: "delivered",
      Icon: "Zap",
      variant: "green",
    };
  }

  if (isPurchaseDelivery(docTypeCode)) {
    return {
      label: "Recibir",
      nextStatus: "received",
      Icon: "Zap",
      variant: "green",
    };
  }

  if (isQuote(docTypeCode)) {
    return {
      label: "Aprobar",
      nextStatus: "approved",
      Icon: "CheckCircle",
      variant: "green",
    };
  }

  if (isPurchaseOrder(docTypeCode)) {
    return {
      label: "Pedir",
      nextStatus: "ordered",
      Icon: "Truck",
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
  const isDelivered = ["delivered", "received", "validated", "pending_invoice", "partially_collected", "partially_paid"].includes(statusKey);
  const isApprovedOrValidated = ["approved", "validated", "partially_converted"].includes(statusKey);

  const deliveryFlow =
    isDeliveryFamily(docTypeCode) && (isDelivered || isAlreadyInvoiced);
  const quoteFlow =
    isQuote(docTypeCode) && (isApprovedOrValidated || isAlreadyInvoiced);
  const purchaseOrderFlow =
    isPurchaseOrder(docTypeCode) && (statusKey === "ordered" || statusKey === "partially_converted" || isAlreadyInvoiced);

  return deliveryFlow || quoteFlow || purchaseOrderFlow;
}

export function getConversionTargetType(
  docTypeCode: string,
  operation: string,
) {
  if (isQuote(docTypeCode)) {
    return operation === "sale" ? "DLV" : "PDLV";
  }
  if (isPurchaseOrder(docTypeCode)) {
    return "PDLV";
  }
  return operation === "sale" ? "INV" : "PINV";
}
