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

export default function SalesPage() {
	const navigate = useNavigate();
	const { data: documents, isLoading } = useIndexDocuments({ operation: 'sale' });

	const handleCreateInvoice = () => {
		navigate('/sales/create?mode=invoice');
	};

	const handleCreateDraft = () => {
		navigate('/sales/create?mode=draft');
	};

	return (
		<Root
			header={
				<DocumentsHeader
					operation="sale"
					onCreateInvoice={handleCreateInvoice}
					onCreateDraft={handleCreateDraft}
				/>
			}
			content={
				<DocumentTable
					documents={documents}
					isLoading={isLoading}
					operation="sale"
				/>
			}
		/>
	);
}
