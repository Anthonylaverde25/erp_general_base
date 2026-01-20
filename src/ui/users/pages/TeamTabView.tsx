import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import useIndexUser from '@/features/users/hooks/useIndexUsers';
import UserDataTable from '@/ui/users/component/UserDataTable';
import { UserColumns } from '@/ui/users/component/Columns';
import CreateUserButton from '@/ui/users/component/CreateUserButton';
import UpdateUserModal from '@/ui/users/component/modals/UpdateUserModal';
import UserActionMenu from '@/ui/users/component/UserActionMenu';
import { UserType } from '@/types/user.types';

export default function TeamTabView() {
    const { users, isLoading, isError } = useIndexUser();
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const handleEditUser = (user: UserType) => {
        setSelectedUser(user);
        setUpdateModalOpen(true);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <Stack
                className="mb-5 border-b p-4 bg-gray-50/50"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
            >
                <div></div>
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:arrow-down</FuseSvgIcon>}
                    // onClick={handleInviteUser}
                    >
                        Invitar usuario
                    </Button>
                    <CreateUserButton />
                </Stack>
            </Stack>

            <UserDataTable
                columns={UserColumns}
                data={users}
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => <UserActionMenu row={row} onEdit={handleEditUser} />}
                enableRowSelection={true}
                initialState={{
                    density: 'comfortable',
                    pagination: { pageSize: 10, pageIndex: 0 }
                }}
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 0
                    }
                }}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        size: 60,
                        header: ''
                    }
                }}
            />

            {selectedUser && (
                <UpdateUserModal
                    open={updateModalOpen}
                    onClose={() => {
                        setUpdateModalOpen(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />
            )}
        </div>
    );
}
