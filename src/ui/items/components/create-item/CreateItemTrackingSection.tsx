import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Chip, MenuItem, TextField, Typography, type TextFieldProps } from '@mui/material';
import type { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemTrackingSectionProps = {
	isLoading: boolean;
	textFieldProps: TextFieldProps;
	partners: PartnerEntity[];
};

function CreateItemTrackingSection({ isLoading, textFieldProps, partners }: CreateItemTrackingSectionProps) {
	const { control } = useFormContext<ItemFormType>();
	const parseOptionalNumber = (value: string) => (value === '' ? undefined : Number(value));

	return (
		<CreateItemSection
			title="Seguimiento del Producto"
			chipLabel="Información de Seguimiento"
			description="Datos para seguimiento: código de barras, peso y dimensiones del producto."
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
							value={field.value ?? ''}
							{...textFieldProps}
							label="Peso"
							type="number"
							disabled={isLoading}
							onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
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
							onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
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
							onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
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
							onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
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
							value={field.value ?? 'cm'}
							disabled={isLoading}
							onChange={(event) => field.onChange(event.target.value)}
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
						Las dimensiones se enviarán automáticamente en formato interno, no necesitas escribir JSON.
					</Typography>
				</div>

				<div className="col-span-1 sm:col-span-2">
					<Controller
						name="partner_ids"
						control={control}
						render={({ field }) => (
							<Autocomplete
								multiple
								options={partners}
								getOptionLabel={(option) => option.name}
								value={partners.filter((p) => (field.value ?? []).includes(String(p.id)))}
								onChange={(_, newValue) => {
									field.onChange(newValue.map((p) => String(p.id)));
								}}
								disabled={isLoading}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											{...getTagProps({ index })}
											key={option.id}
											label={option.name}
											size="small"
										/>
									))
								}
								renderInput={(params) => (
									<TextField
										{...params}
										{...textFieldProps}
										label="Proveedores"
										placeholder="Buscar proveedor..."
									/>
								)}
							/>
						)}
					/>
				</div>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemTrackingSection;
