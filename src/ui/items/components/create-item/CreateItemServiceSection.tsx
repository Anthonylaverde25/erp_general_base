import { Controller, type Control, type FieldError, type FieldErrors } from 'react-hook-form';
import { FormControlLabel, Switch, TextField, type TextFieldProps } from '@mui/material';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemServiceSectionProps = {
	control: Control<ItemFormType>;
	errors: FieldErrors<ItemFormType>;
	isLoading: boolean;
	textFieldProps: TextFieldProps;
	parseOptionalNumber: (value: string) => number | undefined;
};

function CreateItemServiceSection({
	control,
	errors,
	isLoading,
	textFieldProps,
	parseOptionalNumber
}: CreateItemServiceSectionProps) {
	const estimatedTimeError = (errors as Record<string, FieldError | undefined>).estimated_time;

	return (
		<CreateItemSection
			title="Configuración del Servicio"
			chipLabel="Service Profile"
			description="Define tiempo estimado y si requiere agendamiento."
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Controller
					name="estimated_time"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							value={field.value ?? ''}
							{...textFieldProps}
							label="Tiempo Estimado (min)"
							type="number"
							error={!!estimatedTimeError}
							helperText={estimatedTimeError?.message}
							disabled={isLoading}
							onChange={(event) => field.onChange(parseOptionalNumber(event.target.value))}
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
									onChange={(event) => field.onChange(event.target.checked)}
									disabled={isLoading}
									color="secondary"
								/>
							}
							label="Requiere agendamiento"
						/>
					)}
				/>
			</div>
		</CreateItemSection>
	);
}

export default CreateItemServiceSection;
