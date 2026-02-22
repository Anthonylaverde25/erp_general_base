import { useIndexItems } from '@/features/items/hooks/useIndexItems';
import ItemTable from './ItemTable';
import { useMemo } from 'react';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { useNavigate } from 'react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ItemsTabViewProps {
	currentTab: string;
	onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function ItemsTabView({ currentTab, onTabChange }: ItemsTabViewProps) {
	const navigate = useNavigate();
	const { data: items, isLoading } = useIndexItems();

	const filteredItems = useMemo(() => {
		if (!items) return [];

		let result = items;

		switch (currentTab) {
			case 'physical':
				result = result.filter((item) => item.type === 'physical');
				break;
			case 'service':
				result = result.filter((item) => item.type === 'service');
				break;
			default:
				break;
		}

		return result;
	}, [items, currentTab]);

	const handleEdit = (item: ItemEntity) => {
		navigate(`/items/${item.id}/edit`);
	};

	const handleDelete = (id: number) => {
		// pending: wire delete flow
		void id;
	};

	const handleRowClick = (item: ItemEntity) => {
		navigate(`/items/${item.id}`);
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<div className="flex items-center gap-4 border-b p-4">
				<Tabs
					value={currentTab}
					onValueChange={(value) => onTabChange(null as unknown as React.SyntheticEvent, value)}
				>
					<TabsList>
						<TabsTrigger value="all">Todos</TabsTrigger>
						<TabsTrigger value="physical">Productos Físicos</TabsTrigger>
						<TabsTrigger value="service">Servicios</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="flex-1 overflow-hidden">
				<ItemTable
					items={filteredItems}
					isLoading={isLoading}
					currentTab={currentTab}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onRowClick={handleRowClick}
				/>
			</div>
		</div>
	);
}
