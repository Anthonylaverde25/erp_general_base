import { useNavigate, useSearchParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  TextField,
  MenuItem,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Box,
  Checkbox,
  FormControlLabel,
  Switch,
  IconButton,
  InputAdornment,
  ListSubheader,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Save, CloudUpload } from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { itemSchema, ItemFormType } from "@/schemas/items/items.schema";
import { defaultCreateItemValues } from "@/schemas/items/items.defaults";
import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { useIndexCategories } from "@/features/categories/hooks/useIndexCategories";
// import { useIndexUnits } from '@/features/units/hooks/useIndexUnits'; // Removed
import { useIndexUnitTypes } from "@/features/unit_types/hooks/useIndexUnitTypes";
import { useIndexTaxRates } from "@/features/tax_rates/hooks/useIndexTaxRates";
import { useIndexFamilies } from "@/features/families/hooks/useIndexFamilies";
import useIndexStores from "@/features/stores/hooks/useIndexStores";
import { useIndexPartners } from "@/features/partners/hooks/useIndexPartners";
import { mapItemFormToDTO } from "../components/forms/ItemForm.utils";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import useActiveCompany from "@/features/companies/useActiveCompany";

function CreateItemPage() {
  const activeCompany = useActiveCompany();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("type") || "physical";

  const { handleCreateItem, isLoading: isCreating } = useCreateItem();
  const { categories } = useIndexCategories();
  // console.log('categories', categories)
  const { unitTypes } = useIndexUnitTypes();
  const { data: taxRates } = useIndexTaxRates();
  const { data: families = [] } = useIndexFamilies();
  const { stores = [] } = useIndexStores();
  const { data: partners = [] } = useIndexPartners();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ItemFormType>({
    mode: "onChange",
    resolver: zodResolver(itemSchema),
    defaultValues: {
      ...defaultCreateItemValues,
      type: itemType as "physical" | "service",
      ...(itemType === "service"
        ? {
            barcode: undefined,
            is_inventoriable: undefined,
            store_id: undefined,
            initial_stock: undefined,
            dimension_length: undefined,
            dimension_width: undefined,
            dimension_height: undefined,
            dimension_unit: undefined,
            weight: undefined,
          }
        : {}),
    },
  });

  const selectedFamilyId = watch("family_id");
  const selectedCategoryId = watch("category_id");
  const selectedStoreId = watch("store_id");
  const watchedIsInventoriable = watch("is_inventoriable");

  // Filter categories that have no parent (main categories)
  const mainCategories = categories.filter((cat) => cat.parent_id === null);

  // Filter categories that are children of the selected category (subcategories)
  // First try to find in children of the selected main category, then try flat list filtering
  const selectedCategory = categories.find(
    (cat) => String(cat.id) === selectedCategoryId,
  );
  const subCategories = selectedCategory?.children?.length
    ? selectedCategory.children
    : categories.filter(
        (cat) =>
          selectedCategoryId && cat.parent_id === Number(selectedCategoryId),
      );

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

      navigate("/items");
    } catch (error) {
      console.error(error);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("image", file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const textFieldProps = {
    fullWidth: true,
    variant: "filled" as const,
  };

  const parseOptionalNumber = (value: string) =>
    value === "" ? undefined : Number(value);

  const isLoading = isCreating;

  useEffect(() => {
    const defaultStoreId = activeCompany?.settings?.defaultStoreId;
    if (defaultStoreId == null || selectedStoreId) return;

    setValue("store_id", String(defaultStoreId), {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [activeCompany?.settings?.defaultStoreId, selectedStoreId, setValue]);

  return (
    <FusePageSimple
      header={
        <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-2 sm:space-y-0 p-6 sm:px-8 border-b bg-background-default">
          <div className="flex flex-col items-start">
            <PageBreadcrumb className="mb-4" />
            <div className="flex items-center gap-3">
              <Button
                className="min-w-0 w-8 h-8 p-0 rounded-full text-text-secondary hover:text-text-primary"
                onClick={onCancel}
              >
                <FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
              </Button>
              <div>
                <Typography
                  variant="h2"
                  className="text-2xl font-bold tracking-tight text-text-primary"
                >
                  {itemType === "service" ? "Nuevo Servicio" : "Nuevo Producto"}
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  {itemType === "service"
                    ? "Información necesaria para registrar un nuevo servicio."
                    : "Información necesaria para registrar un nuevo producto físico."}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="text"
              color="inherit"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4"
            >
              Cancelarss
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="secondary"
              disabled={!isValid || isLoading}
              startIcon={isLoading ? undefined : <Save />}
              className="px-6 shadow-none hover:shadow-sm"
            >
              {isLoading
                ? "Guardando..."
                : `Guardar ${itemType === "service" ? "Servicio" : "Producto"}`}
            </Button>
          </div>
        </div>
      }
      content={
        <div className="w-full max-w-5xl mx-auto p-8">
          <form className="flex flex-col gap-8">
            {/* SECTION 1: GENERAL INFO */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col border-b pb-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Typography
                    variant="h6"
                    className="font-semibold text-lg text-text-primary"
                  >
                    Información General
                  </Typography>
                  <Chip
                    label="Datos Principales"
                    size="small"
                    variant="outlined"
                    className="text-text-secondary border-divider"
                  />
                </div>
                <Typography variant="body2" className="text-text-secondary">
                  Configure los datos básicos para la identificación del
                  artículo en el sistema.
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Image Dropzone */}
                <div className="col-span-12 sm:col-span-4 lg:col-span-3">
                  <div
                    {...getRootProps()}
                    className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors h-full min-h-[160px] ${
                      isDragActive
                        ? "border-secondary bg-secondary/5"
                        : "border-divider hover:border-secondary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <div className="relative w-full h-full min-h-[160px]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Typography
                            variant="caption"
                            className="text-white font-medium"
                          >
                            Cambiar imagen
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-secondary group-hover:text-secondary transition-colors">
                        <CloudUpload sx={{ fontSize: 40 }} />
                        <Typography
                          variant="caption"
                          className="text-center font-medium"
                        >
                          Imagen del Artículo
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-12 gap-6">
                  <div className="col-span-12 sm:col-span-8">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          label="Nombre del Artículo"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          disabled={isLoading}
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <Controller
                      name="sku"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          label="SKU"
                          error={!!errors.sku}
                          helperText={errors.sku?.message}
                          disabled={isLoading}
                          required
                        />
                      )}
                    />
                  </div>

                  {/* Family Selector */}
                  <div className="col-span-12 sm:col-span-4">
                    <Controller
                      name="family_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          select
                          label="Familia"
                          disabled={isLoading}
                        >
                          <MenuItem value="">
                            <em>Sin familia</em>
                          </MenuItem>
                          {families.map((family) => (
                            <MenuItem key={family.id} value={String(family.id)}>
                              {family.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </div>

                  {/* Category Selector */}
                  <div className="col-span-12 sm:col-span-4">
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          select
                          label="Categoría"
                          disabled={isLoading}
                        >
                          <MenuItem value="">
                            <em>Sin categoría</em>
                          </MenuItem>
                          {mainCategories.map((category) => (
                            <MenuItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </div>

                  {/* Subcategory Selector */}
                  <div className="col-span-12 sm:col-span-4">
                    <Controller
                      name="subcategory_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          select
                          label="Subcategoría"
                          disabled={isLoading || !selectedCategoryId}
                        >
                          <MenuItem value="">
                            <em>Sin subcategoría</em>
                          </MenuItem>
                          {subCategories.map((sub) => (
                            <MenuItem key={sub.id} value={String(sub.id)}>
                              {sub.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <Controller
                      name="unit_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...textFieldProps}
                          select
                          label="Unidad de Medida"
                          error={!!errors.unit_id}
                          helperText={errors.unit_id?.message}
                          disabled={isLoading}
                          required
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                sx: {
                                  maxHeight: 400,
                                  minWidth: 450,
                                },
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Sin unidad</em>
                          </MenuItem>
                          {unitTypes
                            .filter((type) => {
                              const typeApplicability = type.applicability;
                              if (typeApplicability === "both") return true;
                              return typeApplicability === itemType;
                            })
                            .map((type) => {
                              if (!type.units || type.units.length === 0)
                                return null;
                              return [
                                <ListSubheader
                                  key={`header-${type.id}`}
                                  className="font-bold text-primary bg-transparent"
                                >
                                  {type.name}
                                </ListSubheader>,
                                ...type.units.map((unit) => (
                                  <MenuItem
                                    key={unit.id}
                                    value={String(unit.id)}
                                    className="pl-8"
                                  >
                                    {unit.name} ({unit.code})
                                  </MenuItem>
                                )),
                              ];
                            })}
                        </TextField>
                      )}
                    />
                  </div>

                  {/* Store Selector removed from here */}

                  <div className="col-span-12 sm:col-span-6">
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value ?? true}
                              onChange={(e) => field.onChange(e.target.checked)}
                              disabled={isLoading}
                              color="secondary"
                            />
                          }
                          label="Activo"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PRICING & TAXES */}
            <div className="pt-6 border-t border-dashed">
              <div className="flex flex-col border-b pb-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Typography
                    variant="h6"
                    className="font-semibold text-lg text-text-primary"
                  >
                    Precios e Impuestos
                  </Typography>
                  <Chip
                    label="Configuración Financiera"
                    size="small"
                    variant="outlined"
                    className="text-text-secondary border-divider"
                  />
                </div>
                <Typography variant="body2" className="text-text-secondary">
                  Defina la estructura de costos, precios de venta y las
                  obligaciones fiscales aplicables.
                </Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <Controller
                    name="purchase_price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Precio de Compra"
                        type="number"
                        error={!!errors.purchase_price}
                        helperText={errors.purchase_price?.message}
                        disabled={isLoading}
                        onChange={(e) => {
                          const newCost = Number(e.target.value);
                          field.onChange(newCost);

                          // Calculate Margin based on Sale Price
                          const price = watch("sale_price");
                          if (price !== undefined && price > 0 && newCost > 0) {
                            const newMargin =
                              ((price - newCost) / newCost) * 100;
                            setValue(
                              "profit_margin",
                              Number(newMargin.toFixed(2)),
                            );
                          } else {
                            setValue("profit_margin", undefined);
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="sale_price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Precio de Venta"
                        type="number"
                        error={!!errors.sale_price}
                        helperText={errors.sale_price?.message}
                        disabled={isLoading}
                        onChange={(e) => {
                          const newPrice = Number(e.target.value);
                          field.onChange(newPrice);

                          // Calculate Margin based on Purchase Price
                          const cost = watch("purchase_price");
                          if (cost !== undefined && cost > 0) {
                            const newMargin = ((newPrice - cost) / cost) * 100;
                            setValue(
                              "profit_margin",
                              Number(newMargin.toFixed(2)),
                            );
                          } else {
                            setValue("profit_margin", undefined);
                          }
                        }}
                      />
                    )}
                  />
                </div>

                <div className="space-y-5">
                  <Controller
                    name="tax_rate_ids"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...textFieldProps}
                        select
                        label="Impuestos Aplicables"
                        disabled={isLoading}
                        value={field.value || []}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            typeof val === "string"
                              ? val.split(",").map(Number)
                              : val,
                          );
                        }}
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {(selected as number[]).map((id) => {
                                const tax = (taxRates || []).find(
                                  (t) => t.id === id,
                                );
                                return tax ? (
                                  <Chip
                                    key={id}
                                    label={`${tax.name} (${tax.percentage}%)`}
                                    size="small"
                                    variant="outlined"
                                    className="bg-white"
                                  />
                                ) : null;
                              })}
                            </Box>
                          ),
                        }}
                      >
                        {(taxRates || []).map((tax) => (
                          <MenuItem key={tax.id} value={tax.id}>
                            <Checkbox
                              checked={(field.value || []).includes(tax.id)}
                              size="small"
                            />
                            {tax.name} ({tax.percentage}%)
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="profit_margin"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        variant="standard"
                        label="Margen de Ganancia"
                        type="number"
                        error={!!errors.profit_margin}
                        helperText={
                          errors.profit_margin?.message ||
                          "Indicador de rentabilidad (calculado automáticamente)"
                        }
                        disabled
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            backgroundColor: "transparent",
                          },
                          "& .MuiInputLabel-root": {
                            color: "text.secondary",
                          },
                        }}
                      />
                    )}
                  />
                  {/* moved supplier selector to Product Tracking section */}
                </div>
              </div>
            </div>

            {/* SECTION: SERVICE PROFILE - Only for Service Items */}
            {itemType === "service" && (
              <div className="pt-6 border-t border-dashed">
                <div className="flex flex-col border-b pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="h6"
                      className="font-semibold text-lg text-text-primary"
                    >
                      Configuración del Servicio
                    </Typography>
                    <Chip
                      label="Service Profile"
                      size="small"
                      variant="outlined"
                      className="text-text-secondary border-divider"
                    />
                  </div>
                  <Typography variant="body2" className="text-text-secondary">
                    Define tiempo estimado y si requiere agendamiento.
                  </Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="estimated_time"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        {...textFieldProps}
                        label="Tiempo Estimado (min)"
                        type="number"
                        error={!!(errors as any).estimated_time}
                        helperText={(errors as any).estimated_time?.message}
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(parseOptionalNumber(e.target.value))
                        }
                      />
                    )}
                  />

                  <Controller
                    name="req_scheduling"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value ?? false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isLoading}
                            color="secondary"
                          />
                        }
                        label="Requiere agendamiento"
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* SECTION 4: STOCK MANAGEMENT - Only for Physical Items */}
            {itemType === "physical" && (
              <div className="pt-6 border-t border-dashed">
                <div className="flex flex-col border-b pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="h6"
                      className="font-semibold text-lg text-text-primary"
                    >
                      Gestión de Stock
                    </Typography>
                    <Chip
                      label="Inventario Inicial"
                      size="small"
                      variant="outlined"
                      className="text-text-secondary border-divider"
                    />
                  </div>
                  <Typography variant="body2" className="text-text-secondary">
                    Si está activado, el artículo se gestionará por inventario.
                    No obliga a asignar stock ni almacén.
                  </Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="col-span-1 sm:col-span-2">
                    <Controller
                      name="is_inventoriable"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value ?? true}
                              onChange={(e) => field.onChange(e.target.checked)}
                              disabled={isLoading}
                              color="secondary"
                            />
                          }
                          label="Es Inventariable"
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name="store_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        {...textFieldProps}
                        select
                        label="Almacén (Opcional)"
                        error={!!(errors as any).store_id}
                        helperText={(errors as any).store_id?.message}
                        disabled={
                          !(watchedIsInventoriable ?? true) || isLoading
                        }
                      >
                        <MenuItem value="">
                          <em>Sin almacén</em>
                        </MenuItem>
                        {stores.map((store) => (
                          <MenuItem key={store.id} value={String(store.id)}>
                            {store.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="initial_stock"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Stock Inicial"
                        type="number"
                        error={!!(errors as any).initial_stock}
                        helperText={(errors as any).initial_stock?.message}
                        disabled={
                          !(watchedIsInventoriable ?? true) || isLoading
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* SECTION: PRODUCT TRACKING - Only for Physical Items */}
            {itemType === "physical" && (
              <div className="pt-6 border-t border-dashed">
                <div className="flex flex-col border-b pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="h6"
                      className="font-semibold text-lg text-text-primary"
                    >
                      Seguimiento del Producto
                    </Typography>
                    <Chip
                      label="Información de Seguimiento"
                      size="small"
                      variant="outlined"
                      className="text-text-secondary border-divider"
                    />
                  </div>
                  <Typography variant="body2" className="text-text-secondary">
                    Datos para seguimiento: código de barras, peso y dimensiones
                    del producto.
                  </Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Código de Barras"
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Peso"
                        type="number"
                        disabled={isLoading}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />

                  <Controller
                    name="dimension_length"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Largo"
                        type="number"
                        placeholder="Ej: 10"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(parseOptionalNumber(e.target.value))
                        }
                      />
                    )}
                  />

                  <Controller
                    name="dimension_width"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Ancho"
                        type="number"
                        placeholder="Ej: 20"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(parseOptionalNumber(e.target.value))
                        }
                      />
                    )}
                  />

                  <Controller
                    name="dimension_height"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        label="Alto"
                        type="number"
                        placeholder="Ej: 5"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(parseOptionalNumber(e.target.value))
                        }
                      />
                    )}
                  />

                  <Controller
                    name="dimension_unit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...textFieldProps}
                        select
                        label="Unidad de medida"
                        value={field.value ?? "cm"}
                        disabled={isLoading}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="mm">mm</MenuItem>
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="m">m</MenuItem>
                        <MenuItem value="in">in</MenuItem>
                      </TextField>
                    )}
                  />

                  <div className="col-span-1 sm:col-span-2">
                    <Typography
                      variant="caption"
                      className="text-text-secondary"
                    >
                      Las dimensiones se enviarán automáticamente en formato
                      interno, no necesitas escribir JSON.
                    </Typography>
                  </div>

                  {/* is_inventoriable moved to Stock Management section */}

                  {/* default supplier moved here */}
                  <div className="col-span-1 sm:col-span-2">
                    <Controller
                      name="default_supplier_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...textFieldProps}
                          select
                          label="Proveedor por defecto"
                          disabled={isLoading}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Sin proveedor</em>
                          </MenuItem>
                          {partners
                            .filter(
                              (p: any) =>
                                p.role === "supplier" ||
                                p.role === "client_supplier",
                            )
                            .map((p: any) => (
                              <MenuItem key={p.id} value={String(p.id)}>
                                {p.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: DESCRIPTION */}
            <div className="pt-6 border-t border-dashed">
              <div className="flex flex-col border-b pb-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Typography
                    variant="h6"
                    className="font-semibold text-lg text-text-primary"
                  >
                    Descripción Adicional
                  </Typography>
                  <Chip
                    label="Detalles Opcionales"
                    size="small"
                    variant="outlined"
                    className="text-text-secondary border-divider"
                  />
                </div>
                <Typography variant="body2" className="text-text-secondary">
                  Agregue información complementaria o notas específicas para
                  este artículo.
                </Typography>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      {...textFieldProps}
                      label="Descripción"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      }
      scroll="content"
    />
  );
}

export default CreateItemPage;
