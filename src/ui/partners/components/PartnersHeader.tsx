import { Button } from '@mui/material';
import { Link } from 'react-router';
import { Plus, UserPlus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

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

	const title = TAB_TITLES[selectedTab] || 'Socios';

	return (
		<PageHeader
			title={title}
			subtitle="Gestiona la información de tus socios comerciales, clientes y proveedores."
			actions={
				<>
					<Button
						onClick={onCreate}
						variant="outlined"
						color="secondary"
						size="small"
						startIcon={<Plus size={18} />}
						sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '4px' }}
					>
						Crear Socio (Rápido)
					</Button>
					<Button
						component={Link}
						to="create"
						variant="contained"
						color="secondary"
						size="small"
						startIcon={<UserPlus size={18} />}
						sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px' }}
					>
						Crear Socio (Detallado)
					</Button>
				</>
			}
		/>
	);
}

export default PartnersHeader;
