import { IUser } from "@/types/user.types";
import UserDataTable from "./UserDataTable";
import { UserColumns } from "./Columns";
import UserActionMenu from "./UserActionMenu";

interface TeamTableProps {
    users: IUser[] | undefined;
    onEdit: (id: number) => void;
}

export default function TeamTable(props: TeamTableProps) {
    const { users, onEdit } = props;

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
                />
            )}
            enableRowSelection
            initialState={{
                density: 'comfortable',
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
