import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import GroupedInvoicesTable from './components/grouped-invoices-table';
import GroupedBillingStats from './components/GroupedBillingStats';
import DocumentsHeader from '../components/DocumentsHeader';
import { SAP_THEME } from './components/grouped-invoices-table/theme';

const Root = styled(FusePageCarded)(({ theme }) => ({
	padding: '0!important',
	'& .container': {
		maxWidth: '100%!important',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: (props) => props.theme.palette?.background?.default || '#f8fafc',
	},
	'& .FusePageCarded-content': {
		backgroundColor: (props) => props.theme.palette?.background?.default || '#f8fafc',
	}
}));

/**
 * GroupedInvoicesPage
 * Vista Workbench para la Facturación Agrupada rediseñada bajo SAP Fiori Horizon.
 */
export default function GroupedInvoicesPage() {
	const { t } = useTranslation('navigation');

	// Filtramos solo albaranes facturables (sin hijos, entregados) desde el backend
	const { data: documents, isLoading, refetch } = useIndexDocuments({
		operation: 'sale',
		document_type_code: 'DLV',
		status: 'delivered',
		only_billable: true
	});

	return (
		<Root
			header={
				<Box className='mb-3' sx={{ bgcolor: 'background.paper' }}>
					<DocumentsHeader
						operation="sale"
						title={t('GROUPED_INVOICES') || 'Facturación Agrupada'}
					/>
					<Box sx={{ p: 2, pb: 1 }}>
						<GroupedBillingStats documents={documents || []} />
					</Box>
				</Box>
			}
			content={
				<Box>
					< GroupedInvoicesTable
						documents={documents}
						isLoading={isLoading}
						onStatusUpdated={refetch}
					/>
				</Box >
			}
		/>
	);
}
