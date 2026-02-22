import useIndexBankAccounts from '@/features/bank_accounts/hooks/useIndexBankAccounts';
import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import CreateBankAccountModal from '../components/modals/CreateBankAccountModal';
import UpdateBankAccountModal from '../components/modals/UpdateBankAccountModal';
import { IBankAccount } from '@/types/bank_account.types';
import BankAccountsTable from './BankAccountsTable';

interface BankAccountsTabViewProps {
	createButtonText?: string;
}

export default function BankAccountsTabView({ createButtonText = 'Crear cuenta bancaria' }: BankAccountsTabViewProps) {
	const theme = useTheme();
	const { bankAccounts, isLoading, isError } = useIndexBankAccounts();
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [selectedBankAccount, setSelectedBankAccount] = useState<IBankAccount['id'] | null>(null);

	const handleEditBankAccount = (bankAccountId: IBankAccount['id']) => {
		console.log('Editing bank account with ID:', bankAccountId);
		setSelectedBankAccount(bankAccountId);
		setUpdateModalOpen(true);
	};

	// useEffect(() => {
	//   const fetchBankAccounts = async () => {
	//     const response = await axiosInstance.get("payment-methods/");
	//     console.log(response.data);
	//   };
	//   fetchBankAccounts();
	// }, [])

	if (isLoading)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="text.secondary">Cargando cuentas bancarias...</Typography>
			</Box>
		);

	if (isError)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="error">Error al cargar las cuentas bancarias</Typography>
			</Box>
		);

	return (
		<Box className="w-full overflow-hidden">
			{/* Header Section */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				sx={{
					p: 3,
					borderBottom: `1px solid ${theme.palette.divider}`
				}}
			>
				<div />
				<Button
					className="btn-primary"
					variant="contained"
					color="primary"
					size="large"
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:building-library</FuseSvgIcon>}
					onClick={() => setCreateModalOpen(true)}
				>
					{createButtonText}
				</Button>
			</Stack>

			{/* Table Section */}
			{/* Table Section */}
			<BankAccountsTable
				bankAccounts={bankAccounts}
				onEdit={handleEditBankAccount}
				onDelete={() => {}}
			/>

			{/* Modals */}
			<CreateBankAccountModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>

			{selectedBankAccount && (
				<UpdateBankAccountModal
					open={updateModalOpen}
					onClose={() => {
						setUpdateModalOpen(false);
						setSelectedBankAccount(null);
					}}
					bankAccountId={selectedBankAccount}
				/>
			)}
		</Box>
	);
}
