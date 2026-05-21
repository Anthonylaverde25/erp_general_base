import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch, Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';

interface CategoriesTableProps {
	categories: CategoryEntity[] | undefined;
	isLoading?: boolean;
	showParentColumn?: boolean;
	enableGrouping?: boolean;
	onEdit: (category: CategoryEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (category: CategoryEntity) => void;
}

export default function CategoriesTable(props: CategoriesTableProps) {
	const {
		categories,
		isLoading,
		showParentColumn = false,
		enableGrouping = false,
		onEdit,
		onDelete,
		onStatusChange
	} = props;

	const columns = useMemo<MRT_ColumnDef<CategoryEntity>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ cell }) => (
					<span className="font-semibold text-13">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'description',
				header: 'Description',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			},
			...(showParentColumn || enableGrouping
				? [
						{
							accessorKey: 'parent_name',
							header: 'Parent Category',
							Cell: ({ cell }) => {
								const val = cell.getValue<string>();
								if (!val) return '-';
								return (
									<Chip
										label={val}
										size="small"
										sx={{
											borderRadius: 0,
											fontSize: '0.75rem',
											height: 20
										}}
										variant="outlined"
										color="info"
									/>
								);
							}
						} as MRT_ColumnDef<CategoryEntity>
					]
				: []),
			{
				accessorKey: 'is_active',
				header: 'Active',
				Cell: ({ row }) => (
					<Switch
						checked={row.original.is_active}
						onChange={() => onStatusChange(row.original)}
						inputProps={{ 'aria-label': 'controlled' }}
						size="small"
					/>
				)
			}
		],
		[showParentColumn, enableGrouping, onStatusChange]
	);

	return (
		<DataTable
			data={categories || []}
			columns={columns}
			state={{ isLoading }}
			enableGrouping={enableGrouping}
			initialState={{
				grouping: enableGrouping ? ['parent_name'] : [],
				density: 'compact'
			}}
			enableRowSelection={false}
			renderRowActionMenuItems={({ closeMenu, row }) => [
				<MenuItem
					key="edit"
					onClick={() => {
						onEdit(row.original);
						closeMenu();
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
					</ListItemIcon>
					Edit
				</MenuItem>,
				<MenuItem
					key="delete"
					onClick={() => {
						onDelete(row.original.id);
						closeMenu();
					}}
					sx={{ color: 'error.main' }}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20} className="text-red">heroicons-outline:trash</FuseSvgIcon>
					</ListItemIcon>
					Delete
				</MenuItem>
			]}
		/>
	);
}
