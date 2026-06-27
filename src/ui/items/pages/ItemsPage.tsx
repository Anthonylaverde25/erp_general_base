import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ItemsHeader from '../components/ItemsHeader';
import ItemsTabView from '../components/ItemsTabView';

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

export default function ItemsPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const currentTab = useMemo(() => {
		if (location.pathname.endsWith('/products')) return 'physical';
		if (location.pathname.endsWith('/services')) return 'service';
		return 'all';
	}, [location.pathname]);

	const handleCreate = () => {
		if (currentTab === 'physical' || currentTab === 'service') {
			navigate(`/items/create?type=${currentTab}`);
		} else {
			navigate('/items/create');
		}
	};

	const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
		if (newValue === 'physical') {
			navigate('/items/products');
		} else if (newValue === 'service') {
			navigate('/items/services');
		} else {
			navigate('/items');
		}
	};

	return (
		<Root
			header={
				<ItemsHeader
					onCreate={handleCreate}
					currentTab={currentTab}
				/>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					<ItemsTabView
						currentTab={currentTab}
						onTabChange={handleTabChange}
					/>
				</Box>
			}
			scroll="content"
		/>
	);
}
