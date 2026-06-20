import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import useIndexUser from '@/features/users/hooks/useIndexUsers';
import TeamTable from '../components/TeamTable';
import CreateUserButton from '@/ui/users/components/CreateUserButton';
import UpdateUserModal from '@/ui/users/components/modals/UpdateUserModal';
import AssociateEmployeesModal from '@/ui/users/components/modals/AssociateEmployeesModal';
import { IUser } from '@/types/user.types';

export default function TeamTabView() {
	const { users, isLoading, isError } = useIndexUser();

	const [selectedId, setSelectedId] = useState<IUser['id'] | null>(null);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);

	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [associateModalOpen, setAssociateModalOpen] = useState(false);

	const handleEditUser = (id: IUser['id']) => {
		setSelectedId(id);
		setUpdateModalOpen(true);
	};

	const handleAssociateEmployees = (user: IUser) => {
		setSelectedUser(user);
		setAssociateModalOpen(true);
	};

	return (
		<div className="flex w-full flex-col gap-4">
			<Stack
				className="mb-5 border-b bg-gray-50/50 p-4"
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
						size="small"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:arrow-down</FuseSvgIcon>}
						sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
					>
						Invitar usuario
					</Button>
					<CreateUserButton />
				</Stack>
			</Stack>

			<TeamTable
				users={users}
				onEdit={handleEditUser}
				onAssociateEmployees={handleAssociateEmployees}
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

			{selectedUser && (
				<AssociateEmployeesModal
					open={associateModalOpen}
					onClose={() => {
						setAssociateModalOpen(false);
						setSelectedUser(null);
					}}
					user={selectedUser}
				/>
			)}
		</div>
	);
}
