import { useParams } from 'react-router';
import DocumentCreatePage from './DocumentCreatePage';

export default function EditSalesDocumentPage() {
    const { documentId } = useParams();
    return <DocumentCreatePage operation="sale" documentId={documentId} />;
}
