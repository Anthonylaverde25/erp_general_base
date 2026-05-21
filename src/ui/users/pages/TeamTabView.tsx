import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import useIndexUser from '@/features/users/hooks/useIndexUsers';
import TeamTable from '../component/TeamTable';
import CreateUserButton from '@/ui/users/component/CreateUserButton';
import UpdateUserModal from '@/ui/users/component/modals/UpdateUserModal';
import { IUser } from '@/types/user.types';

export default function TeamTabView() {
	const { users, isLoading, isError } = useIndexUser();

	const [selectedId, setSelectedId] = useState<IUser['id'] | null>(null);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);

	const handleEditUser = (id: IUser['id']) => {
		setSelectedId(id);
		setUpdateModalOpen(true);
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
						className="btn-secondary"
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

			<TeamTable
				users={users}
				onEdit={handleEditUser}
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
