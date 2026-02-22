import { Button, ButtonGroup, Typography, Box, Stack, useTheme } from '@mui/material';
import { Link } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from '@/components/PageBreadcrumb';

interface PartnersHeaderProps {
	onCreate?: () => void;
	selectedTab?: string;
}

const TAB_TITLES: Record<string, string> = {
	all: 'Socios | Todos',
	client: 'Socios | Clientes',
	supplier: 'Socios | Proveedores',
	client_supplier: 'Socios | Clientes-Proveedores',
	prospect: 'Socios | Prospectos'
};

function PartnersHeader(props: PartnersHeaderProps) {
	const { onCreate, selectedTab = 'all' } = props;
	const theme = useTheme();

	const title = TAB_TITLES[selectedTab] || 'Socios';

	return (
		<Box
			className="container"
			sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
		>
			<PageBreadcrumb className="mb-4" />
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
			>
				<Box>
					<Typography
						variant="h2"
						className="text-3xl font-bold tracking-tight"
					>
						{title}
					</Typography>
					<Typography
						variant="subtitle1"
						color="text.secondary"
					>
						Manage your business partners
					</Typography>
				</Box>
				<ButtonGroup
					variant="contained"
					color="secondary"
					aria-label="create partner button group"
				>
					<Button
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
						onClick={onCreate}
					>
						Create Partner
					</Button>
					<Button
						component={Link}
						to="create"
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
					>
						Create Partner 2
					</Button>
				</ButtonGroup>
			</Stack>
		</Box>
	);
}

export default PartnersHeader;
