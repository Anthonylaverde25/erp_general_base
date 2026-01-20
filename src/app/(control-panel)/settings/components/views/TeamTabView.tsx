import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useState } from 'react';
import useIndexUser from '@/features/users/hooks/useIndexUsers';
import UserDataTable from '@/ui/users/component/UserDataTable';
import { UserColumns } from '@/ui/users/component/Columns';
import { Button, Stack } from '@mui/material';
import CreateUserButton from '@/ui/users/component/CreateUserButton';

function TeamTabView() {
	const { users, isLoading, isError } = useIndexUser();

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
				renderRowActions={({ row }) => <UserActionMenu row={row} />}
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
				<MenuItem
					onClick={(e) => {
						handleClose(e);
						console.log('Ver:', row.original.id);
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={16}>heroicons-outline:eye</FuseSvgIcon>
					</ListItemIcon>
					Ver detalles
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						handleClose(e);
						console.log('Editar:', row.original.id);
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
					</ListItemIcon>
					Editar
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						handleClose(e);
						console.log('Eliminar:', row.original.id);
					}}
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
