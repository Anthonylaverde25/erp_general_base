import { View, Text } from "@react-pdf/renderer";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { styles } from "./PDFStyles";
import { formatDate } from "./PDFUtils";

interface PDFInfoGridProps {
  document: DocumentEntity;
}

export const PDFInfoGrid = ({ document }: PDFInfoGridProps) => {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Destinatario / Titular</Text>
        <Text style={styles.infoName}>{document.partner_name || ""}</Text>
        <Text style={styles.infoText}>{document.partner_address || ""}</Text>
        <Text style={styles.infoText}>{document.partner_email || ""}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Detalles del Documento</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estado</Text>
          <Text style={styles.statusBadge}>
            {document.status?.name || "Borrador"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vencimiento</Text>
          <Text style={styles.summaryValue}>
            {formatDate(document.due_date || document.issue_date)}
          </Text>
        </View>
      </View>
    </View>
  );
};
