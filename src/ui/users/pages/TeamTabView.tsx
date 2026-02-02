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
import useActiveCompany from '@/features/companies/useActiveCompany';

export default function TeamTabView() {

    const { users, isLoading, isError } = useIndexUser();
    // const activeCompany = useActiveCompany();
    // console.log('active_company_id', activeCompany?.id)

    const [selectedId, setSelectedId] = useState<UserType['id'] | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const handleEditUser = (id: UserType['id']) => {
        setSelectedId(id);
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
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                        className='btn-secondary'
                        variant="outlined"
                        color="secondary"
                        size="large"
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:arrow-down</FuseSvgIcon>}
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
                renderRowActions={({ row }) => (
                    <UserActionMenu
                        row={row}
                        onEdit={() => handleEditUser(row.original.id)}
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

            {selectedId && (
                <UpdateUserModal
                    open={updateModalOpen}
                    onClose={() => {
                        setUpdateModalOpen(false);
                        setSelectedId(null);
                    }}
                    userId={selectedId}
                />
            )}
        </div>
    );
}
