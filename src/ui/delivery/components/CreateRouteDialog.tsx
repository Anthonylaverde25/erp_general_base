import { useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	TextField
} from '@mui/material';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRouteSchema, CreateRouteFormType } from '@/schemas/route/route.schema';
import { MockOrder } from '../types';

interface CreateRouteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	selectedOrders: MockOrder[];
	employees: any[];
	isSubmitting: boolean;
	onSubmit: (formData: CreateRouteFormType) => void;
}

export default function CreateRouteDialog({
	isOpen,
	onClose,
	selectedOrders,
	employees,
	isSubmitting,
	onSubmit
}: CreateRouteDialogProps) {
	const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<CreateRouteFormType>({
		resolver: zodResolver(createRouteSchema),
		defaultValues: {
			employee_id: 0,
			notes: '',
			document_ids: [],
		}
	});

	// Sync document_ids array when selection changes
	useEffect(() => {
		const docIds = selectedOrders.map(o => o.documentId).filter(id => id !== 0);
		setValue('document_ids', docIds);
	}, [selectedOrders, setValue]);

	// Reset form when modal closes or opens
	useEffect(() => {
		if (isOpen) {
			reset({
				employee_id: 0,
				notes: '',
				document_ids: selectedOrders.map(o => o.documentId).filter(id => id !== 0),
			});
		}
	}, [isOpen, reset, selectedOrders]);

	// Calculated route distance & time
	const calculatedDistance = useMemo(() => {
		let sum = 0;
		selectedOrders.forEach((order) => {
			const num = parseFloat(order.distance);
			if (!isNaN(num)) sum += num;
		});
		return sum.toFixed(1);
	}, [selectedOrders]);

	const calculatedTime = useMemo(() => {
		// 15 minutes per stop plus driving buffer
		return selectedOrders.length * 15;
	}, [selectedOrders]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '4px', // Sharp borders DNA
					bgcolor: 'background.paper',
					backgroundImage: 'none',
					border: '1px solid',
					borderColor: 'divider',
				}
			}}
		>
			<DialogTitle className="font-extrabold text-slate-800 dark:text-gray-100 flex justify-between items-center border-b border-solid border-slate-100 dark:border-slate-800 pb-4">
				<span>Crear Ruta de Reparto</span>
				<IconButton size="small" onClick={onClose}>
					<X size={18} />
				</IconButton>
			</DialogTitle>
			<DialogContent className="pt-6 flex flex-col gap-5">
				{/* Route summary cards */}
				<div className="grid grid-cols-3 gap-3">
					<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
						<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pedidos</span>
						<span className="text-lg font-black text-slate-800 dark:text-gray-100">{selectedOrders.length}</span>
					</div>
					<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
						<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Distancia Est.</span>
						<span className="text-lg font-black text-[#005483] dark:text-blue-400">{calculatedDistance} km</span>
					</div>
					<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-[4px] border border-solid border-slate-200 dark:border-slate-800 text-center">
						<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tiempo Est.</span>
						<span className="text-lg font-black text-slate-800 dark:text-gray-100">{calculatedTime} min</span>
					</div>
				</div>

				{/* Form Fields */}
				<div className="flex flex-col gap-4">
					<Controller
						name="employee_id"
						control={control}
						render={({ field }) => (
							<FormControl fullWidth size="small" error={!!errors.employee_id}>
								<InputLabel id="employee-label">Conductor / Técnico</InputLabel>
								<Select
									{...field}
									labelId="employee-label"
									label="Conductor / Técnico"
									sx={{ borderRadius: '4px' }}
								>
									{employees.map((emp) => (
										<MenuItem key={emp.id} value={emp.id}>
											{emp.first_name} {emp.last_name}
										</MenuItem>
									))}
								</Select>
								{errors.employee_id && (
									<FormHelperText>{errors.employee_id.message}</FormHelperText>
								)}
							</FormControl>
						)}
					/>

					<Controller
						name="notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Notas de la Ruta"
								placeholder="Ej: Entregar primero en Microcentro, el cliente de Puerto Madero tiene restricción de horario..."
								multiline
								rows={2}
								size="small"
								error={!!errors.notes}
								helperText={errors.notes?.message}
								fullWidth
								slotProps={{
									input: {
										sx: { borderRadius: '4px' }
									}
								}}
							/>
						)}
					/>
				</div>

				{/* Deliveries sequence list */}
				<div className="flex flex-col gap-2">
					<span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Secuencia de Entrega</span>
					<div className="border border-solid border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden bg-white dark:bg-[#131c2e] p-4 flex flex-col gap-4">
						{selectedOrders.map((order, idx) => (
							<div key={order.id} className="flex gap-3 items-start relative">
								{/* Vertical dashed line indicator */}
								{idx < selectedOrders.length - 1 && (
									<div className="absolute left-[11px] top-6 bottom-[-20px] w-0.5 border-l border-dashed border-slate-300 dark:border-slate-700" />
								)}
								{/* Stop number badge */}
								<div className="w-6 h-6 rounded-full bg-[#005483] text-white flex items-center justify-center text-[11px] font-black shrink-0 z-[1]">
									{idx + 1}
								</div>
								{/* Info */}
								<div className="flex-1 flex flex-col">
									<div className="flex justify-between items-center">
										<span className="text-xs font-black text-slate-800 dark:text-gray-100">{order.customer}</span>
										<span className="text-[10px] font-mono text-slate-400">#{order.id}</span>
									</div>
									<span className="text-[10px] text-slate-500 mt-0.5">{order.address}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
			<DialogActions className="p-5 border-t border-solid border-slate-100 dark:border-slate-800 gap-2">
				<button
					onClick={onClose}
					disabled={isSubmitting}
					className="px-4 py-2 border border-solid border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
				>
					Cancelar
				</button>
				<button
					onClick={handleSubmit(onSubmit)}
					disabled={isSubmitting}
					className="px-4 py-2 bg-[#005483] hover:bg-[#004369] text-white text-xs font-bold rounded-[4px] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
				>
					Confirmar y Despachar
				</button>
			</DialogActions>
		</Dialog>
	);
}
