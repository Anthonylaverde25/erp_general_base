import { useParams } from 'react-router';
import DocumentCreatePage from './DocumentCreatePage';

export default function EditPurchaseDocumentPage() {
    const { documentId } = useParams();
    return <DocumentCreatePage operation="purchase" documentId={documentId} />;
}
