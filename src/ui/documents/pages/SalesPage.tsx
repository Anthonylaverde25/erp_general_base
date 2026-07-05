import FusePageSimple from '@fuse/core/FusePageSimple';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import DocumentTable from '../components/DocumentTable';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import DocumentsHeader from '../components/DocumentsHeader';
import { useNavigate, useParams, useLocation } from 'react-router';
import useUser from '@auth/useUser';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
}));

export default function SalesPage() {
	const navigate = useNavigate();
	const { code } = useParams();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const item_type = searchParams.get('item_type') || 'product';
	const { hasPermission } = useUser();
	const canCreate = hasPermission('sales.invoice.create');

	const { data: documents, isLoading, refetch } = useIndexDocuments({
		operation: 'sale',
		document_type_code: code,
		item_type
	});

	const handleCreate = () => {
		const targetCode = code || 'INV';
		navigate(`/sales/create/${targetCode}?item_type=${item_type}`);
	};

	const handleCreateDraft = () => {
		const targetCode = code || 'INV';
		navigate(`/sales/create/${targetCode}?mode=draft&item_type=${item_type}`);
	};

	const title = code ? `Documentos: ${code}` : 'Documentos de Venta';

	return (
		<Root
			header={
				<DocumentsHeader
					operation="sale"
					title={title}
					onCreate={canCreate ? handleCreate : undefined}
					onCreateDraft={canCreate ? handleCreateDraft : undefined}
				/>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					<DocumentTable
						documents={documents}
						isLoading={isLoading}
						operation="sale"
						onStatusUpdated={() => refetch()}
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}
