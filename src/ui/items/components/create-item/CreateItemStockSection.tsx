import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, MenuItem, Switch, TextField, type TextFieldProps } from '@mui/material';
import type { StoreEntity } from '@/domain/entities/stores/StoreEntity';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemStockSectionProps = {
	isLoading: boolean;
	textFieldProps: TextFieldProps;
	stores: StoreEntity[];
};

function CreateItemStockSection({ isLoading, textFieldProps, stores }: CreateItemStockSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<ItemFormType>();
	const isInventoriable = useWatch({ control, name: 'is_inventoriable' });

	return (
		<CreateItemSection
			title="Gestión de Stock"
			chipLabel="Inventario Inicial"
			description="Si está activado, el artículo se gestionará por inventario. No obliga a asignar stock ni almacén."
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="col-span-1 sm:col-span-2">
					<Controller
						name="is_inventoriable"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Switch
										checked={field.value ?? true}
										onChange={(event) => field.onChange(event.target.checked)}
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
							value={field.value ?? ''}
							{...textFieldProps}
							select
							label="Almacén (Opcional)"
							error={!!errors.store_id}
							helperText={errors.store_id?.message}
							disabled={!(isInventoriable ?? true) || isLoading}
						>
							<MenuItem value="">
								<em>Sin almacén</em>
							</MenuItem>
							{stores.map((store) => (
								<MenuItem
									key={store.id}
									value={String(store.id)}
								>
									{store.name}
								</MenuItem>
							))}
						</TextField>
					)}
				/>

				<Controller
					name="quantity"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							value={field.value ?? ''}
							{...textFieldProps}
							label="Cantidad Inicial"
							type="number"
							error={!!errors.quantity}
							helperText={errors.quantity?.message}
							disabled={!(isInventoriable ?? true) || isLoading}
							onChange={(event) =>
								field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
							}
						/>
					)}
				/>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemStockSection;
