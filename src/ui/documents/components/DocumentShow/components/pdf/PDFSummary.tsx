import { View, Text, Image } from '@react-pdf/renderer';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { styles } from './PDFStyles';

interface PDFSummaryProps {
    document: DocumentEntity;
    qrDataUrl: string;
    formatCurrency: (amount: number) => string;
    isCreditNote?: boolean;
}

export const PDFSummary = ({ document, qrDataUrl, formatCurrency, isCreditNote = false }: PDFSummaryProps) => {
    return (
        <View style={styles.summarySection}>
            {/* QR Code on the left side of the summary */}
            <View style={{ alignItems: 'center' }}>
                <View style={styles.qrCodeContainer}>
                    {qrDataUrl && <Image src={qrDataUrl} style={styles.qrCodeImage} />}
                </View>
                <Text style={styles.qrCodeLabel}>Verificación QR</Text>
            </View>

            {/* Totals on the right side */}
            <View style={styles.summaryWrapper}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Suma Bases</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(isCreditNote ? -document.subtotal : document.subtotal)}</Text>
                </View>

                {document.discount_total > 0 && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.discountLabel}>Total Descuento</Text>
                        <Text style={styles.discountValue}>-{formatCurrency(document.discount_total)}</Text>
                    </View>
                )}

                {document.tax_summaries?.map((tax, i) => (
                    <View key={`${tax.name}-${tax.rate}-${i}`} style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            {tax.name} ({tax.rate}%)
                        </Text>
                        <Text style={styles.summaryValue}>{formatCurrency(isCreditNote ? -tax.tax_amount : tax.tax_amount)}</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Neto</Text>
                    <Text style={styles.totalValue}>{formatCurrency(isCreditNote ? -document.total : document.total)}</Text>
                </View>
            </View>
        </View>
    );
};
