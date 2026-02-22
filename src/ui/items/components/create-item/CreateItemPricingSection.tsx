import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Box, Checkbox, Chip, InputAdornment, MenuItem, TextField, type TextFieldProps } from '@mui/material';
import type { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';
import type { ItemFormType } from '@/schemas/items/items.schema';
import { toast } from 'sonner';
import CreateItemSection from './CreateItemSection';

type CreateItemPricingSectionProps = {
	isLoading: boolean;
	textFieldProps: TextFieldProps;
	taxRates: TaxRateEntity[];
};

function CreateItemPricingSection({ isLoading, textFieldProps, taxRates }: CreateItemPricingSectionProps) {
	const {
		control,
		setValue,
		formState: { errors }
	} = useFormContext<ItemFormType>();

	const purchasePrice = useWatch({ control, name: 'purchase_price' });
	const salePrice = useWatch({ control, name: 'sale_price' });

	const syncProfitMargin = (nextPurchasePrice: number | undefined, nextSalePrice: number | undefined) => {
		if (nextPurchasePrice !== undefined && nextPurchasePrice > 0 && nextSalePrice !== undefined) {
			const newMargin = ((nextSalePrice - nextPurchasePrice) / nextPurchasePrice) * 100;
			setValue('profit_margin', Number(newMargin.toFixed(2)));
			return;
		}

		setValue('profit_margin', undefined);
	};

	const normalizeTaxIds = (value: unknown): number[] => {
		if (typeof value === 'string') {
			return value
				.split(',')
				.map((id) => Number(id))
				.filter((id) => Number.isFinite(id));
		}

		if (Array.isArray(value)) {
			return value.map((id) => Number(id)).filter((id) => Number.isFinite(id));
		}

		return [];
	};

	const validateUniqueTaxTypeSelection = (selectedTaxIds: number[]): number[] => {
		const seenTaxTypeIds = new Set<number>();
		let hasDuplicatesByTaxType = false;

		const uniqueByType = selectedTaxIds.filter((taxRateId) => {
			const taxRate = taxRates.find((tax) => tax.id === taxRateId);

			if (!taxRate) {
				return false;
			}

			if (seenTaxTypeIds.has(taxRate.tax_type_id)) {
				hasDuplicatesByTaxType = true;
				return false;
			}

			seenTaxTypeIds.add(taxRate.tax_type_id);
			return true;
		});

		if (hasDuplicatesByTaxType) {
			toast.error('Solo puedes seleccionar un impuesto por tipo (IVA, retención, etc.).');
		}

		return uniqueByType;
	};

	return (
		<CreateItemSection
			title="Precios e Impuestos"
			chipLabel="Configuración Financiera"
			description="Defina la estructura de costos, precios de venta y las obligaciones fiscales aplicables."
		>
			<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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
								onChange={(event) => {
									const nextPurchasePrice = Number(event.target.value);
									field.onChange(nextPurchasePrice);
									syncProfitMargin(nextPurchasePrice, salePrice);
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
								onChange={(event) => {
									const nextSalePrice = Number(event.target.value);
									field.onChange(nextSalePrice);
									syncProfitMargin(purchasePrice, nextSalePrice);
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
								onChange={(event) => {
									const selectedTaxIds = normalizeTaxIds(event.target.value);
									const uniqueByTaxTypeIds = validateUniqueTaxTypeSelection(selectedTaxIds);
									field.onChange(uniqueByTaxTypeIds);
								}}
								SelectProps={{
									multiple: true,
									renderValue: (selected) => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{(selected as number[]).map((id) => {
												const tax = taxRates.find((item) => item.id === id);
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
									)
								}}
							>
								{taxRates.map((tax) => (
									<MenuItem
										key={tax.id}
										value={tax.id}
									>
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
									'Indicador de rentabilidad (calculado automáticamente)'
								}
								disabled
								InputProps={{
									readOnly: true,
									endAdornment: <InputAdornment position="end">%</InputAdornment>
								}}
								sx={{
									'& .MuiInputBase-root': {
										backgroundColor: 'transparent'
									},
									'& .MuiInputLabel-root': {
										color: 'text.secondary'
									}
								}}
							/>
						)}
					/>
				</div>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemPricingSection;
