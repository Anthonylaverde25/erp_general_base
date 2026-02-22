import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import useIndexTaxTypes from '@/features/tax_types/hooks/useIndexTaxTypes';
import { useToggleTaxTypeStatus } from '@/features/tax_types/hooks/useToggleTaxTypeStatus';
import { TaxTypeEntity } from '@/domain/entities/tax_types/TaxTypeEntity';
import TaxTypesModal from './modals/TaxTypesModal';
import TaxTypesTable from './TaxTypesTable';

export default function TaxTypesTabView() {
	const theme = useTheme();
	const { taxTypes, isLoading, isError } = useIndexTaxTypes();
	const { mutate: toggleStatus } = useToggleTaxTypeStatus();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTaxType, setSelectedTaxType] = useState<TaxTypeEntity | null>(null);

	const handleCreate = () => {
		setSelectedTaxType(null);
		setModalOpen(true);
	};

	const handleEdit = (taxType: TaxTypeEntity) => {
		setSelectedTaxType(taxType);
		setModalOpen(true);
	};

	const handleDelete = (id: number) => {
		console.log('Delete tax type clicked', id);
		// TODO: Implement delete functionality
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedTaxType(null);
	};

	const handleStatusChange = (taxType: TaxTypeEntity) => {
		toggleStatus({
			id: taxType.id,
			status: !taxType.is_active
		});
	};

	if (isLoading)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="text.secondary">Cargando tipos de impuestos...</Typography>
			</Box>
		);

	if (isError)
		return (
			<Box className="flex h-64 items-center justify-center">
				<Typography color="error">Error al cargar los tipos de impuestos</Typography>
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
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleCreate}
				>
					Crear tipo de impuesto
				</Button>
			</Stack>

			{/* Table Section */}
			<TaxTypesTable
				taxTypes={taxTypes}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onStatusChange={handleStatusChange}
			/>

			<TaxTypesModal
				open={modalOpen}
				onClose={handleCloseModal}
				taxType={selectedTaxType}
			/>
		</Box>
	);
}
