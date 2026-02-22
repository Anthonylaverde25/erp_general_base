import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { categorySchema, CategoryFormType } from '@/schemas/categories/categories.schema';
import { defaultCreateCategoryValues, defaultUpdateCategoryValues } from '@/schemas/categories/categories.defaults';
import { Button, TextField, Box, Typography, Divider, Stack, Fade, Autocomplete } from '@mui/material';
import { Save, Close } from '@mui/icons-material';

import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory';
import { useShowCategory } from '@/features/categories/hooks/useShowCategory';
import { useIndexCategories } from '@/features/categories/hooks/useIndexCategories';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import { CreateCategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';

import { zodResolver } from '@hookform/resolvers/zod';
import FuseLoading from '@fuse/core/FuseLoading';

export type CategoryFormMode = 'create_category' | 'create_subcategory' | 'edit_category' | 'edit_subcategory';

interface CategoriesFormProps {
	mode: CategoryFormMode;
	data?: CategoryEntity | null;
	initialParent?: CategoryEntity | null;
	onCancel: () => void;
	onSuccess?: () => void;
}

export function CategoriesForm({ mode, data, initialParent, onCancel, onSuccess }: CategoriesFormProps) {
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const { categories: allCategories } = useIndexCategories();

	// Filter out the current category and its children to prevent circular parent selection
	const availableParents =
		allCategories?.filter((cat) => !data || (cat.id !== data.id && cat.parent_id !== data.id)) || [];

	const { data: categoryData, isLoading: isLoadingCategory } = useShowCategory(data?.id || null);

	const formData = categoryData || data;

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid }
	} = useForm<CategoryFormType>({
		mode: 'onChange',
		resolver: zodResolver(categorySchema),
		defaultValues: defaultCreateCategoryValues
	});

	useEffect(() => {
		if (formData) {
			reset(defaultUpdateCategoryValues(formData));
		} else if (initialParent && mode === 'create_subcategory') {
			reset({
				...defaultCreateCategoryValues,
				parent_id: initialParent.id
			});
		} else {
			reset(defaultCreateCategoryValues);
		}
	}, [formData, initialParent, mode, reset]);

	const onSubmit = (values: CategoryFormType) => {
		const payload = values;

		if (data && (mode === 'edit_category' || mode === 'edit_subcategory')) {
			updateCategory.mutate(
				{ id: data.id, data: payload },
				{
					onSuccess: () => {
						onSuccess?.();
						onCancel();
					}
				}
			);
		} else {
			const createData: CreateCategoryDTO = {
				name: values.name,
				description: values.description,
				parent_id: values.parent_id || undefined,
				is_active: values.is_active
			};

			createCategory.mutate(createData, {
				onSuccess: () => {
					onSuccess?.();
					onCancel();
				}
			});
		}
	};

	const isLoading = createCategory.isPending || updateCategory.isPending || isLoadingCategory;

	if (isLoadingCategory) {
		return <FuseLoading />;
	}

	const showParentSelect = mode === 'create_subcategory' || mode === 'edit_subcategory';

	let title = '';
	let subtitle = '';

	switch (mode) {
		case 'create_category':
			title = 'Create Category';
			subtitle = 'Enter details for the new top-level category.';
			break;
		case 'create_subcategory':
			title = 'Create Subcategory';
			subtitle = 'Enter details for the new subcategory.';
			break;
		case 'edit_category':
			title = 'Edit Category';
			subtitle = 'Update the category information.';
			break;
		case 'edit_subcategory':
			title = 'Edit Subcategory';
			subtitle = 'Update the subcategory information.';
			break;
	}

	return (
		<Fade in={true}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-6"
			>
				{/* Header */}
				<Box>
					<Typography
						variant="h6"
						fontWeight={700}
						color="text.primary"
					>
						{title}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						{subtitle}
					</Typography>
				</Box>

				<Divider />

				{/* Form Fields */}
				<Stack spacing={3}>
					{/* Parent Category - Moved to Top */}
					{showParentSelect && (
						<Controller
							name="parent_id"
							control={control}
							render={({ field }) => (
								<Autocomplete
									options={availableParents}
									getOptionLabel={(option) => option.name}
									isOptionEqualToValue={(option, value) => option.id === value.id}
									value={availableParents.find((c) => c.id === field.value) || null}
									onChange={(_, newValue) => {
										field.onChange(newValue ? newValue.id : null);
									}}
									// Fix for dropdown hiding behind modal
									disablePortal
									renderInput={(params) => (
										<TextField
											{...params}
											label="Parent Category"
											placeholder="Select parent category"
											variant="filled"
											error={!!errors.parent_id}
											helperText={errors.parent_id?.message}
											// Require parent for subcategory creation mode
											required={mode === 'create_subcategory'}
										/>
									)}
									disabled={isLoading}
								/>
							)}
						/>
					)}

					{/* Name */}
					<Controller
						name="name"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Name"
								placeholder="e.g. Components"
								variant="filled"
								fullWidth
								error={!!errors.name}
								helperText={errors.name?.message}
								disabled={isLoading}
							/>
						)}
					/>

					{/* Description */}
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Description"
								placeholder="Category description"
								variant="filled"
								fullWidth
								multiline
								rows={3}
								error={!!errors.description}
								helperText={errors.description?.message}
								disabled={isLoading}
							/>
						)}
					/>
				</Stack>

				<Divider sx={{ my: 1 }} />

				{/* Actions */}
				<Stack
					direction="row"
					spacing={2}
					justifyContent="flex-end"
				>
					<Button
						variant="outlined"
						color="inherit"
						onClick={onCancel}
						disabled={isLoading}
						startIcon={<Close />}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={!isValid || isLoading}
						startIcon={<Save />}
					>
						{mode === 'edit_category' || mode === 'edit_subcategory' ? 'Update' : 'Create'}
					</Button>
				</Stack>
			</form>
		</Fade>
	);
}
