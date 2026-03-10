import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { BudgetToDeliveryModal } from "./BudgetToDeliveryModal";
import { ConversionSeriesModal } from "./ConversionSeriesModal";
import {
  LifecycleStepper,
  PostDeliveredActions,
  PrimaryActions,
  SecondaryActions,
} from "./DocumentShowFloatingActions.sections";
import {
  buildLifecycleSteps,
  canRevert,
  canShowPostDeliveredActions,
  resolveNextAction,
} from "./DocumentShowFloatingActions.helpers";
import type { CompanyEntity } from "@/domain/entities/companies/Company";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { useConvertDocument } from "@/features/documents/hooks/useConvertDocument";
import { useConvertToPurchase } from "@/features/documents/hooks/useConvertToPurchase";
import { useUpdateDocument } from "@/features/documents/hooks/useUpdateDocument";

interface FloatingActionsProps {
  document: DocumentEntity;
  activeCompany: CompanyEntity;
}

export default function DocumentShowFloatingActions({
  document,
  activeCompany,
}: FloatingActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();
  const { mutate: convertDocument, isPending: isConverting } =
    useConvertDocument();
  const convertToPurchase = useConvertToPurchase();
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const statusKey = document.status?.key || "";

  const handleConvertToPurchase = async () => {
    try {
      const newDoc = await convertToPurchase.mutateAsync({
        id: String(document.id),
      });
      navigate(`/purchases/edit/${newDoc.document_type_code}/${newDoc.id}`);
    } catch (error) {
      console.error("Error al convertir a orden de compra:", error);
    }
  };
  const operation = document.operation;
  const module = operation === "sale" ? "sales" : "purchases";
  const docTypeCode = document.document_type_code || "";

  const steps = useMemo(
    () => buildLifecycleSteps(docTypeCode, operation, statusKey),
    [docTypeCode, operation, statusKey],
  );
  const nextAction = useMemo(
    () => resolveNextAction(docTypeCode, statusKey, operation),
    [docTypeCode, statusKey, operation],
  );

  const isAlreadyInvoiced = statusKey === "invoiced";
  const showPostDeliveredActions = canShowPostDeliveredActions(
    docTypeCode,
    statusKey,
    isAlreadyInvoiced,
  );

  const handleStatusChange = (newStatus: string) => {
    updateDocument(
      { id: String(document.id), data: { status_key: newStatus } },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["document", String(document.id)],
          }),
      },
    );
  };

  const handleConvertToInvoice = (payload: {
    number_series_id: number;
    status_key: string;
  }) => {
    convertDocument(
      { id: String(document.id), payload },
      {
        onSuccess: (invoice) => {
          setConversionModalOpen(false);
          navigate(`/${module}/view/${invoice.id}`);
        },
      },
    );
  };

  const handleConvertToDelivery = (payload: {
    number_series_id: number;
    status_key: string;
  }) => {
    convertDocument(
      { id: String(document.id), payload },
      {
        onSuccess: (delivery) => {
          setBudgetModalOpen(false);
          navigate(`/${module}/view/${delivery.id}`);
        },
      },
    );
  };

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
        />

        {showPostDeliveredActions && (
          <PostDeliveredActions
            document={document}
            module={module}
            docTypeCode={docTypeCode}
            operation={operation}
            isAlreadyInvoiced={isAlreadyInvoiced}
            onOpenConversion={() => setConversionModalOpen(true)}
            onOpenBudget={() => setBudgetModalOpen(true)}
            onOpenPurchaseOrder={handleConvertToPurchase}
          />
        )}

        <PrimaryActions
          statusKey={statusKey}
          docTypeCode={docTypeCode}
          isUpdating={isUpdating}
          nextAction={nextAction}
          onStatusChange={handleStatusChange}
        />
      </div>

      <ConversionSeriesModal
        open={conversionModalOpen}
        onClose={() => setConversionModalOpen(false)}
        document={document}
        onConvert={handleConvertToInvoice}
        isConverting={isConverting}
      />

      <BudgetToDeliveryModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        document={document}
        onConvert={handleConvertToDelivery}
        isConverting={isConverting}
      />
    </div>
  );
}
