import { useParams } from 'react-router';
import { useShowPartner } from '@/features/partners/hooks/useShowPartner';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

import PartnerProfileHeader from '../components/profile/PartnerProfileHeader';
import PartnerProfileSidebar from '../components/profile/PartnerProfileSidebar';
import PartnerProfileOverview from '../components/profile/PartnerProfileOverview';
import PartnerProfileTaxes from '../components/profile/PartnerProfileTaxes';
import PartnerProfileFiles from '../components/profile/PartnerProfileFiles';

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
		<FusePageSimple
			header={
				<PartnerProfileHeader
					partner={partner}
					tabValue={tabValue}
					onTabChange={handleTabChange}
				/>
			}
			content={
				<Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>
					{/* ── TAB: Resumen ─────────────────────────────────── */}
					{tabValue === 0 && (
						<Box
							className="flex flex-col md:flex-row"
							sx={{ height: { xs: 'auto', md: '100%' } }}
						>
							<PartnerProfileSidebar partner={partner} />
							<PartnerProfileOverview partner={partner} />
						</Box>
					)}

					{/* ── TAB: Impuestos ───────────────────────────────── */}
					{tabValue === 1 && <PartnerProfileTaxes partner={partner} />}

					{/* ── TAB: Archivos ─────────────────────────────────── */}
					{tabValue === 2 && <PartnerProfileFiles partner={partner} />}
				</Box>
			}
			scroll="content"
		/>
	);
}
