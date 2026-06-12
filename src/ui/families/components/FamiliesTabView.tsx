import { useState } from 'react';
import { Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useIndexFamilies } from '@/features/families/hooks/useIndexFamilies';
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';
import { FamiliesModal } from './modals/FamiliesModal';
import { useUpdateFamily } from '@/features/families/hooks/useUpdateFamily';
import { useToggleFamilyStatus } from '@/features/families/hooks/useToggleFamilyStatus';
import FamiliesTable from './FamiliesTable';

export default function FamiliesTabView() {
	const theme = useTheme();
	const { data: families, isLoading } = useIndexFamilies();
	const updateFamily = useUpdateFamily();
	const toggleFamilyStatus = useToggleFamilyStatus();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFamily, setSelectedFamily] = useState<FamilyEntity | null>(null);

	const handleCreate = () => {
		setSelectedFamily(null);
		setIsModalOpen(true);
	};

	const handleEdit = (family: FamilyEntity) => {
		setSelectedFamily(family);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedFamily(null);
	};

	const handleStatusChange = (family: FamilyEntity) => {
		toggleFamilyStatus.mutate({
			id: family.id,
			status: !family.is_active
		});
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
					variant="contained"
					color="secondary"
					size="small"
					startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
					onClick={handleCreate}
					sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
				>
					Create Family
				</Button>
			</Stack>

			{/* Table Section */}
			{/* Table Section */}
			<FamiliesTable
				families={families}
				isLoading={isLoading}
				onEdit={handleEdit}
				onDelete={(id) => console.log('Delete family', id)}
				onStatusChange={handleStatusChange}
			/>

			<FamiliesModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				data={selectedFamily}
			/>
		</Box>
	);
}
