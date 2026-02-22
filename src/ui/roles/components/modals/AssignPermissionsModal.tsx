import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import RolePermissionMatrix from '../RolePermissionMatrix';
import { IRole } from '@/types/role.types';

interface AssignPermissionsModalProps {
	open: boolean;
	onClose: () => void;
	roleId?: IRole['id'] | null;
}

export default function AssignPermissionsModal({ open, onClose, roleId }: AssignPermissionsModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					minHeight: '500px'
				}
			}}
		>
			<DialogTitle className="flex items-center justify-between pb-2">
				<span className="font-semibold">Asignar Permisos</span>
				<IconButton
					onClick={onClose}
					size="small"
				>
					<FuseSvgIcon>heroicons-outline:x-mark</FuseSvgIcon>
				</IconButton>
			</DialogTitle>
			<DialogContent className="flex flex-col gap-4 p-0">
				<RolePermissionMatrix />
			</DialogContent>
		</Dialog>
	);
}
