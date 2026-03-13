import FuseLoading from "@fuse/core/FuseLoading";
import { useParams, useNavigate } from "react-router";
import { useGetDocument } from "@/features/documents/hooks/useGetDocument";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { Button } from "@mui/material";

// Refactored Components
import DocumentShowHeader from "../components/DocumentShow/DocumentShowHeader";
import DocumentShowPaper from "../components/DocumentShow/DocumentShowPaper";
import DocumentShowSidebar from "../components/DocumentShow/DocumentShowSidebar";
import DocumentShowFloatingActions from "../components/DocumentShow/DocumentShowFloatingActions";
import { DocumentShowFloatingToolbar } from "../components/DocumentShow/DocumentShowFloatingToolbar";
import { RecordPaymentModal } from "../components/DocumentShow/RecordPaymentModal";
import DocumentDetailsModal from "../components/DocumentShow/DocumentDetailsModal";
import { useConvertToPurchase } from "@/features/documents/hooks/useConvertToPurchase";
import { useState } from "react";

export default function DocumentShowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data: document, isLoading: isDocumentLoading } = useGetDocument(
    documentId as string,
  );
  const activeCompany = useActiveCompany();
  const convertToPurchase = useConvertToPurchase();

  const handleConvertToPurchase = async () => {
    if (!documentId) return;
    try {
      const newDoc = await convertToPurchase.mutateAsync({ id: documentId });
      // Redirigir a la edición de la nueva Orden de Compra (PORD)
      navigate(`/purchases/${newDoc.id}/edit`);
    } catch (error) {
      console.error("Error al convertir a orden de compra:", error);
    }
  };

  const isLoading = isDocumentLoading || !activeCompany;

  if (isLoading) {
    return <FuseLoading />;
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center flex-1 h-screen bg-[#f3f4f6] dark:bg-gray-950">
        <div className="text-center text-[#1f2937] dark:text-gray-100">
          <h2 className="text-2xl font-bold">Documento no encontrado</h2>
          <Button onClick={() => navigate("/sales")} className="mt-4">
            Volver a ventas
          </Button>
        </div>
      </div>
    );
  }

  const backPath = document.operation === "sale" ? "/sales" : "/purchases";

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-[#f3f4f6] dark:bg-gray-950 text-[#1f2937] dark:text-gray-100">
      {/* ── Top chrome ── */}
      <DocumentShowHeader
        document={document}
        activeCompany={activeCompany}
        onClose={() => navigate(backPath)}
      />
      <DocumentShowFloatingActions
        document={document}
        activeCompany={activeCompany}
      />

      {/* ── Content area ── */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center relative">
          <DocumentShowPaper
            document={document}
            activeCompany={activeCompany}
          />
        </main>

        {/* Sidebar controlled by state */}
        {sidebarOpen && (
          <DocumentShowSidebar
            document={document}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Floating Toolbar - Only visible when sidebar is closed */}
      {!sidebarOpen && (
        <DocumentShowFloatingToolbar
          document={document}
          onMoreClick={() => setSidebarOpen(true)}
          onPaymentClick={() => setPaymentModalOpen(true)}
          onDetailsClick={() => setDetailsModalOpen(true)}
        />
      )}

      {document && (
        <RecordPaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          document={document}
        />
      )}

      {document && (
        <DocumentDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          document={document}
        />
      )}
    </div>
  );
}
