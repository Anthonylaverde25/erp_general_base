import FusePageCarded from '@fuse/core/FusePageCarded';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIndexDocuments } from '@/features/documents/hooks/useIndexDocuments';
import GroupedInvoicesTable from './components/grouped-invoices-table';
import GroupedBillingStats from './components/GroupedBillingStats';
import DocumentsHeader from '../components/DocumentsHeader';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important',
		display: 'flex',
		flexDirection: 'column',
	}
}));

/**
 * GroupedInvoicesPage
 * Vista Workbench para la Facturación Agrupada.
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
				<Box>
					<DocumentsHeader
						operation="sale"
						title={t('GROUPED_INVOICES') || 'Facturación Agrupada'}
					/>
					<Box className="p-2 mb-3">
						<GroupedBillingStats documents={documents || []} />
					</Box>
				</Box>
			}
			content={
				<Box>
					<GroupedInvoicesTable
						documents={documents}
						isLoading={isLoading}
						onStatusUpdated={refetch}
					/>
				</Box>
			}
		/>
	);
}
