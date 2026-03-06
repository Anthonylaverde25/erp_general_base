import FusePageCarded from '@fuse/core/FusePageCarded';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import DocumentTable from '../components/DocumentTable';
import styled from 'styled-components';
import DocumentsHeader from '../components/DocumentsHeader';
import { useNavigate, useParams } from 'react-router';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

export default function PurchasesPage() {
	const navigate = useNavigate();
	const { code } = useParams();
	const { data: documents, isLoading, refetch } = useIndexDocuments({
		operation: 'purchase',
		document_type_code: code
	});

	const handleCreateDocument = () => {
		const targetCode = code || 'PINV';
		navigate(`/purchases/create/${targetCode}`);
	};

	const title = code ? `Documentos: ${code}` : 'Documentos de Compra';

	return (
		<Root
			header={
				<DocumentsHeader
					operation="purchase"
					title={title}
					onCreate={handleCreateDocument}
				/>
			}
			content={
				<DocumentTable
					documents={documents}
					isLoading={isLoading}
					operation="purchase"
					onStatusUpdated={() => refetch()}
				/>
			}
		/>
	);
}
