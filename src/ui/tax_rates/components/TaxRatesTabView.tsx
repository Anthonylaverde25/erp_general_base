import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';
import { TaxRatesModal } from './modals/TaxRatesModal';
import TaxRatesTable from './TaxRatesTable';

export default function TaxRatesTabView() {
	const theme = useTheme();
	const { data: taxRates, isLoading } = useIndexTaxRates();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRateEntity | null>(null);

	const handleCreate = () => {
		setSelectedTaxRate(null);
		setIsModalOpen(true);
	};

	const handleEdit = (taxRate: TaxRateEntity) => {
		setSelectedTaxRate(taxRate);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTaxRate(null);
	};

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
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleCreate}
				>
					Create Tax Rate
				</Button>
			</Stack>

			{/* Table Section */}
			{/* Table Section */}
			{isLoading ? (
				<Box className="flex h-64 items-center justify-center">
					<Typography color="text.secondary">Loading tax rates...</Typography>
				</Box>
			) : (
				<TaxRatesTable
					taxRates={taxRates}
					onEdit={handleEdit}
					onDelete={(id) => console.log('Delete tax rate', id)}
				/>
			)}

			<TaxRatesModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				data={selectedTaxRate}
			/>
		</Box>
	);
}
