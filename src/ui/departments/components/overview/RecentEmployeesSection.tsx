import { PersonAddOutlined } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, Button, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EmptyState from './EmptyState';
import { DepartmentRecentEmployee } from './types';

interface RecentEmployeesSectionProps {
	recentEmployees: DepartmentRecentEmployee[];
	onAddCollaborator: () => void;
	onSelectEmployee: (userId: number) => void;
}

export default function RecentEmployeesSection({
	recentEmployees,
	onAddCollaborator,
	onSelectEmployee
}: RecentEmployeesSectionProps) {
	const totalRecentEmployees = recentEmployees.length;

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 2
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Typography
						variant="h6"
						fontWeight={700}
						sx={{ letterSpacing: '-0.01em' }}
					>
						Integrantes Recientes
					</Typography>
					<Avatar
						sx={{
							width: 22,
							height: 22,
							fontSize: '0.7rem',
							fontWeight: 700,
							bgcolor: 'action.selected',
							color: 'text.primary'
						}}
					>
						{totalRecentEmployees}
					</Avatar>
				</Box>
				<Button
					size="small"
					sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
				>
					Directorio completo
				</Button>
			</Box>

			{recentEmployees.length > 0 ? (
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow>
								<TableHead className="h-10 w-[80px]"></TableHead>
								<TableHead className="h-10 font-bold text-slate-700">Nombre y Rol</TableHead>
								<TableHead className="h-10 text-right font-bold text-slate-700"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentEmployees.map((emp) => (
								<TableRow
									key={emp.id}
									className="h-16 cursor-pointer"
									onClick={() => onSelectEmployee(emp.id)}
								>
									<TableCell className="py-4 text-center">
										<Avatar
											sx={{
												width: 36,
												height: 36,
												bgcolor: 'action.hover',
												color: 'text.secondary',
												fontSize: 13,
												fontWeight: 700
											}}
										>
											{emp.initials}
										</Avatar>
									</TableCell>
									<TableCell className="py-2">
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												gap: 0.5
											}}
										>
											<Typography
												variant="body2"
												fontWeight={600}
												sx={{ lineHeight: 1.2 }}
											>
												{emp.name}
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												{emp.role}
											</Typography>
										</Box>
									</TableCell>
									<TableCell className="py-4 pr-6 text-right">
										<Button
											size="small"
											variant="text"
											color="primary"
											onClick={(event) => {
												event.stopPropagation();
												onSelectEmployee(emp.id);
											}}
											sx={{
												textTransform: 'none',
												fontSize: '0.75rem',
												fontWeight: 600
											}}
										>
											Ver Perfil
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<EmptyState
					icon={
						<AvatarGroup
							max={3}
							sx={{
								'& .MuiAvatar-root': {
									width: 40,
									height: 40,
									fontSize: '1rem',
									border: '2px solid white'
								}
							}}
						>
							<Avatar sx={{ bgcolor: 'primary.main' }} />
							<Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }} />
						</AvatarGroup>
					}
					title="Sin integrantes registrados"
					description="Aún no hay colaboradores asignados a este departamento."
					action={
						<Button
							variant="outlined"
							size="small"
							startIcon={<PersonAddOutlined />}
							sx={{ textTransform: 'none', borderRadius: 2 }}
							onClick={onAddCollaborator}
						>
							Agregar integrante
						</Button>
					}
				/>
			)}
		</Box>
	);
}
