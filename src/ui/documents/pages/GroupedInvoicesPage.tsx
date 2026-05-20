import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import GroupedInvoicesTable from './components/grouped-invoices-table/GroupedInvoicesTable';
import GroupedBillingStats from './components/GroupedBillingStats';
import DocumentsHeader from '../components/DocumentsHeader';

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

export default function GroupedInvoicesPage() {
	const { t } = useTranslation('navigation');

	const { data: documents, isLoading, refetch } = useIndexDocuments({
		operation: 'sale',
		document_type_code: 'DLV',
		status: 'delivered',
		only_billable: true
	});

	return (
		<Root
			header={
				<Box sx={{ bgcolor: 'background.paper' }}>
					<DocumentsHeader
						operation="sale"
						title={t('GROUPED_INVOICES') || 'Facturación Agrupada'}
					/>
					<Box sx={{ px: 8, pb: 2 }}>
						<GroupedBillingStats documents={documents || []} />
					</Box>
				</Box>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					<GroupedInvoicesTable
						documents={documents}
						isLoading={isLoading}
						onStatusUpdated={refetch}
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}
