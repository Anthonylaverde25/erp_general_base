import FusePageCarded from '@fuse/core/FusePageCarded';
import { lazy, useState } from 'react';
import styled from 'styled-components';

const PartnersTabView = lazy(() => import('../components/PartnersTabView'));

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

import PartnersHeader from '../components/PartnersHeader';
// import { lazy, useState, SyntheticEvent } from "react"; // Moved to top
import { CreatePartnerModal } from '@/app/(control-panel)/partners/CreatePartnerModal';

export default function PartnersPage({ defaultTab = 'all' }: { defaultTab?: string }) {
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [currentTab, setCurrentTab] = useState(defaultTab);

	const handleCreate = () => {
		setOpenCreateModal(true);
	};

	const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
		setCurrentTab(newValue);
	};

	return (
		<>
			<Root
				header={
					<PartnersHeader
						onCreate={handleCreate}
						selectedTab={currentTab}
					/>
				}
				content={
					<PartnersTabView
						currentTab={currentTab}
						onTabChange={handleTabChange}
					/>
				}
			/>
			<CreatePartnerModal
				open={openCreateModal}
				handleClose={() => setOpenCreateModal(false)}
			/>
		</>
	);
}
