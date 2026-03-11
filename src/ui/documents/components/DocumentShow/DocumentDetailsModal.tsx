import * as React from "react";
import {
  Dialog,
  Slide,
  Box,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";

// Components
import { DocumentDetailsHeader } from "./components/DocumentDetailsHeader";
import { DocumentTrajectory } from "./components/DocumentTrajectory";
import { DocumentStatsCards } from "./components/DocumentStatsCards";
import { TransactionHistory } from "./components/TransactionHistory";
import { DocumentTimeInfo } from "./components/DocumentTimeInfo";
import { DocumentNotesList } from "./components/DocumentNotesList";

import "../../pages/DocumentCreatePage.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Note {
  id: string;
  title: string;
  text: string;
  author: string;
  date: string;
}

interface DocumentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  document: DocumentEntity;
}

export default function DocumentDetailsModal({
  open,
  onClose,
  document,
}: DocumentDetailsModalProps) {
  const totalPaid = document.total_paid || 0;
  const total = document.total || 0;
  const balance = total - totalPaid;

  const notes: Note[] = [
    { id: "n1", title: "Llamada de cliente", text: "Solicitó cambio en fecha de entrega para el ítem principal.", author: "Juan P.", date: "03/03/2026" },
    { id: "n2", title: "Pago parcial", text: "Confirmar si el abono de 05/03 cubre envío express.", author: "Soporte", date: "08/03/2026" },
  ];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: { bgcolor: "#F9FAFB" } }}
    >
      <DocumentDetailsHeader document={document} onClose={onClose} />

      <Box
        sx={{
          mt: "56px",
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        {/* Sidebar: Document Trajectory */}
        <DocumentTrajectory document={document} />

        {/* Main Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
          <Stack spacing={4} sx={{ maxWidth: 1000, mx: "auto" }}>
            {/* Action Cards (Total, Paid, Balance) */}
            <DocumentStatsCards
              total={total}
              totalPaid={totalPaid}
              balance={balance}
            />

            {/* Transaction History Table */}
            <TransactionHistory
              documentId={document.id}
              totalPaid={totalPaid}
            />

            {/* Footer Info Cards */}
            <Box className=" border-gray-200 rounded-lg">
              <DocumentNotesList notes={notes} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
