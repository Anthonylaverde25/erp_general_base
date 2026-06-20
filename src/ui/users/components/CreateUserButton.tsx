import { Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import CreateUserModal from '@/ui/users/components/modals/CreateUserModal';

export default function CreateUserButton() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				variant="contained"
				color="secondary"
				size="small"
				startIcon={<FuseSvgIcon size={16}>heroicons-outline:user-plus</FuseSvgIcon>}
				onClick={() => setOpen(true)}
				sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
			>
				Crear usuario
			</Button>

			<CreateUserModal
				open={open}
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
