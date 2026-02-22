import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IUser } from '@/types/user.types';
import { UserColumns } from './Columns';
import UserActionMenu from './UserActionMenu';

interface TeamTableSimpleProps {
	users: IUser[] | undefined;
	onEdit: (id: number) => void;
}

export default function TeamTableSimple(props: TeamTableSimpleProps) {
	const { users, onEdit } = props;

	const table = useMaterialReactTable({
		columns: UserColumns,
		data: users || [],
		enableRowActions: true,
		enableRowSelection: true,
		positionActionsColumn: 'last',
		renderRowActions: ({ row }) => (
			<UserActionMenu
				row={row}
				onEdit={() => onEdit(row.original.id)}
			/>
		),
		initialState: {
			density: 'comfortable',
			pagination: { pageSize: 10, pageIndex: 0 }
		},
		// Standard Material UI styling will apply by default
		muiTablePaperProps: {
			elevation: 1, // Standard elevation
			sx: { borderRadius: 1 }
		}
	});

	return <MaterialReactTable table={table} />;
}
