import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import UpdateUserForm from '../forms/UpdateUserForm';
import { IUser } from '@/types/user.types';
import useShowUser from '@/features/users/hooks/useShowUser';
import LoadingProgress from '@/components/LoadingProgress';

interface UpdateUserDialogProps {
	open: boolean;
	onClose: () => void;
	userId: IUser['id'];
}

export default function UpdateUserDialog({ open, onClose, userId }: UpdateUserDialogProps) {
	const { user, isLoading, isError } = useShowUser(userId);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			key={userId}
		>
			<DialogContent>
				{isLoading && <LoadingProgress message="Cargando usuario..." />}

				{isError && (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						minHeight={400}
					>
						<Typography color="error">Error al cargar el usuario</Typography>
					</Box>
				)}

				{!isLoading && !isError && (
					<UpdateUserForm
						user={user}
						onCancel={onClose}
						onSuccess={onClose}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
