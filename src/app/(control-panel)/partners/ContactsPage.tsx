import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { CreateContactModal } from './CreateContactModal';
import axiosInstance from '@/lib/@axios';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	}
}));

function ContactsPage() {
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			const {
				data: { partners }
			} = await axiosInstance.get('/partners');
			console.log('partners', partners);
		};
		fetch();
	}, []);

	return (
		<>
			<Root
				header={
					<div className="flex w-full flex-col p-6 sm:p-10">
						<div className="flex w-full items-center justify-between">
							<div>
								<h2 className="text-3xl font-semibold tracking-tight">Contacts</h2>
								<p className="text-secondary">Manage your contacts.</p>
							</div>
							<div className="flex items-center gap-2">
								<Button
									component={Link}
									to="new"
									variant="contained"
									color="secondary"
									startIcon={<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>}
								>
									Create New Contact
								</Button>
								<Button
									variant="outlined"
									color="secondary"
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
									onClick={() => setOpenModal(true)}
								>
									Create Contact 2
								</Button>
							</div>
						</div>
					</div>
				}
				content={
					<div className="p-6 sm:p-10">
						<div className="border-divider flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-gray-50 p-12 dark:bg-transparent">
							<FuseSvgIcon
								size={48}
								className="text-hint mb-4"
							>
								heroicons-outline:users
							</FuseSvgIcon>
							<h3 className="text-text-secondary text-lg font-medium">No contacts found</h3>
							<p className="text-secondary mt-1 max-w-sm text-center">
								Get started by creating your first contact.
							</p>
						</div>
					</div>
				}
			/>
			<CreateContactModal
				open={openModal}
				handleClose={() => setOpenModal(false)}
			/>
		</>
	);
}

export default ContactsPage;
