import { TextField, Chip, FormControlLabel, Switch } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { PartnerFormType } from '@/schemas/partners/partners.schema';
import { PublicOrganism } from '../../modals/PublicOrganismModal';

interface PartnerHeaderSectionProps {
	isLoading: boolean;
	publicOrganisms: PublicOrganism[];
	onOpenOrganismModal: () => void;
}

const textFieldProps = {
	fullWidth: true,
	variant: 'filled' as const
};

export function PartnerHeaderSection({ isLoading, publicOrganisms, onOpenOrganismModal }: PartnerHeaderSectionProps) {
	const {
		control,
		formState: { errors }
	} = useFormContext<PartnerFormType>();
	const watchedType = useWatch({ control, name: 'type' });

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
			<div className="col-span-12 sm:col-span-8">
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="Nombre Fiscal"
							error={!!errors.name}
							helperText={errors.name?.message}
							disabled={isLoading}
						/>
					)}
				/>
			</div>
			<div className="col-span-12 sm:col-span-4">
				<Controller
					name="comercial_name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="Nombre Comercial"
							error={!!errors.comercial_name}
							helperText={errors.comercial_name?.message}
							disabled={isLoading}
						/>
					)}
				/>
			</div>
			<div className="col-span-12 sm:col-span-4">
				<Controller
					name="vat_number"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="NIF / VAT"
							error={!!errors.vat_number}
							helperText={errors.vat_number?.message}
							disabled={isLoading}
						/>
					)}
				/>
			</div>
			<div className="col-span-12 sm:col-span-4">
				<Controller
					name="cif"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							label="CIF"
							error={!!errors.cif}
							helperText={errors.cif?.message}
							disabled={isLoading}
						/>
					)}
				/>
			</div>
			<div className="col-span-12 sm:col-span-4">
				<Controller
					name="type"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							{...textFieldProps}
							select
							label="Tipo de Socio"
							error={!!errors.type}
							helperText={errors.type?.message}
							disabled={isLoading}
							SelectProps={{ native: true }} // Using native select for simplicity or could import MenuItem if we need styled select
						>
							<option value="person">Persona</option>
							<option value="company">Empresa</option>
							<option value="public_organism">Organismo Público</option>
							<option value="prospect">Prospecto</option>
						</TextField>
					)}
				/>
			</div>
			<div className="col-span-12 flex flex-wrap items-center gap-4">
				{watchedType === 'public_organism' && (
					<Chip
						icon={<FuseSvgIcon size={16}>heroicons-outline:building-library</FuseSvgIcon>}
						label={`${publicOrganisms.length} Organismo${publicOrganisms.length !== 1 ? 's' : ''}`}
						variant="outlined"
						color="secondary"
						onClick={onOpenOrganismModal}
						sx={{ cursor: 'pointer', fontWeight: 500, height: 32 }}
					/>
				)}
				<Controller
					name="credit_available"
					control={control}
					render={({ field }) => (
						<FormControlLabel
							control={
								<Switch
									checked={field.value ?? false}
									onChange={(e) => field.onChange(e.target.checked)}
									disabled={isLoading}
									color="secondary"
								/>
							}
							label="Crédito Disponible"
							sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem', fontWeight: 500 } }}
						/>
					)}
				/>
				<Controller
					name="grouped_billing"
					control={control}
					render={({ field }) => (
						<FormControlLabel
							control={
								<Switch
									checked={field.value ?? false}
									onChange={(e) => field.onChange(e.target.checked)}
									disabled={isLoading}
									color="secondary"
								/>
							}
							label="Facturación Agrupada"
							sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem', fontWeight: 500 } }}
						/>
					)}
				/>
			</div>
		</div>
	);
}
