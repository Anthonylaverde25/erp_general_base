import FusePageSimple from '@fuse/core/FusePageSimple';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextFieldProps } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import useActiveCompany from '@/features/companies/useActiveCompany';
import { useIndexCategories } from '@/features/categories/hooks/useIndexCategories';
import { useIndexFamilies } from '@/features/families/hooks/useIndexFamilies';
import { useIndexSupplierPartners } from '@/features/partners/hooks/useIndexSupplierPartners';
import useIndexStores from '@/features/stores/hooks/useIndexStores';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import { useIndexUnitTypes } from '@/features/unit_types/hooks/useIndexUnitTypes';
import { ItemFormType, itemSchema } from '@/schemas/items/items.schema';
import CreateItemDescriptionSection from '../create-item/CreateItemDescriptionSection';
import CreateItemGeneralSection from '../create-item/CreateItemGeneralSection';
import CreateItemPageHeader from '../create-item/CreateItemPageHeader';
import CreateItemPricingSection from '../create-item/CreateItemPricingSection';
import CreateItemServiceSection from '../create-item/CreateItemServiceSection';
import CreateItemStockSection from '../create-item/CreateItemStockSection';
import CreateItemTrackingSection from '../create-item/CreateItemTrackingSection';

type ItemFormContainerProps = {
	mode: 'create' | 'edit';
	initialValues: ItemFormType;
	initialImagePreview?: string | null;
	isSubmitting: boolean;
	onSubmit: (values: ItemFormType) => Promise<void>;
	onCancel: () => void;
};

function ItemFormContainer({
	mode,
	initialValues,
	initialImagePreview = null,
	isSubmitting,
	onSubmit,
	onCancel
}: ItemFormContainerProps) {
	const activeCompany = useActiveCompany();
	const { categories } = useIndexCategories();
	const { unitTypes } = useIndexUnitTypes();
	const { data: taxRates = [] } = useIndexTaxRates();
	const { data: families = [] } = useIndexFamilies();
	const { stores = [] } = useIndexStores();
	const { data: partners = [] } = useIndexSupplierPartners();

	const [imagePreview, setImagePreview] = useState<string | null>(initialImagePreview);

	const methods = useForm<ItemFormType>({
		mode: 'onChange',
		resolver: zodResolver(itemSchema),
		defaultValues: initialValues
	});

	const {
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { isValid }
	} = methods;

	const itemType = watch('type');
	const selectedCategoryId = watch('category_id');
	const selectedStoreId = watch('store_id');

	const mainCategories = useMemo(() => categories.filter((category) => category.parent_id === null), [categories]);

	const selectedCategory = useMemo(
		() => categories.find((category) => String(category.id) === selectedCategoryId),
		[categories, selectedCategoryId]
	);

	const subCategories = useMemo(
		() =>
			selectedCategory?.children?.length
				? selectedCategory.children
				: categories.filter(
						(category) => selectedCategoryId && category.parent_id === Number(selectedCategoryId)
					),
		[categories, selectedCategory, selectedCategoryId]
	);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];

			if (!file) {
				return;
			}

			setValue('image', file, { shouldValidate: true });

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		},
		[setValue]
	);

	const handleRemoveImage = () => {
		setValue('image', null, { shouldValidate: true, shouldDirty: true });
		setImagePreview(null);
	};

	const dropzone = useDropzone({
		onDrop,
		accept: { 'image/*': [] },
		maxFiles: 1
	});

	const textFieldProps: TextFieldProps = {
		fullWidth: true,
		variant: 'filled'
	};

	useEffect(() => {
		reset(initialValues);
		setImagePreview(initialImagePreview);
	}, [initialValues, initialImagePreview, reset]);

	useEffect(() => {
		const defaultStoreId = activeCompany?.settings?.defaultStoreId;

		if (defaultStoreId == null || selectedStoreId || itemType === 'service') {
			return;
		}

		setValue('store_id', String(defaultStoreId), {
			shouldValidate: true,
			shouldDirty: false
		});
	}, [activeCompany?.settings?.defaultStoreId, selectedStoreId, itemType, setValue]);

	return (
		<FormProvider {...methods}>
			<FusePageSimple
				header={
					<CreateItemPageHeader
						itemType={itemType}
						mode={mode}
						isLoading={isSubmitting}
						isValid={isValid}
						onCancel={onCancel}
						onSave={handleSubmit(onSubmit)}
					/>
				}
				content={
					<div className="mx-auto w-full max-w-5xl p-8">
						<form className="flex flex-col gap-8">
							<CreateItemGeneralSection
								isLoading={isSubmitting}
								itemType={itemType}
								textFieldProps={textFieldProps}
								families={families}
								mainCategories={mainCategories}
								selectedCategoryId={selectedCategoryId}
								subCategories={subCategories}
								unitTypes={unitTypes}
								imagePreview={imagePreview}
								onRemoveImage={handleRemoveImage}
								dropzone={dropzone}
							/>

							<CreateItemPricingSection
								isLoading={isSubmitting}
								textFieldProps={textFieldProps}
								taxRates={taxRates}
							/>

							{itemType === 'service' && (
								<CreateItemServiceSection
									isLoading={isSubmitting}
									textFieldProps={textFieldProps}
								/>
							)}

							{itemType === 'physical' && (
								<CreateItemStockSection
									mode={mode}
									isLoading={isSubmitting}
									textFieldProps={textFieldProps}
									stores={stores}
								/>
							)}

							{itemType === 'physical' && (
								<CreateItemTrackingSection
									isLoading={isSubmitting}
									textFieldProps={textFieldProps}
									partners={partners}
								/>
							)}

							<CreateItemDescriptionSection
								isLoading={isSubmitting}
								textFieldProps={textFieldProps}
							/>
						</form>
					</div>
				}
				scroll="content"
			/>
		</FormProvider>
	);
}

export default ItemFormContainer;
