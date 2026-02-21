import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, MenuItem, Switch, TextField, type TextFieldProps } from '@mui/material';
import type { StoreEntity } from '@/domain/entities/stores/StoreEntity';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemStockSectionProps = {
	mode: 'create' | 'edit';
	isLoading: boolean;
	textFieldProps: TextFieldProps;
	stores: StoreEntity[];
};

function CreateItemStockSection({ mode, isLoading, textFieldProps, stores }: CreateItemStockSectionProps) {
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
							helperText={
								mode === 'edit'
									? 'El stock inicial no es editable una vez creado el item'
									: errors.quantity?.message
							}
							disabled={mode === 'edit' || !(isInventoriable ?? true) || isLoading}
							onChange={(event) =>
								field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
							}
						/>
					)}
				/>

				<Controller
					name="stock_min"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							value={field.value ?? ''}
							{...textFieldProps}
							label="Stock Mínimo (Opcional)"
							type="number"
							error={!!errors.stock_min}
							helperText={errors.stock_min?.message}
							disabled={!(isInventoriable ?? true) || isLoading}
							onChange={(event) =>
								field.onChange(event.target.value === '' ? null : Number(event.target.value))
							}
						/>
					)}
				/>

				<Controller
					name="has_stock_alert"
					control={control}
					render={({ field }) => (
						<FormControlLabel
							control={
								<Switch
									checked={field.value ?? false}
									onChange={(event) => field.onChange(event.target.checked)}
									disabled={!(isInventoriable ?? true) || isLoading}
									color="secondary"
								/>
							}
							label="Activar Alertas de Stock"
							sx={{ mt: 1 }}
						/>
					)}
				/>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemStockSection;
