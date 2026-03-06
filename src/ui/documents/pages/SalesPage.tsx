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

export default function SalesPage() {
	const navigate = useNavigate();
	const { code } = useParams();
	const { data: documents, isLoading, refetch } = useIndexDocuments({
		operation: 'sale',
		document_type_code: code
	});

	const handleCreate = () => {
		const targetCode = code || 'INV';
		navigate(`/sales/create/${targetCode}`);
	};

	const handleCreateDraft = () => {
		const targetCode = code || 'INV';
		navigate(`/sales/create/${targetCode}?mode=draft`);
	};

	const title = code ? `Documentos: ${code}` : 'Documentos de Venta';

	return (
		<Root
			header={
				<DocumentsHeader
					operation="sale"
					title={title}
					onCreate={handleCreate}
					onCreateDraft={handleCreateDraft}
				/>
			}
			content={
				<DocumentTable
					documents={documents}
					isLoading={isLoading}
					operation="sale"
					onStatusUpdated={() => refetch()}
				/>
			}
		/>
	);
}
