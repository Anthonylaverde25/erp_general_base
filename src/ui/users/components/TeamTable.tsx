import { IUser } from '@/types/user.types';
import UserDataTable from './UserDataTable';
import { UserColumns } from './Columns';
import UserActionMenu from './UserActionMenu';

interface TeamTableProps {
	users: IUser[] | undefined;
	onEdit: (id: number) => void;
	onAssociateEmployees: (user: IUser) => void;
	onManagePermissions: (user: IUser) => void;
}

export default function TeamTable(props: TeamTableProps) {
	const { users, onEdit, onAssociateEmployees, onManagePermissions } = props;

	return (
		<UserDataTable
			columns={UserColumns}
			data={users || []}
			enableRowActions
			positionActionsColumn="last"
			renderRowActions={({ row }) => (
				<UserActionMenu
					row={row}
					onEdit={() => onEdit(row.original.id)}
					onAssociateEmployees={() => onAssociateEmployees(row.original)}
					onManagePermissions={() => onManagePermissions(row.original)}
				/>
			)}
			enableRowSelection
			initialState={{
				density: 'compact',
				pagination: { pageSize: 10, pageIndex: 0 }
			}}
			muiTablePaperProps={{
				elevation: 0,
				sx: { borderRadius: 0 }
			}}
			displayColumnDefOptions={{
				'mrt-row-actions': {
					size: 60,
					header: ''
				}
			}}
		/>
	);
}
