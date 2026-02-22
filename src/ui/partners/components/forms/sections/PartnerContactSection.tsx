import { TextField, Typography, Divider } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { PartnerFormType } from '@/schemas/partners/partners.schema';

interface PartnerContactSectionProps {
	isLoading: boolean;
}

const textFieldProps = {
	fullWidth: true,
	variant: 'filled' as const
};

export function PartnerContactSection({ isLoading }: PartnerContactSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<PartnerFormType>();

	return (
		<div className="space-y-6">
			<div>
				<Typography
					variant="subtitle2"
					className="mb-3 font-bold text-gray-700 uppercase dark:text-gray-300"
				>
					Datos de Contacto
				</Typography>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="contact_email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Email"
									error={!!errors.contact_email}
									helperText={errors.contact_email?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="contact_phone"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Teléfono"
									error={!!errors.contact_phone}
									helperText={errors.contact_phone?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12">
						<Controller
							name="website"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Sitio Web"
									error={!!errors.website}
									helperText={errors.website?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
				</div>
			</div>

			<Divider />

			<div>
				<Typography
					variant="subtitle2"
					className="mb-3 font-bold text-gray-700 uppercase dark:text-gray-300"
				>
					Dirección Fiscal
				</Typography>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
					<div className="col-span-12">
						<Controller
							name="address_street"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Dirección"
									error={!!errors.address_street}
									helperText={errors.address_street?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="address_city"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Ciudad"
									error={!!errors.address_city}
									helperText={errors.address_city?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="address_state"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Provincia / Estado"
									error={!!errors.address_state}
									helperText={errors.address_state?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="address_postal_code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="Código Postal"
									error={!!errors.address_postal_code}
									helperText={errors.address_postal_code?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					<div className="col-span-12 sm:col-span-6">
						<Controller
							name="address_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									{...textFieldProps}
									label="País"
									placeholder="Seleccionar País..."
									error={!!errors.address_country}
									helperText={errors.address_country?.message}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
