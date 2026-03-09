import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { DocumentEntity, DocumentLine } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import QRCode from 'qrcode';
import { useMemo, useState, useEffect } from 'react';

// Register a professional font
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ],
});

const PRIMARY_COLOR = '#0f172a';
const SECONDARY_COLOR = '#64748b';
const BORDER_COLOR = '#f1f5f9';
const TABLE_HEADER_BG = '#f8fafc';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        color: '#1e293b',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: PRIMARY_COLOR,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        paddingBottom: 30,
    },
    companyInfo: {
        flexDirection: 'column',
    },
    logo: {
        height: 35,
        marginBottom: 10,
    },
    logoPlaceholder: {
        fontSize: 14,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        textTransform: 'uppercase',
    },
    companyText: {
        fontSize: 8,
        color: SECONDARY_COLOR,
        marginTop: 4,
        lineHeight: 1.4,
    },
    headerRight: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
    },
    metaGrid: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 25,
    },
    metaItem: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    metaLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: SECONDARY_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    infoBox: {
        width: '45%',
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: SECONDARY_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        paddingBottom: 5,
        marginBottom: 10,
    },
    infoName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 9,
        color: SECONDARY_COLOR,
        marginBottom: 2,
        lineHeight: 1.3,
    },
    statusBadge: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#475569',
        backgroundColor: '#f8fafc',
        padding: '2 6',
        borderRadius: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: TABLE_HEADER_BG,
        padding: '8 10',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    tableHeaderText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        padding: '10 10',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        alignItems: 'center',
    },
    tableRowEven: {
        backgroundColor: '#fafbfc',
    },
    colDesc: { flex: 4 },
    colQty: { flex: 1, textAlign: 'center' },
    colPrice: { flex: 1.5, textAlign: 'right' },
    colTax: { flex: 1, textAlign: 'right' },
    colTotal: { flex: 1.5, textAlign: 'right' },

    itemMain: { fontSize: 9, fontWeight: 'bold', color: PRIMARY_COLOR },
    itemSub: { fontSize: 7, color: SECONDARY_COLOR, fontStyle: 'italic', marginTop: 2 },
    itemValue: { fontSize: 9, color: SECONDARY_COLOR },
    itemBold: { fontSize: 9, fontWeight: 'bold', color: PRIMARY_COLOR },

    summarySection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    summaryWrapper: {
        width: 180,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '4 8',
    },
    summaryLabel: {
        fontSize: 9,
        color: SECONDARY_COLOR,
    },
    summaryValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: '8 8',
        borderTopWidth: 2,
        borderTopColor: PRIMARY_COLOR,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    table: {
        width: '100%',
    },
    qrCodeContainer: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        padding: 5,
        backgroundColor: '#ffffff',
    },
    qrCodeImage: {
        width: '100%',
        height: '100%',
    },
    qrCodeLabel: {
        fontSize: 6,
        color: SECONDARY_COLOR,
        textAlign: 'center',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: SECONDARY_COLOR,
        fontStyle: 'italic',
    },
    pageNumberInfo: {
        fontSize: 8,
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    miniHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        paddingBottom: 15,
        marginBottom: 20,
    },
    miniHeaderLogo: {
        height: 20,
        opacity: 0.5,
    },
    miniHeaderText: {
        fontSize: 8,
        color: SECONDARY_COLOR,
        textTransform: 'uppercase',
    },
    miniHeaderMetaRow: {
        flexDirection: 'row',
        gap: 10,
    },
});

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Chunk array helper
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
};

interface DocumentPDFProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

const DocumentPDF = ({ document, activeCompany }: DocumentPDFProps) => {

    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const validationUrl = `https://erp.tuempresa.com/verify/${document.id || document.number_serie}`;

    useEffect(() => {
        const generateQR = async () => {
            try {
                // Generate base64 Data URL for the PDF
                const url = await QRCode.toDataURL(validationUrl, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#0f172a',
                        light: '#ffffff'
                    }
                });
                setQrDataUrl(url);
            } catch (err) {
                console.error('Error generating QR code', err);
            }
        };
        generateQR();
    }, [validationUrl]);

    const LINES_PER_PAGE = 15;
    const pages = useMemo(() => {
        if (!document.lines || document.lines.length === 0) return [[]];
        return chunkArray(document.lines, LINES_PER_PAGE);
    }, [document.lines]);

    const totalPages = pages.length;

    return (
        <Document>
            {pages.map((pageLines, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === totalPages - 1;

                return (
                    <Page key={pageIndex.toString()} size="A4" style={styles.page}>
                        <View style={styles.topBar} />

                        {isFirstPage ? (
                            <>
                                {/* Professional Full Header */}
                                <View style={styles.header}>
                                    <View style={styles.companyInfo}>
                                        {activeCompany?.logo_url ? (
                                            <Image src={activeCompany.logo_url} style={styles.logo} />
                                        ) : (
                                            <Text style={styles.logoPlaceholder}>{activeCompany?.name || ''}</Text>
                                        )}
                                        <Text style={styles.companyText}>{activeCompany?.name || ''}</Text>
                                        {activeCompany?.cif && <Text style={styles.companyText}>CIF: {activeCompany.cif}</Text>}
                                        <Text style={styles.companyText}>{activeCompany?.address || ''}</Text>
                                    </View>

                                    <View style={styles.headerRight}>
                                        <Text style={styles.invoiceTitle}>Documento</Text>
                                        <View style={styles.metaGrid}>
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>Nº Documento</Text>
                                                <Text style={styles.metaValue}>#{document.number_serie || '(Borrador)'}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>Fecha</Text>
                                                <Text style={styles.metaValue}>{document.issue_date || ''}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Info Grid */}
                                <View style={styles.infoSection}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}>Destinatario / Titular</Text>
                                        <Text style={styles.infoName}>{document.partner_name || ''}</Text>
                                        <Text style={styles.infoText}>{document.partner_address || ''}</Text>
                                        <Text style={styles.infoText}>{document.partner_email || ''}</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoLabel}>Detalles</Text>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Estado</Text>
                                            <Text style={styles.statusBadge}>{document.status?.name || 'Borrador'}</Text>
                                        </View>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Vencimiento</Text>
                                            <Text style={styles.summaryValue}>{document.due_date || document.issue_date || ''}</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        ) : (
                            /* Mini Header for subsequent pages */
                            <View style={styles.miniHeader}>
                                {activeCompany?.logo_url ? (
                                    <Image src={activeCompany.logo_url} style={styles.miniHeaderLogo} />
                                ) : (
                                    <Text style={styles.miniHeaderText}>{activeCompany?.name || ''}</Text>
                                )}
                                <View style={styles.miniHeaderMetaRow}>
                                    <Text style={styles.miniHeaderText}>Nº {document.number_serie || '(Borrador)'}</Text>
                                    <Text style={styles.miniHeaderText}>•</Text>
                                    <Text style={styles.miniHeaderText}>{document.issue_date}</Text>
                                </View>
                            </View>
                        )}

                        {/* Table Section */}
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <View style={styles.colDesc}><Text style={styles.tableHeaderText}>Descripción</Text></View>
                                <View style={styles.colQty}><Text style={styles.tableHeaderText}>Cant.</Text></View>
                                <View style={styles.colPrice}><Text style={styles.tableHeaderText}>Precio</Text></View>
                                <View style={styles.colTax}><Text style={styles.tableHeaderText}>Imp.</Text></View>
                                <View style={styles.colTotal}><Text style={styles.tableHeaderText}>Total</Text></View>
                            </View>

                            {pageLines?.map((line, index) => (
                                <View key={index.toString()} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowEven : {}]}>
                                    <View style={styles.colDesc}>
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
                            ))}
                        </View>

                        {/* Summary Section - ONLY on last page */}
                        {isLastPage && (
                            <View style={[styles.summarySection, { justifyContent: 'space-between', alignItems: 'flex-end' }]}>
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
                                        <View key={i.toString()} style={styles.summaryRow}>
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
                        )}

                        {/* Footer Disclaimer (Absolute Positioned at Bottom) */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Generado por {activeCompany?.name}. Documento generado electrónicamente.</Text>
                            <Text style={styles.pageNumberInfo}>Página {pageIndex + 1} de {totalPages}</Text>
                        </View>
                    </Page>
                );
            })}
        </Document>
    );
};

export default DocumentPDF;
