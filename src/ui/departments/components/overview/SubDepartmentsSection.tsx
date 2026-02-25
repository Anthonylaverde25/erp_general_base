import { AccountTreeOutlined } from '@mui/icons-material';
import { Box, Button, Chip, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EmptyState from './EmptyState';
import { DepartmentSubDepartment } from './types';

interface SubDepartmentsSectionProps {
	subDepartments: DepartmentSubDepartment[];
	onSelectSubDepartment: (code: string) => void;
}

export default function SubDepartmentsSection({ subDepartments, onSelectSubDepartment }: SubDepartmentsSectionProps) {
	const totalSubDepartments = subDepartments.length;

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 2
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Typography
						variant="h6"
						fontWeight={700}
						sx={{ letterSpacing: '-0.01em' }}
					>
						Sub-departamentos
					</Typography>
					<Chip
						label={totalSubDepartments}
						size="small"
						sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
					/>
				</Box>
			</Box>
			{subDepartments.length > 0 ? (
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow>
								<TableHead className="h-10 w-[120px] font-bold text-slate-700">Código</TableHead>
								<TableHead className="h-10 font-bold text-slate-700">Nombre de Área</TableHead>
								<TableHead className="h-10 text-right font-bold text-slate-700">Empleados</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{subDepartments.map((subDept) => (
								<TableRow
									key={subDept.id}
									className="group h-14 cursor-pointer transition-colors hover:bg-slate-50"
									onClick={() => onSelectSubDepartment(subDept.code)}
								>
									<TableCell className="py-4 text-xs font-medium text-slate-500">
										{subDept.code}
									</TableCell>
									<TableCell className="py-4">
										<div className="flex items-center gap-3">
											<AccountTreeOutlined
												fontSize="small"
												className="text-primary opacity-80"
											/>
											<span className="text-sm font-semibold">{subDept.name}</span>
										</div>
									</TableCell>
									<TableCell className="py-4 text-right">
										<Chip
											label={`${subDept.employees}`}
											size="small"
											sx={{
												height: 24,
												fontSize: '0.75rem',
												fontWeight: 600,
												bgcolor: 'action.selected'
											}}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<EmptyState
					icon={<AccountTreeOutlined sx={{ fontSize: 40 }} />}
					title="No hay sub-departamentos"
					description="Esta área no tiene subdivisiones o departamentos dependientes configurados."
					action={
						<Button
							variant="outlined"
							size="small"
							startIcon={<AccountTreeOutlined />}
							sx={{ textTransform: 'none', borderRadius: 2 }}
						>
							Crear sub-departamento
						</Button>
					}
				/>
			)}
		</Box>
	);
}
