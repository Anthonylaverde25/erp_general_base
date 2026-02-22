import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import UnitTypesTable from './UnitTypesTable';
import UnitTypesModal from './modals/UnitTypesModal';
import { useIndexUnitTypes } from '@/features/unit_types/hooks/useIndexUnitTypes';
import { useDeleteUnitType } from '@/features/unit_types/hooks/useDeleteUnitType';
import { UnitTypeEntity } from '@/domain/entities/unit_types/UnitTypeEntity';

export default function UnitTypesTabView() {
	const { t } = useTranslation();
	const theme = useTheme();
	const { unitTypes, isLoading } = useIndexUnitTypes();
	const deleteUnitType = useDeleteUnitType();

	const [openModal, setOpenModal] = useState(false);
	const [selectedUnitType, setSelectedUnitType] = useState<UnitTypeEntity | null>(null);
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

	const handleCreate = () => {
		setSelectedUnitType(null);
		setModalMode('create');
		setOpenModal(true);
	};

	const handleEdit = (unitType: UnitTypeEntity) => {
		setSelectedUnitType(unitType);
		setModalMode('edit');
		setOpenModal(true);
	};

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this unit type?')) {
			deleteUnitType.mutate(id);
		}
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedUnitType(null);
	};

	return (
		<Box className="flex h-full w-full flex-col">
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
					size="medium"
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleCreate}
				>
					Create Unit Type
				</Button>
			</Stack>

			{/* Table Section */}
			<Box className="flex-1 overflow-auto">
				<UnitTypesTable
					unitTypes={unitTypes}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</Box>

			<UnitTypesModal
				open={openModal}
				handleClose={handleCloseModal}
				mode={modalMode}
				selectedUnitType={selectedUnitType}
			/>
		</Box>
	);
}
