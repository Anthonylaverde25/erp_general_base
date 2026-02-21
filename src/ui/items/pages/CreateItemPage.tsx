import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { defaultCreateItemValues } from "@/schemas/items/items.defaults";
import { ItemFormType } from "@/schemas/items/items.schema";
import ItemFormContainer from "../components/forms/ItemFormContainer";
import { mapItemFormToDTO } from "../components/forms/ItemForm.utils";

function CreateItemPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const itemType = (searchParams.get("type") || "physical") as
    | "physical"
    | "service";
  const { handleCreateItem, isLoading: isCreating } = useCreateItem();

  const initialValues = useMemo<ItemFormType>(() => {
    if (itemType === "service") {
      return {
        ...defaultCreateItemValues,
        type: "service",
        barcode: undefined,
        is_inventoriable: undefined,
        store_id: undefined,
        partner_ids: undefined,
        initial_stock: undefined,
        quantity: undefined,
        dimension_length: undefined,
        dimension_width: undefined,
        dimension_height: undefined,
        dimension_unit: undefined,
        weight: undefined,
        stock_min: undefined,
        has_stock_alert: undefined,
      } as ItemFormType;
    }

    return {
      ...defaultCreateItemValues,
      type: "physical",
    };
  }, [itemType]);

  const onSubmit = async (values: ItemFormType) => {
    const dto = mapItemFormToDTO(values);

    try {
      const response = await handleCreateItem(dto);
      const createdItemId = response?.item?.id;

      if (createdItemId) {
        navigate(`/items/${createdItemId}`);
        return;
      }

      navigate("/items");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ItemFormContainer
      mode="create"
      initialValues={initialValues}
      isSubmitting={isCreating}
      onSubmit={onSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}

export default CreateItemPage;
