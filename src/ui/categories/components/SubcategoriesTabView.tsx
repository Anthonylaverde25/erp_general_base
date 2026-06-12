import { useState, useMemo } from 'react';
import { Box, Button, Stack, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useIndexCategories } from '@/features/categories/hooks/useIndexCategories';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import { CategoriesModal } from './modals/CategoriesModal';
import { useToggleCategoryStatus } from '@/features/categories/hooks/useToggleCategoryStatus';
import CategoriesTable from './CategoriesTable';

export default function SubcategoriesTabView() {
	const theme = useTheme();
	const { categories, isLoading } = useIndexCategories();
	const toggleCategoryStatus = useToggleCategoryStatus();

	// Modal State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

	// Derived Data: Flatten Subcategories with Parent Name injected for grouping
	const subCategories = useMemo(() => {
		if (!categories) return [];

		// Flatten children from all top-level categories
		return categories.reduce<CategoryEntity[]>((acc, category) => {
			if (category.children && category.children.length > 0) {
				// Determine the parent name to use (either existing parent_name or the current category name)
				const parentName = category.name;

				// Map children and inject current category name as parent_name for grouping
				const childrenWithParent = category.children.map((child) => ({
					...child,
					parent_id: category.id, // Ensure parent_id is set to grouping parent
					parent_name: parentName
				})) as CategoryEntity[];

				return [...acc, ...childrenWithParent];
			}

			return acc;
		}, []);
	}, [categories]);

	// Handlers
	const handleCreateSubcategory = () => {
		setSelectedCategory(null);
		setIsModalOpen(true);
	};

	const handleEdit = (category: CategoryEntity) => {
		setSelectedCategory(category);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCategory(null);
	};

	const handleStatusChange = (category: CategoryEntity) => {
		toggleCategoryStatus.mutate({
			id: category.id,
			status: !category.is_active
		});
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
					onClick={handleCreateSubcategory}
					sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '4px', boxShadow: 'none' }}
				>
					Create Subcategory
				</Button>
			</Stack>

			{/* Table Section */}
			<Box className="flex-1 overflow-auto">
				<CategoriesTable
					categories={subCategories}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={(id) => console.log('Delete subcategory', id)}
					onStatusChange={handleStatusChange}
					showParentColumn={false}
					enableGrouping={true}
				/>
			</Box>

			<CategoriesModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				mode={selectedCategory ? 'edit_subcategory' : 'create_subcategory'}
				data={selectedCategory}
				// initialParent is not needed here as the form will list all parents for selection
				initialParent={null}
			/>
		</Box>
	);
}
