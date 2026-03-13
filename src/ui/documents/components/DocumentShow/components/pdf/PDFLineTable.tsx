import { View, Text } from '@react-pdf/renderer';
import { DocumentLine } from '@/domain/entities/documents/DocumentEntity';
import { styles } from './PDFStyles';

interface PDFLineTableProps {
    pageLines: any[];
    formatCurrency: (amount: number) => string;
    hasPredecessors: boolean;
}

export const PDFLineTable = ({ pageLines, formatCurrency, hasPredecessors }: PDFLineTableProps) => {
    const colDescStyle = hasPredecessors ? styles.colDesc : { ...styles.colDesc, width: '55%' };

    return (
        <View style={styles.table}>
            <View style={styles.tableHeader}>
                {hasPredecessors && (
                    <View style={styles.colOrigin}><Text style={styles.tableHeaderText}>Origen</Text></View>
                )}
                <View style={colDescStyle}><Text style={styles.tableHeaderText}>Descripción</Text></View>
                <View style={styles.colQty}><Text style={styles.tableHeaderText}>Cant.</Text></View>
                <View style={styles.colPrice}><Text style={styles.tableHeaderText}>Precio</Text></View>
                <View style={styles.colTax}><Text style={styles.tableHeaderText}>Imp.</Text></View>
                <View style={styles.colTotal}><Text style={styles.tableHeaderText}>Total</Text></View>
            </View>

            {pageLines?.map((line, index) => {
                const prevLine = index > 0 ? pageLines[index - 1] : null;
                const isFirstOfGroup = !prevLine || prevLine.source_document_number !== line.source_document_number;

                return (
                    <View key={line.id || index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowEven : {}]}>
                        {hasPredecessors && (
                            <View style={styles.colOrigin}>
                                <Text style={[styles.itemBold, { color: '#2563eb', fontSize: 7, fontWeight: 'black', fontStyle: 'italic' }]}>
                                    {isFirstOfGroup ? `#${line.source_document_number || 'S/N'}` : ''}
                                </Text>
                            </View>
                        )}
                        <View style={colDescStyle}>
                            <Text style={styles.itemMain}>{line.name}</Text>
                            {line.description && <Text style={styles.itemSub}>{line.description}</Text>}
                        </View>
                        <View style={styles.colQty}><Text style={styles.itemValue}>{line.quantity}</Text></View>
                        <View style={styles.colPrice}><Text style={styles.itemValue}>{formatCurrency(line.unit_price)}</Text></View>
                        <View style={styles.colTax}>
                            <Text style={styles.itemValue}>{line.taxes?.[0]?.percentage || 0}%</Text>
                        </View>
                        <View style={styles.colTotal}><Text style={styles.itemBold}>{formatCurrency(line.line_total)}</Text></View>
                    </View>
                );
            })}
        </View>
    );
};
