import { useNavigate, useSearchParams } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
    IconButton
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Save, CloudUpload } from '@mui/icons-material';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { itemSchema, ItemFormType } from '@/schemas/items/items.schema';
import { defaultCreateItemValues } from '@/schemas/items/items.defaults';
import { useCreateItem } from '@/features/items/hooks/useCreateItem';
import { useIndexCategories } from '@/features/categories/hooks/useIndexCategories';
import { useIndexUnits } from '@/features/units/hooks/useIndexUnits';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import { useIndexFamilies } from '@/features/families/hooks/useIndexFamilies';
import { mapItemFormToDTO } from "../components/forms/ItemForm.utils";
import PageBreadcrumb from "@/components/PageBreadcrumb";

function CreateItemPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const itemType = searchParams.get('type') || 'physical';

    const { handleCreateItem, isLoading: isCreating } = useCreateItem();
    const { categories } = useIndexCategories();
    console.log('categories', categories)
    const { units } = useIndexUnits();
    const { data: taxRates } = useIndexTaxRates();
    const { data: families = [] } = useIndexFamilies();

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm<ItemFormType>({
        mode: 'onChange',
        resolver: zodResolver(itemSchema),
        defaultValues: {
            ...defaultCreateItemValues,
            type: itemType as 'physical' | 'service'
        }
    });

    const selectedFamilyId = watch('family_id');
    const selectedCategoryId = watch('category_id');

    // Filter categories that have no parent (main categories)
    const mainCategories = categories.filter(cat => cat.parent_id === null);

    // Filter categories that are children of the selected category (subcategories)
    // First try to find in children of the selected main category, then try flat list filtering
    const selectedCategory = categories.find(cat => String(cat.id) === selectedCategoryId);
    const subCategories = selectedCategory?.children?.length
        ? selectedCategory.children
        : categories.filter(cat => selectedCategoryId && cat.parent_id === Number(selectedCategoryId));

    const onCancel = () => {
        navigate(-1);
    };

    const onSubmit = async (values: ItemFormType) => {
        const dto = mapItemFormToDTO(values);
        try {
            await handleCreateItem(dto);
            navigate('/items');
        } catch (error) {
            console.error(error);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setValue('image', file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const textFieldProps = {
        fullWidth: true,
        variant: "filled" as const,
    };

    const isLoading = isCreating;

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
                                <Typography variant="h2" className="text-2xl font-bold tracking-tight text-text-primary">
                                    {itemType === 'service' ? 'Nuevo Servicio' : 'Nuevo Producto'}
                                </Typography>
                                <Typography variant="body2" className="text-text-secondary">
                                    {itemType === 'service'
                                        ? 'Información necesaria para registrar un nuevo servicio.'
                                        : 'Información necesaria para registrar un nuevo producto físico.'}
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
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            color="secondary"
                            disabled={!isValid || isLoading}
                            startIcon={isLoading ? undefined : <Save />}
                            className="px-6 shadow-none hover:shadow-sm"
                        >
                            {isLoading ? 'Guardando...' : `Guardar ${itemType === 'service' ? 'Servicio' : 'Producto'}`}
                        </Button>
                    </div>
                </div>
            }
            content={
                <div className="w-full max-w-5xl mx-auto p-8">
                    <form className="flex flex-col gap-8">
                        {/* SECTION 1: GENERAL INFO */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <Typography variant="h6" className="font-semibold text-lg text-text-primary">
                                    Información General
                                </Typography>
                                <Chip label="Datos Principales" size="small" variant="outlined" className="text-text-secondary border-divider" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                                {/* Image Dropzone */}
                                <div className="col-span-12 sm:col-span-4 lg:col-span-3">
                                    <div
                                        {...getRootProps()}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors h-full min-h-[160px] ${isDragActive ? 'border-secondary bg-secondary/5' : 'border-divider hover:border-secondary/50'
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
                                                    <Typography variant="caption" className="text-white font-medium">Cambiar imagen</Typography>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-text-secondary group-hover:text-secondary transition-colors">
                                                <CloudUpload sx={{ fontSize: 40 }} />
                                                <Typography variant="caption" className="text-center font-medium">
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
                                                        <MenuItem key={category.id} value={String(category.id)}>
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

                                    <div className="col-span-12 sm:col-span-6">
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
                                                >
                                                    <MenuItem value="">
                                                        <em>Sin unidad</em>
                                                    </MenuItem>
                                                    {units.map((unit) => (
                                                        <MenuItem key={unit.id} value={String(unit.id)}>
                                                            {unit.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </div>

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 border-t border-dashed">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <Typography variant="h6" className="font-semibold text-lg text-text-primary">
                                        Precios
                                    </Typography>
                                </div>
                                <div className="space-y-5">
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
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
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
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <Typography variant="h6" className="font-semibold text-lg text-text-primary">
                                        Impuestos
                                    </Typography>
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
                                                    field.onChange(typeof val === 'string' ? val.split(',').map(Number) : val);
                                                }}
                                                SelectProps={{
                                                    multiple: true,
                                                    renderValue: (selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {(selected as number[]).map((id) => {
                                                                const tax = (taxRates || []).find((t) => t.id === id);
                                                                return tax ? (
                                                                    <Chip key={id} label={`${tax.name} (${tax.percentage}%)`} size="small" variant="outlined" className="bg-white" />
                                                                ) : null;
                                                            })}
                                                        </Box>
                                                    )
                                                }}
                                            >
                                                {(taxRates || []).map((tax) => (
                                                    <MenuItem key={tax.id} value={tax.id}>
                                                        <Checkbox checked={(field.value || []).includes(tax.id)} size="small" />
                                                        {tax.name} ({tax.percentage}%)
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: DESCRIPTION */}
                        <div className="pt-6 border-t border-dashed">
                            <div className="flex items-center justify-between border-b pb-2 mb-6">
                                <Typography variant="h6" className="font-semibold text-lg text-text-primary">
                                    Descripción Adicional
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

