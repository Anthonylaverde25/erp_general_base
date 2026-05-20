import FusePageSimple from '@fuse/core/FusePageSimple';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import DocumentAgGridTable from '../components/DocumentAgGridTable';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import DocumentsHeader from '../components/DocumentsHeader';
import { useNavigate } from 'react-router';

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

export default function SalesPageV2() {
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
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					<DocumentAgGridTable
						documents={documents}
						isLoading={isLoading}
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}
