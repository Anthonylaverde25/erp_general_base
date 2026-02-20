import { Controller, useFormContext } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';
import type { ItemFormType } from '@/schemas/items/items.schema';
import CreateItemSection from './CreateItemSection';

type CreateItemDescriptionSectionProps = {
	isLoading: boolean;
	textFieldProps: TextFieldProps;
};

function CreateItemDescriptionSection({ isLoading, textFieldProps }: CreateItemDescriptionSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<ItemFormType>();

	return (
		<CreateItemSection
			title="Descripción Adicional"
			chipLabel="Detalles Opcionales"
			description="Agregue información complementaria o notas específicas para este artículo."
		>
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
		</CreateItemSection>
	);
}

export default CreateItemDescriptionSection;
