import { useState, useMemo } from "react";
import {
    Box,
    Stack,
    Button,
    useTheme,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useIndexCategories } from "@/features/categories/hooks/useIndexCategories";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";
import { CategoriesModal } from "./modals/CategoriesModal";
import { useToggleCategoryStatus } from "@/features/categories/hooks/useToggleCategoryStatus";
import CategoriesTable from "./CategoriesTable";

export default function CategoriesTabView() {
    const theme = useTheme();
    const { categories, isLoading } = useIndexCategories();
    const toggleCategoryStatus = useToggleCategoryStatus();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

    // Derived Data: Only Parent Categories
    const parentCategories = useMemo(() => {
        return categories?.filter(c => !c.parent_id) || [];
    }, [categories]);

    // Handlers
    const handleCreateCategory = () => {
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
            status: !category.is_active,
        });
    };

    return (
        <Box className="w-full h-full flex flex-col">
            {/* Header Section */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <div />
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="medium"
                    startIcon={
                        <FuseSvgIcon size={20}>
                            heroicons-outline:plus
                        </FuseSvgIcon>
                    }
                    onClick={handleCreateCategory}
                >
                    Create Category
                </Button>
            </Stack>

            {/* Table Section */}
            <Box className="flex-1 overflow-auto">
                <CategoriesTable
                    categories={parentCategories}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={(id) => console.log("Delete category", id)}
                    onStatusChange={handleStatusChange}
                    showParentColumn={false}
                />
            </Box>

            <CategoriesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={selectedCategory ? 'edit_category' : 'create_category'}
                data={selectedCategory}
                initialParent={null}
            />
        </Box>
    );
}
