import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, TextField, Typography, type TextFieldProps } from '@mui/material';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemPhysicalSectionProps = {
	isLoading: boolean;
	textFieldProps: TextFieldProps;
};

function CreateItemPhysicalSection({ isLoading, textFieldProps }: CreateItemPhysicalSectionProps) {
	const { control } = useFormContext<ItemFormType>();
	const parseOptionalNumber = (value: string) => (value === '' ? undefined : Number(value));

	return (
		<CreateItemSection
			title="Características Físicas"
			chipLabel="Propiedades Físicas"
			description="Configure el peso y las dimensiones físicas del producto."
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
				<div className="col-span-12 sm:col-span-6">
					<Controller
						name="weight"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								value={field.value ?? ''}
								{...textFieldProps}
								label="Peso (kg)"
								type="number"
								disabled={isLoading}
								onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
							/>
						)}
					/>
				</div>

				<div className="col-span-12 sm:col-span-6">
					<Controller
						name="dimension_unit"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								{...textFieldProps}
								select
								label="Unidad de Medida de Dimensiones"
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
				</div>

				<div className="col-span-12 sm:col-span-4">
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
				</div>

				<div className="col-span-12 sm:col-span-4">
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
				</div>

				<div className="col-span-12 sm:col-span-4">
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
				</div>

				<div className="col-span-12">
					<Typography
						variant="caption"
						className="text-text-secondary"
					>
						Las dimensiones se enviarán automáticamente en formato interno, no necesitas escribir JSON.
					</Typography>
				</div>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemPhysicalSection;
