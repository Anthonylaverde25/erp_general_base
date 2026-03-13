import { Document, Page, View } from '@react-pdf/renderer';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import QRCode from 'qrcode';
import { useMemo, useState, useEffect } from 'react';

// Atomic PDF Components
import { styles } from './components/pdf/PDFStyles';
import { PDFHeader } from './components/pdf/PDFHeader';
import { PDFInfoGrid } from './components/pdf/PDFInfoGrid';
import { PDFLineTable } from './components/pdf/PDFLineTable';
import { PDFSummary } from './components/pdf/PDFSummary';
import { PDFFooter } from './components/pdf/PDFFooter';
import { PDFStatusStamp } from './components/pdf/PDFStatusStamp';
import { formatCurrency, chunkArray } from './components/pdf/PDFUtils';

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

    const LINES_PER_PAGE = 20;
    const pages = useMemo(() => {
        if (!document.lines || document.lines.length === 0) return [[]];
        
        // Sort lines by predecessor order ("en serie")
        const sortedLines = [...document.lines].sort((a, b) => {
            const indexA = document.predecessors?.findIndex(p => p.id === a.source_document_id) ?? -1;
            const indexB = document.predecessors?.findIndex(p => p.id === b.source_document_id) ?? -1;
            return indexA - indexB;
        });

        return chunkArray(sortedLines, LINES_PER_PAGE);
    }, [document.lines]);

    const totalPages = pages.length;

    return (
        <Document>
            {pages.map((pageLines, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === totalPages - 1;

                return (
                    <Page key={pageIndex} size="A4" style={styles.page}>
                        <View style={styles.topBar} />

                        {/* Status Stamp Overlay (Only for Quotes/Budgets) */}
                        <PDFStatusStamp document={document} activeCompany={activeCompany} />

                        {/* Dynamic Header (Full or Mini) */}
                        <PDFHeader 
                            document={document} 
                            activeCompany={activeCompany} 
                            isFirstPage={isFirstPage} 
                        />

                        {/* Info Grid (Only on first page) */}
                        {isFirstPage && <PDFInfoGrid document={document} />}

                        {/* Main Line Table */}
                        <PDFLineTable 
                            pageLines={pageLines} 
                            formatCurrency={formatCurrency} 
                            hasPredecessors={document.predecessors && document.predecessors.length > 1}
                        />

                        {/* Summary Section (QR + Totals, ONLY on last page) */}
                        {isLastPage && (
                            <PDFSummary 
                                document={document} 
                                qrDataUrl={qrDataUrl} 
                                formatCurrency={formatCurrency} 
                            />
                        )}

                        {/* Professional Footer */}
                        <PDFFooter 
                            activeCompany={activeCompany} 
                            pageIndex={pageIndex} 
                            totalPages={totalPages} 
                        />
                    </Page>
                );
            })}
        </Document>
    );
};

export default DocumentPDF;
