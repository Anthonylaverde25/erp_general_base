import { useParams } from 'react-router';
import { useShowPartner } from '@/features/partners/hooks/useShowPartner';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import PartnerProfileHeader from '../components/profile/PartnerProfileHeader';
import PartnerProfileSidebar from '../components/profile/PartnerProfileSidebar';
import PartnerProfileOverview from '../components/profile/PartnerProfileOverview';
import PartnerDocumentsTab from '../components/profile/PartnerDocumentsTab';
import PartnerProfileFiles from '../components/profile/PartnerProfileFiles';

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

export default function PartnerProfilePage() {
	const { id } = useParams<{ id: string }>();
	const { partner, isLoading, isError } = useShowPartner(Number(id));
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (isLoading) return <FuseLoading />;

	if (isError || !partner) {
		return (
			<Box className="flex h-full items-center justify-center">
				<Typography
					variant="h6"
					color="text.secondary"
				>
					No se encontró el socio solicitado.
				</Typography>
			</Box>
		);
	}

	return (
		<Root
			header={
				<PartnerProfileHeader
					partner={partner}
					tabValue={tabValue}
					onTabChange={handleTabChange}
				/>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default' }}>
					<Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>
						{/* ── TAB: Resumen ─────────────────────────────────── */}
						{tabValue === 0 && (
							<Box
								className="flex flex-col md:flex-row"
								sx={{ height: { xs: 'auto', md: '100%' }, borderColor: '#E6EAF0' }}
							>
								<PartnerProfileSidebar partner={partner} />
								<PartnerProfileOverview partner={partner} />
							</Box>
						)}

						{/* ── TAB: Documentos ───────────────────────────────── */}
						{tabValue === 1 && <PartnerDocumentsTab partnerId={partner.id} />}

						{/* ── TAB: Archivos ─────────────────────────────────── */}
						{tabValue === 2 && <PartnerProfileFiles partner={partner} />}
					</Box>
				</Box>
			}
			scroll="content"
		/>
	);
}
