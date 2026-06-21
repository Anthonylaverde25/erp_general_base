import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Chip, MenuItem, TextField, Typography, FormControlLabel, Switch, type TextFieldProps } from '@mui/material';
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

				<div className="flex items-center">
					<Controller
						name="has_batches"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Switch
										checked={Boolean(field.value)}
										onChange={(event) => field.onChange(event.target.checked)}
										disabled={isLoading}
									/>
								}
								label="¿Maneja Lotes?"
							/>
						)}
					/>
				</div>

				<div className="flex items-center">
					<Controller
						name="has_serials"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Switch
										checked={Boolean(field.value)}
										onChange={(event) => field.onChange(event.target.checked)}
										disabled={isLoading}
									/>
								}
								label="¿Maneja Número de Serie?"
							/>
						)}
					/>
				</div>

				<Controller
					name="procurement_type"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							select
							label="Tipo de Abastecimiento"
							value={field.value ?? 'buy'}
							disabled={isLoading}
							onChange={(event) => field.onChange(event.target.value)}
						>
							<MenuItem value="buy">Comprado (Reventa / Materia Prima)</MenuItem>
							<MenuItem value="make">Fabricado (Producción Propia)</MenuItem>
						</TextField>
					)}
				/>


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
