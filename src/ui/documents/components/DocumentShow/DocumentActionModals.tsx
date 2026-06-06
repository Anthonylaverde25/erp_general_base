import { ConversionSeriesModal } from "./ConversionSeriesModal";
import { BudgetToDeliveryModal } from "./BudgetToDeliveryModal";
import { RectifyDocumentModal } from "./RectifyDocumentModal";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

interface DocumentActionModalsProps {
  document: DocumentEntity;
  state: {
    conversionModalOpen: boolean;
    budgetModalOpen: boolean;
    emissionModalOpen: boolean;
    rectificationModalOpen: boolean;
    conversionMode: "full" | "partial";
    invoiceConversionMode: "full" | "partial";
    pendingStatus: string | null;
    isUpdating: boolean;
    isConverting: boolean;
    isRectifying: boolean;
  };
  actions: {
    setConversionModalOpen: (open: boolean) => void;
    setBudgetModalOpen: (open: boolean) => void;
    setEmissionModalOpen: (open: boolean) => void;
    setRectificationModalOpen: (open: boolean) => void;
    setPendingStatus: (status: string | null) => void;
    handleConvertToInvoice: (payload: any) => void;
    handleConvertToDelivery: (payload: any) => void;
    handleEmissionConfirm: (payload: any) => void;
    handleRectifyDocument: (payload: any) => void;
  };
}

export function DocumentActionModals({ document, state, actions }: DocumentActionModalsProps) {
  return (
    <>
      <ConversionSeriesModal
        open={state.conversionModalOpen}
        onClose={() => actions.setConversionModalOpen(false)}
        document={document}
        onConvert={actions.handleConvertToInvoice}
        isConverting={state.isConverting}
        mode={state.invoiceConversionMode}
      />

      <ConversionSeriesModal
        open={state.emissionModalOpen}
        onClose={() => {
          actions.setEmissionModalOpen(false);
          actions.setPendingStatus(null);
        }}
        document={document}
        onConvert={actions.handleEmissionConfirm}
        isConverting={state.isUpdating}
        mode="full"
        targetType={document.document_type_code}
        title={
          state.pendingStatus === "issued"
            ? "Emitir Factura Legal"
            : "Registrar Numeración Legal"
        }
      />

      <BudgetToDeliveryModal
        open={state.budgetModalOpen}
        onClose={() => actions.setBudgetModalOpen(false)}
        document={document}
        onConvert={actions.handleConvertToDelivery}
        isConverting={state.isConverting}
        mode={state.conversionMode}
      />

      <RectifyDocumentModal
        open={state.rectificationModalOpen}
        onClose={() => actions.setRectificationModalOpen(false)}
        document={document}
        onRectify={actions.handleRectifyDocument}
        isRectifying={state.isRectifying}
      />
    </>
  );
}
