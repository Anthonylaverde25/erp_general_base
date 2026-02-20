import { Controller, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { CloudUpload, DeleteOutline } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  ListSubheader,
  MenuItem,
  Switch,
  TextField,
  Typography,
  type TextFieldProps,
} from "@mui/material";
import type { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";
import type { FamilyEntity } from "@/domain/entities/families/FamilyEntity";
import type { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";
import type { ItemFormType } from "@/schemas/items/items.schema";
import CreateItemSection from "./CreateItemSection";

type CreateItemGeneralSectionProps = {
  isLoading: boolean;
  itemType: "physical" | "service";
  textFieldProps: TextFieldProps;
  families: FamilyEntity[];
  mainCategories: CategoryEntity[];
  selectedCategoryId?: string;
  subCategories: CategoryEntity[];
  unitTypes: UnitTypeEntity[];
  imagePreview: string | null;
  onRemoveImage: () => void;
  dropzone: Pick<
    ReturnType<typeof useDropzone>,
    "getRootProps" | "getInputProps" | "isDragActive"
  >;
};

function CreateItemGeneralSection({
  isLoading,
  itemType,
  textFieldProps,
  families,
  mainCategories,
  selectedCategoryId,
  subCategories,
  unitTypes,
  imagePreview,
  onRemoveImage,
  dropzone,
}: CreateItemGeneralSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ItemFormType>();

  return (
    <CreateItemSection
      title="Información General"
      chipLabel="Datos Principales"
      description="Configure los datos básicos para la identificación del artículo en el sistema."
      borderedTop={false}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
        <div className="col-span-12 sm:col-span-4 lg:col-span-3">
          <div
            {...dropzone.getRootProps()}
            className={`group relative flex h-full min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors ${
              dropzone.isDragActive
                ? "border-secondary bg-secondary/5"
                : "border-divider hover:border-secondary/50"
            }`}
          >
            <input {...dropzone.getInputProps()} />
            {imagePreview ? (
              <div className="relative h-full min-h-[160px] w-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full rounded-lg object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Typography
                    variant="caption"
                    className="font-medium text-white"
                  >
                    Cambiar imagen
                  </Typography>
                </div>
                <IconButton
                  className="!absolute top-2 right-2 !bg-white/90 hover:!bg-white"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveImage();
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <div className="text-text-secondary group-hover:text-secondary flex flex-col items-center gap-2 transition-colors">
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

        <div className="col-span-12 grid grid-cols-1 gap-6 sm:col-span-8 sm:grid-cols-12 lg:col-span-9">
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
                      if (type.applicability === "both") {
                        return true;
                      }

                      return type.applicability === itemType;
                    })
                    .flatMap((type) => {
                      if (!type.units?.length) {
                        return [];
                      }

                      return [
                        <ListSubheader
                          key={`header-${type.id}`}
                          className="text-primary bg-transparent font-bold"
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
    </CreateItemSection>
  );
}

export default CreateItemGeneralSection;
