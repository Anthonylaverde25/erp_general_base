import { Truck, FileText, RotateCcw, Package, CheckCircle, SendHorizonal, ClipboardCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocumentPDF from './DocumentPDF';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { useUpdateDocument } from '@/features/documents/hooks/useUpdateDocument';
import { useQueryClient } from '@tanstack/react-query';

interface FloatingActionsProps {
    document: DocumentEntity;
    activeCompany: CompanyEntity;
}

const INVOICE_CODES = ['INV', 'PINV'];
const DELIVERY_CODES = ['DLV', 'PDLV'];

function getLifecycleConfig(docTypeCode: string, operation: string) {
    if (INVOICE_CODES.includes(docTypeCode)) {
        return [
            { key: 'draft', label: 'Borrador' },
            { key: 'approved', label: 'Aprobada' },
            { key: 'issued', label: 'Emitida' },
            { key: 'collected', label: operation === 'sale' ? 'Cobrada' : 'Pagada' },
        ];
    }
    if (docTypeCode === 'DLV') {
        return [
            { key: 'draft', label: 'Borrador' },
            { key: 'validated', label: 'Validado' },
            { key: 'delivered', label: 'Entregado' },
            { key: 'invoiced', label: 'Facturado' },
        ];
    }
    if (docTypeCode === 'PDLV') {
        return [
            { key: 'draft', label: 'Borrador' },
            { key: 'validated', label: 'Validado' },
            { key: 'received', label: 'Recibido' },
            { key: 'invoiced', label: 'Facturado' },
        ];
    }
    return null;
}

function getNextAction(docTypeCode: string, statusKey: string, operation: string) {
    if (INVOICE_CODES.includes(docTypeCode)) {
        if (statusKey === 'draft') return { label: 'Aprobar', nextStatus: 'approved', Icon: CheckCircle, variant: 'indigo' as const };
        if (statusKey === 'approved') return { label: 'Emitir factura', nextStatus: 'issued', Icon: SendHorizonal, variant: 'green' as const };
    }
    if (docTypeCode === 'DLV') {
        if (statusKey === 'draft') return { label: 'Validar', nextStatus: 'validated', Icon: ClipboardCheck, variant: 'indigo' as const };
        if (statusKey === 'validated') return { label: 'Registrar entrega', nextStatus: 'delivered', Icon: Truck, variant: 'green' as const };
    }
    if (docTypeCode === 'PDLV') {
        if (statusKey === 'draft') return { label: 'Validar', nextStatus: 'validated', Icon: ClipboardCheck, variant: 'indigo' as const };
        if (statusKey === 'validated') return { label: 'Registrar recepción', nextStatus: 'received', Icon: Truck, variant: 'green' as const };
    }
    return null;
}

const ctaVariants = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    green: 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

export default function DocumentShowFloatingActions({ document, activeCompany }: FloatingActionsProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();

    const statusKey = document.status?.key || '';
    const operation = document.operation;
    const module = operation === 'sale' ? 'sales' : 'purchases';
    const docTypeCode = document.document_type_code || '';

    const steps = getLifecycleConfig(docTypeCode, operation);
    const nextAction = getNextAction(docTypeCode, statusKey, operation);
    const isRevertible = ['validated', 'approved'].includes(statusKey);
    const currentIdx = steps?.findIndex(s => s.key === statusKey) ?? -1;

    const handleStatusChange = (newStatus: string) => {
        updateDocument(
            { id: String(document.id), data: { status_key: newStatus } },
            { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document', String(document.id)] }) }
        );
    };

    return (
        /* Toolbar row — same background as header, separated only by a top border from content below */
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 h-10 shrink-0">

            {/* ── Lifecycle stepper ───────────────────────────── */}
            {steps ? (
                <ol className="flex items-center h-full">
                    {steps.map((step, i) => {
                        const done = i < currentIdx;
                        const current = i === currentIdx;
                        return (
                            <li key={step.key} className="flex items-center h-full">
                                <span className={[
                                    'flex items-center h-full px-3 text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-colors',
                                    done ? 'text-emerald-600 dark:text-emerald-400 border-transparent' : '',
                                    current ? 'text-indigo-600 dark:text-indigo-400 border-indigo-500 dark:border-indigo-400' : '',
                                    !done && !current ? 'text-gray-400 dark:text-gray-600 border-transparent' : '',
                                ].join(' ')}>
                                    {step.label}
                                </span>
                                {i < steps.length - 1 && (
                                    <ChevronRight className={`w-3 h-3 flex-shrink-0 ${i < currentIdx ? 'text-emerald-400' : 'text-gray-300 dark:text-gray-700'}`} />
                                )}
                            </li>
                        );
                    })}
                </ol>
            ) : <div />}

            {/* ── Right-side actions ──────────────────────────── */}
            <div className="flex items-center h-full divide-x divide-gray-200 dark:divide-gray-700">

                {/* secondary: PDF */}
                <div className="flex items-center px-2">
                    <PDFDownloadLink
                        document={<DocumentPDF document={document} activeCompany={activeCompany} />}
                        fileName={`${document.number_serie || 'Borrador'}.pdf`}
                        className="px-2 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-wide transition-colors"
                    >
                        {({ loading }) => loading ? '...' : 'PDF'}
                    </PDFDownloadLink>
                </div>

                {/* secondary: revert */}
                {isRevertible && (
                    <div className="flex items-center px-2">
                        <button
                            onClick={() => handleStatusChange('draft')}
                            disabled={isUpdating}
                            className="px-2 py-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-wide flex items-center gap-1 transition-colors disabled:opacity-40"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Revertir
                        </button>
                    </div>
                )}

                {/* secondary: post-delivered actions for delivery notes */}
                {DELIVERY_CODES.includes(docTypeCode) && statusKey === 'delivered' && (
                    <div className="flex items-center gap-1 px-2">
                        <button
                            onClick={() => navigate(`/${module}/create/${operation === 'sale' ? 'INV' : 'PINV'}`)}
                            className="px-2 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-wide flex items-center gap-1 transition-colors"
                        >
                            <FileText className="w-3 h-3" />
                            Crear Factura
                        </button>
                        <button
                            onClick={() => navigate(`/${module}/create/${operation === 'sale' ? 'SDLV' : 'PRDLV'}`)}
                            className="px-2 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-wide flex items-center gap-1 transition-colors"
                        >
                            <Package className="w-3 h-3" />
                            Devolución
                        </button>
                    </div>
                )}

                {/* PRIMARY CTA */}
                {nextAction && (
                    <div className="flex items-center pl-3">
                        <button
                            onClick={() => handleStatusChange(nextAction.nextStatus)}
                            disabled={isUpdating}
                            className={`px-4 h-7 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors disabled:opacity-60 ${ctaVariants[nextAction.variant]}`}
                        >
                            <nextAction.Icon className="w-3.5 h-3.5" />
                            {isUpdating ? 'Procesando...' : nextAction.label}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
