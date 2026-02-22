import FuseLoading from '@fuse/core/FuseLoading';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useShowItem } from '@/features/items/hooks/useShowItem';
import { useUpdateItem } from '@/features/items/hooks/useUpdateItem';
import { defaultCreateItemValues } from '@/schemas/items/items.defaults';
import { ItemFormType } from '@/schemas/items/items.schema';
import ItemFormContainer from '../components/forms/ItemFormContainer';
import { mapItemFormToUpdateDTO, mapItemToFormValues } from '../components/forms/ItemForm.utils';

function UpdateItemPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const itemId = Number(id);

	const { item, isLoading: isLoadingItem, isError } = useShowItem(itemId);
	const { handleUpdateItem, isLoading: isUpdating } = useUpdateItem();

	const initialValues = useMemo<ItemFormType>(() => {
		if (!item) {
			return defaultCreateItemValues;
		}

		return mapItemToFormValues(item);
	}, [item]);

	const onSubmit = async (values: ItemFormType) => {
		if (!itemId) {
			return;
		}

		const dto = mapItemFormToUpdateDTO(values);

		try {
			const { item: { id } = {} } = await handleUpdateItem({
				id: itemId,
				data: dto
			});
			const updatedItemId = id ?? itemId;
			navigate(`/items/${updatedItemId}`);
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoadingItem) {
		return <FuseLoading />;
	}

	if (isError || !item) {
		return (
			<div className="flex h-full items-center justify-center">
				<Typography
					variant="h6"
					color="text.secondary"
				>
					No se encontró el artículo solicitado.
				</Typography>
			</div>
		);
	}

	return (
		<ItemFormContainer
			mode="edit"
			initialValues={initialValues}
			initialImagePreview={item.image ?? null}
			isSubmitting={isUpdating}
			onSubmit={onSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}

export default UpdateItemPage;
