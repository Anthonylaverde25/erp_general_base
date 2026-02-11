import { Box, Tabs, Tab } from "@mui/material";
import { useIndexPartners } from "@/features/partners/hooks/useIndexPartners";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import PartnerTable from "./PartnerTable";
import { useState, useMemo } from "react";

export default function PartnersTabView() {
    const { data: partners, isLoading } = useIndexPartners();
    const [currentTab, setCurrentTab] = useState('all');

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const filteredPartners = useMemo(() => {
        if (!partners) return [];
        switch (currentTab) {
            case 'client':
                return partners.filter(p => p.role === 'client' || p.role === 'both');
            case 'supplier':
                return partners.filter(p => p.role === 'supplier' || p.role === 'both');
            case 'both':
                return partners.filter(p => p.role === 'both');
            case 'prospect':
                return partners.filter(p => p.role === 'prospect');
            default:
                return partners;
        }
    }, [partners, currentTab]);

    const handleEdit = (partner: PartnerEntity) => {
        console.log("Edit partner", partner);
    };

    return (
        <Box className="flex flex-col w-full h-full overflow-hidden">
            <Box className="p-1" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="filter partners by role"
                    className="p-3"
                >
                    <Tab label="Todos" value="all" />
                    <Tab label="Clientes" value="client" />
                    <Tab label="Proveedores" value="supplier" />
                    <Tab label="Ambos" value="both" />
                    <Tab label="Prospectos" value="prospect" />
                </Tabs>
            </Box>

            <Box className="flex-1 overflow-hidden">
                <PartnerTable
                    partners={filteredPartners}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={(id) => console.log("Delete partner", id)}
                />
            </Box>
        </Box>
    );
}
