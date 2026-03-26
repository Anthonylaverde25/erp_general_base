import { View, Text } from '@react-pdf/renderer';
import { DocumentLine } from '@/domain/entities/documents/DocumentEntity';
import { styles } from './PDFStyles';

interface PDFLineTableProps {
    pageLines: DocumentLine[];
    formatCurrency: (amount: number) => string;
    hasPredecessors: boolean;
}

export const PDFLineTable = ({ pageLines, formatCurrency, hasPredecessors }: PDFLineTableProps) => {
    const hasDiscounts = pageLines?.some(line => (line.discount_percent || 0) > 0);

    // Dynamic width calculation for Description to fill space
    const getDescWidth = () => {
        let width = 45; // Base width
        if (hasPredecessors) width -= 10;
        if (hasDiscounts) width -= 8;
        return `${width}%`;
    };

    const colDescStyle = { ...styles.colDesc, width: getDescWidth() };

    return (
        <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
                {hasPredecessors && (
                    <View style={styles.colOrigin}><Text style={styles.tableHeaderText}>Origen</Text></View>
                )}
                <View style={colDescStyle}><Text style={styles.tableHeaderText}>Descripción</Text></View>
                <View style={styles.colQty}><Text style={styles.tableHeaderText}>Cant.</Text></View>
                <View style={styles.colUnit}><Text style={styles.tableHeaderText}>Ud.</Text></View>
                <View style={styles.colPrice}><Text style={styles.tableHeaderText}>Precio</Text></View>
                {hasDiscounts && (
                    <View style={styles.colDiscount}><Text style={styles.tableHeaderText}>Dto.%</Text></View>
                )}
                <View style={styles.colTax}><Text style={styles.tableHeaderText}>Imp.</Text></View>
                <View style={styles.colTotal}><Text style={styles.tableHeaderText}>Total</Text></View>
            </View>

            {/* Rows */}
            {pageLines?.map((line, index) => {
                const prevLine = index > 0 ? pageLines[index - 1] : null;
                const isFirstOfGroup = !prevLine || prevLine.source_document_number !== line.source_document_number;

                return (
                    <View key={line.id || index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowEven : {}]}>
                        {hasPredecessors && (
                            <View style={styles.colOrigin}>
                                <Text style={[styles.itemBold, { color: '#2563eb', fontSize: 7, fontStyle: 'italic' }]}>
                                    {isFirstOfGroup ? `#${line.source_document_number || 'S/N'}` : ''}
                                </Text>
                            </View>
                        )}
                        
                        <View style={colDescStyle}>
                            <Text style={styles.itemMain}>
                                {line.item_code ? `[${line.item_code}] ` : ''}{line.name}
                            </Text>
                            {line.description && <Text style={styles.itemSub}>{line.description}</Text>}
                        </View>

                        <View style={styles.colQty}>
                            <Text style={styles.itemValueBold}>{line.quantity}</Text>
                        </View>

                        <View style={styles.colUnit}>
                            <Text style={[styles.itemValue, { fontSize: 7, textTransform: 'uppercase' }]}>
                                {line.unit_short_name || '-'}
                            </Text>
                        </View>

                        <View style={styles.colPrice}>
                            <Text style={styles.itemValue}>{formatCurrency(line.unit_price)}</Text>
                        </View>

                        {hasDiscounts && (
                            <View style={styles.colDiscount}>
                                <Text style={styles.itemDiscount}>
                                    {(line.discount_percent || 0) > 0 ? `${line.discount_percent}%` : '-'}
                                </Text>
                            </View>
                        )}

                        <View style={styles.colTax}>
                            <Text style={[styles.itemValue, { fontSize: 7 }]}>{line.tax_labels || '-'}</Text>
                        </View>

                        <View style={styles.colTotal}>
                            <Text style={styles.itemBold}>{formatCurrency(line.line_total)}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
