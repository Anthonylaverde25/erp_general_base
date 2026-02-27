import FusePageCarded from '@fuse/core/FusePageCarded';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import DocumentTable from '../components/DocumentTable';
import styled from 'styled-components';
import DocumentsHeader from '../components/DocumentsHeader';
import { useNavigate } from 'react-router';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

export default function PurchasesPage() {
	const navigate = useNavigate();
	const { data: documents, isLoading } = useIndexDocuments({ operation: 'purchase' });

	const handleCreateDocument = () => {
		navigate('/purchases/create');
	};

	return (
		<Root
			header={
				<DocumentsHeader
					operation="purchase"
					onCreate={handleCreateDocument}
				/>
			}
			content={
				<DocumentTable
					documents={documents}
					isLoading={isLoading}
					operation="purchase"
				/>
			}
		/>
	);
}
