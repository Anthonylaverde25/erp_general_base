import FuseLoading from '@fuse/core/FuseLoading';
import { useParams, useNavigate } from 'react-router';
import { useGetDocument } from '@/features/documents/hooks/useGetDocument';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { Button } from '@mui/material';

// Refactored Components
import DocumentShowHeader from '../components/DocumentShow/DocumentShowHeader';
import DocumentShowPaper from '../components/DocumentShow/DocumentShowPaper';
import DocumentShowSidebar from '../components/DocumentShow/DocumentShowSidebar';
import DocumentShowFloatingActions from '../components/DocumentShow/DocumentShowFloatingActions';

export default function DocumentShowPage() {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const { data: document, isLoading: isDocumentLoading } = useGetDocument(documentId as string);
    const activeCompany = useActiveCompany();

    const isLoading = isDocumentLoading || !activeCompany;

    if (isLoading) {
        return <FuseLoading />;
    }

    if (!document) {
        return (
            <div className="flex items-center justify-center flex-1 h-full h-screen bg-[#f3f4f6] dark:bg-gray-950">
                <div className="text-center text-[#1f2937] dark:text-gray-100">
                    <h2 className="text-2xl font-bold">Documento no encontrado</h2>
                    <Button onClick={() => navigate('/sales')} className="mt-4">
                        Volver a ventas
                    </Button>
                </div>
            </div>
        );
    }

    const backPath = document.operation === 'sale' ? '/sales' : '/purchases';

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#f3f4f6] dark:bg-gray-950 text-[#1f2937] dark:text-gray-100 h-screen">
            <DocumentShowHeader
                partnerName={document.partner_name}
                numberSerie={document.number_serie}
                onClose={() => navigate(backPath)}
            />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                    <DocumentShowPaper
                        document={document}
                        activeCompany={activeCompany}
                    />
                    <DocumentShowFloatingActions document={document} activeCompany={activeCompany} />
                </div>

                <DocumentShowSidebar document={document} />
            </div>
        </div>
    );
}
