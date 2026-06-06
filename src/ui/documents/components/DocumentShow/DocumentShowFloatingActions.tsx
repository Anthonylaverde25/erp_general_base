import {
  LifecycleStepper,
  PostDeliveredActions,
  PrimaryActions,
  SecondaryActions,
} from "./DocumentShowFloatingActions.sections";
import { canRevert } from "./DocumentShowFloatingActions.helpers";
import type { CompanyEntity } from "@/domain/entities/companies/Company";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { useDocumentFloatingActions } from "../../hooks/useDocumentFloatingActions";
import { DocumentActionModals } from "./DocumentActionModals";

interface FloatingActionsProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
}

/**
 * Main component for document view actions (validated, issue, convert, etc.).
 * Refactored to use a custom hook for business logic and a dedicated modals component.
 */
export default function DocumentShowFloatingActions({
  document,
  activeCompany,
}: FloatingActionsProps) {
  const { state, actions } = useDocumentFloatingActions({ document });

  const {
    steps,
    statusKey,
    module,
    docTypeCode,
    operation,
    isAlreadyInvoiced,
    isUpdating,
    showPostDeliveredActions,
    nextAction,
    fastTrackAction,
  } = state;

  const {
    handleStatusChange,
    handleConvertToPurchase,
    setInvoiceConversionMode,
    setConversionModalOpen,
    setConversionMode,
    setBudgetModalOpen,
  } = actions;

  const isRectifiable = (docTypeCode === "INV" || docTypeCode === "TKT") && ["issued", "partially_collected", "collected"].includes(statusKey);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 h-10 shrink-0">
      <LifecycleStepper steps={steps} currentKey={statusKey} />

      <div className="flex items-center h-full divide-x divide-gray-200 dark:divide-gray-700">
        <SecondaryActions
          document={document}
          activeCompany={activeCompany}
          isRevertible={canRevert(statusKey)}
          disableRevert={isUpdating}
          onRevert={() => handleStatusChange("draft")}
          isRectifiable={isRectifiable}
          onRectify={() => actions.setRectificationModalOpen(true)}
          disableRectify={state.isRectifying}
        />

        {showPostDeliveredActions && (
          <PostDeliveredActions
            document={document}
            module={module}
            docTypeCode={docTypeCode}
            operation={operation}
            isAlreadyInvoiced={isAlreadyInvoiced}
            onOpenConversion={(mode: "full" | "partial") => {
              setInvoiceConversionMode(mode);
              setConversionModalOpen(true);
            }}
            onOpenBudget={(mode: "full" | "partial") => {
              setConversionMode(mode);
              setBudgetModalOpen(true);
            }}
            onOpenPurchaseOrder={handleConvertToPurchase}
          />
        )}

        <PrimaryActions
          statusKey={statusKey}
          docTypeCode={docTypeCode}
          isUpdating={isUpdating}
          nextAction={nextAction}
          fastTrackAction={fastTrackAction}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Centralized Modals Logic */}
      <DocumentActionModals
        document={document}
        state={state}
        actions={actions}
      />
    </div>
  );
}
