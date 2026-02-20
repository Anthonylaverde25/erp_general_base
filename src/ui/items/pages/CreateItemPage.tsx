import FusePageSimple from '@fuse/core/FusePageSimple';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextFieldProps } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useSearchParams } from 'react-router';

import useActiveCompany from '@/features/companies/useActiveCompany';
import { useIndexCategories } from '@/features/categories/hooks/useIndexCategories';
import { useIndexFamilies } from '@/features/families/hooks/useIndexFamilies';
import { useCreateItem } from '@/features/items/hooks/useCreateItem';
import { useIndexPartners } from '@/features/partners/hooks/useIndexPartners';
import useIndexStores from '@/features/stores/hooks/useIndexStores';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import { useIndexUnitTypes } from '@/features/unit_types/hooks/useIndexUnitTypes';
import { defaultCreateItemValues } from '@/schemas/items/items.defaults';
import { ItemFormType, itemSchema } from '@/schemas/items/items.schema';
import CreateItemDescriptionSection from '../components/create-item/CreateItemDescriptionSection';
import CreateItemGeneralSection from '../components/create-item/CreateItemGeneralSection';
import CreateItemPageHeader from '../components/create-item/CreateItemPageHeader';
import CreateItemPricingSection from '../components/create-item/CreateItemPricingSection';
import CreateItemServiceSection from '../components/create-item/CreateItemServiceSection';
import CreateItemStockSection from '../components/create-item/CreateItemStockSection';
import CreateItemTrackingSection from '../components/create-item/CreateItemTrackingSection';
import { mapItemFormToDTO } from '../components/forms/ItemForm.utils';

function CreateItemPage() {
	const activeCompany = useActiveCompany();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const itemType = (searchParams.get('type') || 'physical') as 'physical' | 'service';

	const { handleCreateItem, isLoading: isCreating } = useCreateItem();
	const { categories } = useIndexCategories();
	const { unitTypes } = useIndexUnitTypes();
	const { data: taxRates = [] } = useIndexTaxRates();
	const { data: families = [] } = useIndexFamilies();
	const { stores = [] } = useIndexStores();
	const { data: partners = [] } = useIndexPartners();

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const defaultValues: ItemFormType =
		itemType === 'service'
			? {
					...defaultCreateItemValues,
					type: 'service',
					barcode: undefined,
					is_inventoriable: undefined,
					store_id: undefined,
					initial_stock: undefined,
					quantity: undefined,
					dimension_length: undefined,
					dimension_width: undefined,
					dimension_height: undefined,
					dimension_unit: undefined,
					weight: undefined
				}
			: {
					...defaultCreateItemValues,
					type: 'physical'
				};

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isValid }
	} = useForm<ItemFormType>({
		mode: 'onChange',
		resolver: zodResolver(itemSchema),
		defaultValues
	});

	const selectedCategoryId = watch('category_id');
	const selectedStoreId = watch('store_id');

	const mainCategories = categories.filter((category) => category.parent_id === null);

	const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId);
	const subCategories = selectedCategory?.children?.length
		? selectedCategory.children
		: categories.filter((category) => selectedCategoryId && category.parent_id === Number(selectedCategoryId));

	const parseOptionalNumber = (value: string) => (value === '' ? undefined : Number(value));

	const onCancel = () => {
		navigate(-1);
	};

	const onSubmit = async (values: ItemFormType) => {
		const dto = mapItemFormToDTO(values);

		try {
			const response = await handleCreateItem(dto);
			const createdItemId = response?.item?.id;

			if (createdItemId) {
				navigate(`/items/${createdItemId}`);
				return;
			}

			navigate('/items');
		} catch (error) {
			console.error(error);
		}
	};

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
		const defaultStoreId = activeCompany?.settings?.defaultStoreId;

		if (defaultStoreId == null || selectedStoreId) {
			return;
		}

		setValue('store_id', String(defaultStoreId), {
			shouldValidate: true,
			shouldDirty: false
		});
	}, [activeCompany?.settings?.defaultStoreId, selectedStoreId, setValue]);

	return (
		<FusePageSimple
			header={
				<CreateItemPageHeader
					itemType={itemType}
					isLoading={isCreating}
					isValid={isValid}
					onCancel={onCancel}
					onSave={handleSubmit(onSubmit)}
				/>
			}
			content={
				<div className="mx-auto w-full max-w-5xl p-8">
					<form className="flex flex-col gap-8">
						<CreateItemGeneralSection
							control={control}
							errors={errors}
							isLoading={isCreating}
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
							control={control}
							errors={errors}
							isLoading={isCreating}
							textFieldProps={textFieldProps}
							taxRates={taxRates}
							setValue={setValue}
						/>

						{itemType === 'service' && (
							<CreateItemServiceSection
								control={control}
								errors={errors}
								isLoading={isCreating}
								textFieldProps={textFieldProps}
								parseOptionalNumber={parseOptionalNumber}
							/>
						)}

						{itemType === 'physical' && (
							<CreateItemStockSection
								control={control}
								errors={errors}
								isLoading={isCreating}
								textFieldProps={textFieldProps}
								stores={stores}
							/>
						)}

						{itemType === 'physical' && (
							<CreateItemTrackingSection
								control={control}
								isLoading={isCreating}
								textFieldProps={textFieldProps}
								partners={partners}
								parseOptionalNumber={parseOptionalNumber}
							/>
						)}

						<CreateItemDescriptionSection
							control={control}
							errors={errors}
							isLoading={isCreating}
							textFieldProps={textFieldProps}
						/>
					</form>
				</div>
			}
			scroll="content"
		/>
	);
}

export default CreateItemPage;
