import { lazy, useState, useEffect } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import PartnersHeader from '../components/PartnersHeader';
import { useSearchParams } from 'react-router';
import { CreatePartnerModal } from '@/ui/partners/components/modals/CreatePartnerModal';

const PartnersTabView = lazy(() => import('../components/PartnersTabView'));

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
					<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
						<PartnersTabView
							currentTab={currentTab}
							onTabChange={handleTabChange}
						/>
					</Box>
				}
				scroll="content"
			/>
			<CreatePartnerModal
				open={openCreateModal}
				handleClose={() => setOpenCreateModal(false)}
			/>
		</>
	);
}
