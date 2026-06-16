import { Box } from '@mui/material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import PartnerOverviewActions from './PartnerOverviewActions';
import PartnerOverviewFinancialChart from './PartnerOverviewFinancialChart';
import PartnerOverviewActivity from './PartnerOverviewActivity';
import PartnerOverviewCards from './PartnerOverviewCards';

interface PartnerProfileOverviewProps {
	partner: PartnerEntity;
}

export default function PartnerProfileOverview({ partner }: PartnerProfileOverviewProps) {
	return (
		<Box sx={{ flex: 1, p: 3, overflowY: { xs: 'visible', md: 'auto' }, bgcolor: 'background.paper' }}>
			<PartnerOverviewActions />
			<PartnerOverviewCards partnerId={partner.id} partnerRole={partner.role} />
			<Box sx={{ mt: 3 }} />
			<PartnerOverviewFinancialChart partnerId={partner.id} partnerRole={partner.role} />
			<PartnerOverviewActivity />
		</Box>
	);
}
