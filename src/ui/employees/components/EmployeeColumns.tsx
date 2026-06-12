import { MRT_ColumnDef } from 'material-react-table';
import { Avatar, Chip, Typography, Box } from '@mui/material';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { IDepartment } from '@/types/department.types';

// Helper to find department name by ID
const getDepartmentName = (departmentId: number | null | undefined, departments: IDepartment[]): string => {
	if (!departmentId || !departments) return 'Sin asignar';
	const dept = departments.find((d) => d.id === departmentId);
	return dept ? dept.name : 'Sin asignar';
};

// Generate a Hue color based on the employee's name
const stringToColor = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return `hsl(${hue}, 65%, 45%)`;
};

// Get initials from name
const getInitials = (firstName: string, lastName: string) => {
	const firstInitial = firstName ? firstName.charAt(0) : '';
	const lastInitial = lastName ? lastName.charAt(0) : '';
	return `${firstInitial}${lastInitial}`.toUpperCase() || 'EM';
};

export const getEmployeeColumns = (departments: IDepartment[]): MRT_ColumnDef<EmployeeEntity>[] => [
	{
		accessorKey: 'full_name',
		header: 'Nombre Completo',
		size: 220,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => {
			const employee = row.original;
			const name = employee.full_name;

			return (
				<Box className="flex items-center gap-2 py-0.5">
					<Avatar
						sx={{
							width: 28,
							height: 28,
							bgcolor: stringToColor(name),
							fontSize: '0.75rem',
							fontWeight: 600
						}}
					>
						{getInitials(employee.first_name, employee.last_name)}
					</Avatar>
					<Box className="flex flex-col">
						<Typography
							variant="body2"
							fontWeight={600}
							sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}
						>
							{name}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
						>
							ID: {employee.id}
						</Typography>
					</Box>
				</Box>
			);
		}
	},
	{
		accessorKey: 'document_number',
		header: 'Documento',
		size: 130,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => (
			<Box>
				<Typography
					variant="body2"
					sx={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}
				>
					{row.original.document_number}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ fontSize: '0.7rem' }}
				>
					{row.original.document_type}
				</Typography>
			</Box>
		)
	},
	{
		accessorKey: 'department_id',
		header: 'Departamento',
		size: 150,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => (
			<Typography
				variant="body2"
				sx={{ fontSize: '0.8125rem' }}
			>
				{getDepartmentName(row.original.department_id, departments)}
			</Typography>
		)
	},
	{
		accessorKey: 'job_position_id',
		header: 'Puesto',
		size: 140,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => {
			const jobPos = row.original.job_position;
			return (
				<Typography
					variant="body2"
					sx={{ fontSize: '0.8125rem' }}
				>
					{jobPos ? jobPos.name : 'Sin asignar'}
				</Typography>
			);
		}
	},
	{
		accessorKey: 'contact',
		header: 'Contacto',
		size: 200,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => {
			const contact = row.original.contact && row.original.contact.length > 0 ? row.original.contact[0] : null;

			if (!contact) {
				return (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontSize: '0.8125rem', fontStyle: 'italic' }}
					>
						Sin datos
					</Typography>
				);
			}

			return (
				<Box>
					<Typography
						variant="body2"
						className="truncate"
						sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}
					>
						{contact.email || 'Sin email'}
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
					>
						{contact.phone || 'Sin teléfono'}
					</Typography>
				</Box>
			);
		}
	},
	{
		accessorKey: 'hire_date',
		header: 'Fecha Contratación',
		size: 140,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => (
			<Typography
				variant="body2"
				sx={{ fontSize: '0.8125rem' }}
			>
				{row.original.hire_date || '-'}
			</Typography>
		)
	},
	{
		accessorKey: 'status',
		header: 'Estado',
		size: 120,
		enableResizing: true,
		enableColumnFilter: true,
		Cell: ({ row }) => {
			const status = row.original.status;

			let label = 'Activo';
			let color: 'success' | 'default' | 'warning' | 'error' = 'success';

			switch (status) {
				case 'active':
					label = 'Activo';
					color = 'success';
					break;
				case 'inactive':
					label = 'Inactivo';
					color = 'default';
					break;
				case 'on_leave':
					label = 'Licencia';
					color = 'warning';
					break;
				case 'terminated':
					label = 'Desvinculado';
					color = 'error';
					break;
			}

			return (
				<Chip
					label={label}
					size="small"
					color={color}
					variant="filled"
					sx={{ fontSize: '0.75rem', borderRadius: '4px' }}
				/>
			);
		}
	}
];
