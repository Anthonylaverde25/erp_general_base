import FusePageCarded from '@fuse/core/FusePageCarded';
import { lazy, useState, useEffect } from 'react';
import styled from 'styled-components';

const PartnersTabView = lazy(() => import('../components/PartnersTabView'));

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

import PartnersHeader from '../components/PartnersHeader';
import { useSearchParams } from 'react-router';
// import { lazy, useState, SyntheticEvent } from "react"; // Moved to top
import { CreatePartnerModal } from '@/app/(control-panel)/partners/CreatePartnerModal';

export default function PartnersPage({ defaultTab = 'all' }: { defaultTab?: string }) {
	const [searchParams] = useSearchParams();
	const typeParam = searchParams.get('type');

	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [currentTab, setCurrentTab] = useState(typeParam || defaultTab);

	useEffect(() => {
		if (typeParam) {
			setCurrentTab(typeParam);
		}
	}, [typeParam]);

	const handleCreate = () => {
		setOpenCreateModal(true);
	};

	const handleTabChange = (newValue: string) => {
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
