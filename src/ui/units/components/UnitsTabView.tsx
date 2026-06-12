import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import UnitsTable from './UnitsTable';
import UnitsModal from './modals/UnitsModal';
import { useIndexUnits } from '@/features/units/hooks/useIndexUnits';
import { useDeleteUnit } from '@/features/units/hooks/useDeleteUnit';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';

export default function UnitsTabView() {
	const { t } = useTranslation();
	const theme = useTheme();
	const { units, isLoading } = useIndexUnits();
	const deleteUnit = useDeleteUnit();

	const [openModal, setOpenModal] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<UnitEntity | null>(null);
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

	const handleCreate = () => {
		setSelectedUnit(null);
		setModalMode('create');
		setOpenModal(true);
	};

	const handleEdit = (unit: UnitEntity) => {
		setSelectedUnit(unit);
		setModalMode('edit');
		setOpenModal(true);
	};

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this unit?')) {
			deleteUnit.mutate(id);
		}
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedUnit(null);
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
					variant="contained"
					color="secondary"
					size="small"
					startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleCreate}
					sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
				>
					Create Unit
				</Button>
			</Stack>

			{/* Table Section */}
			<Box className="flex-1 overflow-auto">
				<UnitsTable
					units={units}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</Box>

			<UnitsModal
				open={openModal}
				handleClose={handleCloseModal}
				mode={modalMode}
				selectedUnit={selectedUnit}
			/>
		</Box>
	);
}
