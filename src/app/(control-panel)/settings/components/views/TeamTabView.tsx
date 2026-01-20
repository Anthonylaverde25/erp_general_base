
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useState } from 'react';
import { useTeamMembers } from '../../api/hooks/team/useTeamMembers';
import { useUpdateTeamMembers } from '../../api/hooks/team/useUpdateTeamMembers';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useIndexUser from '@/features/users/hooks/useIndexUsers';
import UserDataTable from '@/ui/users/component/UserDataTable';
import Tooltip from '@mui/material/Tooltip';
import { UserColumns } from '@/ui/users/component/Columns';
import { Button, Divider, Stack } from '@mui/material';
import CreateUserModal from '@/ui/users/component/modals/CreateUserModal';
import useCreateUser from '@/features/users/hooks/useCreateUser';
import useRoles from '@/features/users/hooks/useRoles';
import { CreateUserType } from '@/types/user.types';
import CreateUserButton from '@/ui/users/component/CreateUserButton';

const roles = [
	{
		label: 'Read',
		value: 'read',
		description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
	},
	{
		label: 'Write',
		value: 'write',
		description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
	},
	{
		label: 'Admin',
		value: 'admin',
		description:
			'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
	}
];

function TeamTabView() {
	const { users, isLoading, isError } = useIndexUser();
	const { data: roles } = useRoles();



	return (
		<div className="flex flex-col gap-4 w-full">
			<Stack className='border p-2 mb-5'
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={1.5}
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

			<UserDataTable
				columns={UserColumns}
				data={users}
				enableRowActions
				positionActionsColumn="last"
				renderRowActions={({ row }) => <UserActionMenu row={row} />}
				enableRowSelection={true}
				initialState={{
					density: 'comfortable',
					pagination: { pageSize: 10, pageIndex: 0 },
				}}
				muiTablePaperProps={{
					elevation: 0,
					sx: {
						borderRadius: 0,
					}
				}}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						size: 60,
						header: '',
					}
				}}
			/>


		</div>
	);
}

function UserActionMenu({ row }: { row: any }) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton
				onClick={handleClick}
				size="small"
				sx={{
					padding: '4px',
					'&:hover': {
						backgroundColor: 'action.hover'
					}
				}}
			>
				<FuseSvgIcon size={16}>heroicons-outline:ellipsis-horizontal</FuseSvgIcon>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={() => setAnchorEl(null)}
				onClick={(e) => e.stopPropagation()}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				PaperProps={{
					elevation: 2,
					sx: {
						minWidth: 140,
						mt: 0.5,
						borderRadius: 1,
						'& .MuiMenuItem-root': {
							px: 1.5,
							py: 0.75,
							fontSize: '0.8125rem',
							gap: 1,
							'& .MuiListItemIcon-root': {
								minWidth: 'auto',
								color: 'text.secondary'
							}
						}
					}
				}}
			>
				<MenuItem onClick={(e) => { handleClose(e); console.log('Ver:', row.original.id); }}>
					<ListItemIcon>
						<FuseSvgIcon size={16}>heroicons-outline:eye</FuseSvgIcon>
					</ListItemIcon>
					Ver detalles
				</MenuItem>
				<MenuItem onClick={(e) => { handleClose(e); console.log('Editar:', row.original.id); }}>
					<ListItemIcon>
						<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
					</ListItemIcon>
					Editar
				</MenuItem>
				<MenuItem
					onClick={(e) => { handleClose(e); console.log('Eliminar:', row.original.id); }}
					sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main !important' } }}
				>
					<ListItemIcon>
						<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
					</ListItemIcon>
					Eliminar
				</MenuItem>
			</Menu>
		</>
	);
}

export default TeamTabView;