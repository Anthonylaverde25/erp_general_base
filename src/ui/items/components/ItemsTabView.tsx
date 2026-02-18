import { Box, Tabs, Tab } from "@mui/material";
import { useIndexItems } from "@/features/items/hooks/useIndexItems";
import ItemTable from "./ItemTable";
import { useState, useMemo } from "react";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";

interface ItemsTabViewProps {
    currentTab: string;
    onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function ItemsTabView({ currentTab, onTabChange }: ItemsTabViewProps) {
    const { data: items, isLoading } = useIndexItems();

    const filteredItems = useMemo(() => {
        if (!items) return [];

        let result = items;

        switch (currentTab) {
            case 'physical':
                result = result.filter(item => item.type === 'physical');
                break;
            case 'service':
                result = result.filter(item => item.type === 'service');
                break;
            default:
                break;
        }

        return result;
    }, [items, currentTab]);

    const handleEdit = (item: ItemEntity) => {
        console.log("Edit item", item);
    };

    const handleDelete = (id: number) => {
        console.log("Delete item", id);
    };

    const handleRowClick = (item: ItemEntity) => {
        console.log("Row click", item);
    };

    return (
        <Box className="flex flex-col w-full h-full overflow-hidden">
            <Box className="p-4 flex items-center gap-4" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentTab}
                    onChange={onTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="filter items by type"
                    className="min-h-[48px]"
                >
                    <Tab label="Todos" value="all" />
                    <Tab label="Productos Físicos" value="physical" />
                    <Tab label="Servicios" value="service" />
                </Tabs>
            </Box>

            <Box className="flex-1 overflow-hidden">
                <ItemTable
                    items={filteredItems}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                />
            </Box>
        </Box>
    );
}
