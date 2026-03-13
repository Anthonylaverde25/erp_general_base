import { View, Text, Image } from '@react-pdf/renderer';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { styles } from './PDFStyles';

interface PDFSummaryProps {
    document: DocumentEntity;
    qrDataUrl: string;
    formatCurrency: (amount: number) => string;
}

export const PDFSummary = ({ document, qrDataUrl, formatCurrency }: PDFSummaryProps) => {
    return (
        <View style={styles.summarySection}>
            {/* QR Code on the left side of the summary */}
            <View>
                {qrDataUrl && (
                    <View style={styles.qrCodeContainer}>
                        <Image src={qrDataUrl} style={styles.qrCodeImage} />
                    </View>
                )}
                <Text style={styles.qrCodeLabel}>Verificación QR</Text>
            </View>

            {/* Totals on the right side */}
            <View style={styles.summaryWrapper}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(document.subtotal)}</Text>
                </View>
                {document.tax_summaries?.map((tax, i) => (
                    <View key={`${tax.tax_rate_id || tax.rate}-${i}`} style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>IVA ({tax.rate}%)</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(tax.tax_amount)}</Text>
                    </View>
                ))}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatCurrency(document.total)}</Text>
                </View>
            </View>
        </View>
    );
};
