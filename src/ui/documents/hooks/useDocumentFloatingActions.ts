import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useUpdateDocument } from "@/features/documents/hooks/useUpdateDocument";
import { useConvertDocument } from "@/features/documents/hooks/useConvertDocument";
import { useConvertToPurchase } from "@/features/documents/hooks/useConvertToPurchase";
import type { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { 
  buildLifecycleSteps, 
  canShowPostDeliveredActions, 
  resolveFastTrackAction, 
  resolveNextAction 
} from "../components/DocumentShow/DocumentShowFloatingActions.helpers";

interface UseDocumentFloatingActionsProps {
  document: DocumentEntity;
}

export function useDocumentFloatingActions({ document }: UseDocumentFloatingActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();
  const { mutate: convertDocument, isPending: isConverting } = useConvertDocument();
  const convertToPurchase = useConvertToPurchase();

  // Modal States
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [emissionModalOpen, setEmissionModalOpen] = useState(false);
  
  // Modes and Pending States
  const [conversionMode, setConversionMode] = useState<"full" | "partial">("full");
  const [invoiceConversionMode, setInvoiceConversionMode] = useState<"full" | "partial">("full");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // Document Info
  const statusKey = document.status?.key || "";
  const operation = document.operation;
  const module = operation === "sale" ? "sales" : "purchases";
  const docTypeCode = document.document_type_code || "";
  const isAlreadyInvoiced = statusKey === "invoiced";

  // Derived UI Logic
  const steps = useMemo(
    () => buildLifecycleSteps(docTypeCode, operation, statusKey),
    [docTypeCode, operation, statusKey]
  );
  const nextAction = useMemo(
    () => resolveNextAction(docTypeCode, statusKey, operation),
    [docTypeCode, statusKey, operation]
  );
  const fastTrackAction = useMemo(
    () => resolveFastTrackAction(docTypeCode, statusKey, operation),
    [docTypeCode, statusKey, operation]
  );
  const showPostDeliveredActions = canShowPostDeliveredActions(
    docTypeCode,
    statusKey,
    isAlreadyInvoiced
  );

  // Handlers
  const handleStatusChange = (newStatus: string) => {
    const isInvoiceType = ["INV", "PINV"].includes(docTypeCode);
    const isDeliveryType = ["DLV", "PDLV"].includes(docTypeCode);
    const isQuoteType = ["QUO", "PQUO"].includes(docTypeCode);

    let requiresSeries = false;
    if (isInvoiceType) {
      requiresSeries = newStatus === "issued";
    } else if (isDeliveryType) {
      requiresSeries = ["delivered", "received"].includes(newStatus);
    } else if (isQuoteType) {
      requiresSeries = newStatus === "approved";
    }

    if (requiresSeries && !document.number_serie) {
      setPendingStatus(newStatus);
      setInvoiceConversionMode("full");
      setEmissionModalOpen(true);
      return;
    }

    updateDocument(
      { id: String(document.id), data: { status_key: newStatus } },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["document", String(document.id)],
          }),
      }
    );
  };

  const handleEmissionConfirm = (payload: {
    number_series_id: number;
    status_key: string;
  }) => {
    updateDocument(
      {
        id: String(document.id),
        data: {
          status_key: pendingStatus || payload.status_key,
          number_series_id: payload.number_series_id,
        },
      },
      {
        onSuccess: () => {
          setEmissionModalOpen(false);
          setPendingStatus(null);
          queryClient.invalidateQueries({
            queryKey: ["document", String(document.id)],
          });
        },
      }
    );
  };

  const handleConvertToInvoice = (payload: {
    number_series_id: number;
    status_key: string;
    lines?: { source_line_id: number; quantity: number }[];
  }) => {
    convertDocument(
      { id: String(document.id), payload },
      {
        onSuccess: (invoice) => {
          setConversionModalOpen(false);
          navigate(`/${module}/view/${invoice.id}`);
        },
      }
    );
  };

  const handleConvertToDelivery = (payload: {
    number_series_id: number;
    status_key: string;
    lines?: { source_line_id: number; quantity: number }[];
  }) => {
    convertDocument(
      { id: String(document.id), payload },
      {
        onSuccess: (delivery) => {
          setBudgetModalOpen(false);
          navigate(`/${module}/view/${delivery.id}`);
        },
      }
    );
  };

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

  return {
    state: {
      conversionModalOpen,
      budgetModalOpen,
      emissionModalOpen,
      conversionMode,
      invoiceConversionMode,
      pendingStatus,
      isUpdating,
      isConverting,
      steps,
      nextAction,
      fastTrackAction,
      showPostDeliveredActions,
      statusKey,
      module,
      docTypeCode,
      operation,
      isAlreadyInvoiced,
    },
    actions: {
      setConversionModalOpen,
      setBudgetModalOpen,
      setEmissionModalOpen,
      setConversionMode,
      setInvoiceConversionMode,
      setPendingStatus,
      handleStatusChange,
      handleEmissionConfirm,
      handleConvertToInvoice,
      handleConvertToDelivery,
      handleConvertToPurchase,
    },
  };
}
