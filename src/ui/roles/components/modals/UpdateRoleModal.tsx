import { Dialog, Box, CircularProgress } from '@mui/material';
import UpdateRoleForm from '../forms/UpdateRoleForm';
import useShowRole from '@/features/roles/hooks/useShowRole';
import { IRole } from '@/types/role.types';

interface UpdateRoleDialogProps {
	open: boolean;
	onClose: () => void;
	roleId?: IRole['id'];
}

export default function UpdateRoleDialog({ open, onClose, roleId }: UpdateRoleDialogProps) {
	if (!roleId) return null;

	const { role, isLoading } = useShowRole(roleId);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			key={roleId}
			PaperProps={{
				sx: {
					borderRadius: 0,
					bgcolor: 'background.paper',
					boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
					width: '100%'
				}
			}}
		>
			{isLoading || !role ? (
				<Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<CircularProgress size={40} />
				</Box>
			) : (
				<UpdateRoleForm
					role={role}
					onCancel={onClose}
					onSuccess={onClose}
				/>
			)}
		</Dialog>
	);
}
