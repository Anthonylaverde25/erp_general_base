import { Box, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useIndexPartners } from '@/features/partners/hooks/useIndexPartners';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import PartnerTable from './PartnerTable';
import { useState, useMemo } from 'react';
import UpdatePartnerModal from './modals/UpdatePartnerModal';
import PartnerDetailDrawer from './PartnerDetailDrawer';

interface PartnersTabViewProps {
	currentTab: string;
	onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function PartnersTabView({ currentTab, onTabChange }: PartnersTabViewProps) {
	const { data: partners, isLoading } = useIndexPartners();
	// const [currentTab, setCurrentTab] = useState('all'); // Moved to parent
	const [filteredGeneralType, setFilteredGeneralType] = useState<string>('all');

	const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	// Drawer state
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerPartner, setDrawerPartner] = useState<PartnerEntity | null>(null);

	// handleTabChange is now passed as prop
	/*
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };
    */

	const handleTypeChange = (event: SelectChangeEvent) => {
		setFilteredGeneralType(event.target.value);
	};

	const filteredPartners = useMemo(() => {
		if (!partners) return [];

		let result = partners;

		// Filter by Tab (Role)
		switch (currentTab) {
			case 'client':
				result = result.filter((p) => p.role === 'client' || p.role === 'client_supplier');
				break;
			case 'supplier':
				result = result.filter((p) => p.role === 'supplier' || p.role === 'client_supplier');
				break;
			case 'client_supplier':
				result = result.filter((p) => p.role === 'client_supplier');
				break;
			case 'prospect':
				result = result.filter((p) => p.role === 'prospect');
				break;
			default:
				// 'all' tab, no initial role filter
				break;
		}

		// Filter by Select (Type)
		if (filteredGeneralType !== 'all') {
			result = result.filter((p) => p.type === filteredGeneralType);
		}

		return result;
	}, [partners, currentTab, filteredGeneralType]);

	const handleEdit = (partner: PartnerEntity) => {
		setSelectedPartnerId(partner.id);
		setIsUpdateModalOpen(true);
	};

	const handleCloseUpdateModal = () => {
		setIsUpdateModalOpen(false);
		setSelectedPartnerId(null);
	};

	const handleRowClick = (partner: PartnerEntity) => {
		setDrawerPartner(partner);
		setDrawerOpen(true);
	};

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	};

	return (
		<Box className="flex h-full w-full flex-col overflow-hidden">
			<Box
				className="flex items-center gap-4 p-4"
				sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
			>
				<Tabs
					value={currentTab}
					onChange={onTabChange}
					variant="scrollable"
					scrollButtons="auto"
					indicatorColor="secondary"
					textColor="secondary"
					aria-label="filter partners by role"
					className="min-h-[48px]"
				>
					<Tab
						label="Todos"
						value="all"
					/>
					<Tab
						label="Clientes"
						value="client"
					/>
					<Tab
						label="Proveedores"
						value="supplier"
					/>
					<Tab
						label="Ambos"
						value="client_supplier"
					/>
					<Tab
						label="Prospectos"
						value="prospect"
					/>
				</Tabs>

				<FormControl
					variant="filled"
					size="small"
					sx={{ minWidth: 200 }}
				>
					<InputLabel id="partner-type-select-label">Tipo de Socio</InputLabel>
					<Select
						labelId="partner-type-select-label"
						id="partner-type-select"
						value={filteredGeneralType}
						label="Tipo de Socio"
						onChange={handleTypeChange}
					>
						<MenuItem value="all">Todos</MenuItem>
						<MenuItem value="company">Empresa</MenuItem>
						<MenuItem value="person">Persona</MenuItem>
						<MenuItem value="public_organism">Organismo Público</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<Box className="flex-1 overflow-hidden">
				<PartnerTable
					partners={filteredPartners}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={(id) => console.log('Delete partner', id)}
					onRowClick={handleRowClick}
				/>
			</Box>

			{selectedPartnerId && (
				<UpdatePartnerModal
					open={isUpdateModalOpen}
					onClose={handleCloseUpdateModal}
					partnerId={selectedPartnerId}
				/>
			)}

			<PartnerDetailDrawer
				open={drawerOpen}
				onClose={handleCloseDrawer}
				partner={drawerPartner}
			/>
		</Box>
	);
}
