import { PenLine } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentPDF from './DocumentPDF';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';

interface FloatingActionsProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

export default function DocumentShowFloatingActions({ document, activeCompany }: FloatingActionsProps) {
    return (
        <div className="fixed bottom-6 left-6 flex gap-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md overflow-hidden z-20">
            <PDFDownloadLink
                document={<DocumentPDF document={document} activeCompany={activeCompany} />}
                fileName={`Factura_${document.number_serie || 'Draft'}.pdf`}
                className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 text-xs font-bold uppercase rounded-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center no-underline"
            >
                {({ loading }) => (loading ? 'Generando...' : 'Descargar PDF')}
            </PDFDownloadLink>
            <button className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-sm text-gray-400 dark:text-gray-500 cursor-pointer transition-colors">
                <PenLine className="w-4 h-4" />
            </button>
        </div>
    );
}
