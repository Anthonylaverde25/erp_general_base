import { Box, Typography, Button, Avatar, Chip, AvatarGroup } from '@mui/material';
import {
    GroupOutlined,
    AccountTreeOutlined,
    ShieldOutlined,
    AdminPanelSettings,
    History,
    PersonAddOutlined,
    InsertDriveFileOutlined
} from '@mui/icons-material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';

import useShowDepartment from '@/features/departments/hooks/useShowDepartment';

interface DepartmentOverviewProps {
    departmentId: number | null;
}

interface KpiCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: ReactNode;
}

function KpiCard({ title, value, subtitle, icon }: KpiCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 3, borderColor: 'divider', bgcolor: 'whitesmoke' }}
        >
            <Typography
                variant="overline"
                sx={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                    fontWeight: 700
                }}
            >
                {title}
            </Typography>
            <Box className="flex items-center gap-3">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}>{icon}</Avatar>
                <Box>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ fontSize: '0.85rem' }}
                    >
                        {value}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed rounded-lg border-slate-200">
            <div className="flex items-center justify-center mb-4 text-slate-400">
                {icon}
            </div>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontSize: '0.95rem', color: 'text.primary' }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 'sm' }} className="text-balance">
                {description}
            </Typography>
            {action && <div>{action}</div>}
        </div>
    );
}

export default function DepartmentOverview({ departmentId }: DepartmentOverviewProps) {
    const navigate = useNavigate();
    const { department, isLoading } = useShowDepartment(departmentId);

    if (!departmentId) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography color="text.secondary" variant="h6">
                    Selecciona un departamento del menú lateral para ver sus detalles.
                </Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography color="text.secondary" variant="h6">
                    Cargando información del departamento...
                </Typography>
            </Box>
        );
    }

    if (!department) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Typography color="text.secondary" variant="h6">
                    Departamento no encontrado.
                </Typography>
            </Box>
        );
    }

    const mockDepartment = {
        name: department.name,
        code: department.code,
        description: department.description || 'Sin descripción',
        active: department.is_active,
        manager: department.manager || { initials: 'ND', name: 'No asignado' },
        stats: {
            totalEmployees: department.users?.length || 0,
            subDepartments: department.children?.length || 0,
            rolesCount: new Set(department.users?.map(u => u.role_id)).size || 0
        },
        recentEmployees: department.users?.slice(0, 5).map(u => ({
            id: u.id,
            name: `${u.name} ${u.last_name || ''}`,
            role: 'Empleado',
            initials: u.name?.substring(0, 2).toUpperCase() || 'E'
        })) || [],
        subDepartments: department.children?.map(sd => ({
            id: sd.id,
            name: sd.name,
            code: sd.code,
            employees: sd.users?.length || 0
        })) || [],
        documents: [
            { id: 1, name: 'Reporte_Operaciones_Q3.pdf', type: 'pdf', date: '22 Oct 2026' },
            { id: 2, name: 'Presupuesto_2027_Oficial.xlsx', type: 'excel', date: '15 Oct 2026' }
        ]
    };

    const actionBtnSx = {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.75rem',
        color: 'text.secondary',
        py: 0.5,
        px: 1.5,
        borderRadius: 0.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'transparent',
        '&:hover': {
            bgcolor: 'action.hover',
            color: 'text.primary',
            borderColor: 'divider'
        }
    } as const;

    // Helper functions for document rendering
    const getDocIconColors = (type: string) => {
        switch (type) {
            case 'pdf': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(220, 38, 38)' };
            case 'excel': return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' };
            case 'word': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(37, 99, 235)' };
            default: return { bg: 'action.selected', color: 'text.secondary' };
        }
    };

    return (
        <Box sx={{ flex: 1, p: 3, overflowY: { xs: 'visible', md: 'auto' } }}>
            {/* Header & Quick Action */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                            {mockDepartment.name}
                        </Typography>

                        {/* Manager inline with title */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, px: 1.5, py: 0.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main', fontWeight: 700 }}>
                                {mockDepartment.manager.initials}
                            </Avatar>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Manager:
                                </Typography>
                                <Typography variant="body2" fontWeight={700}>
                                    {mockDepartment.manager.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {mockDepartment.code} • {mockDepartment.description}
                    </Typography>
                </Box>
            </Box>

            {/* Actions Bar */}
            <Box className="mt-2 mb-4 flex flex-wrap items-center gap-2">
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    className="flex items-center gap-2"
                    sx={{
                        ...actionBtnSx,
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        border: 'none',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            color: 'primary.contrastText',
                        }
                    }}
                >
                    <PersonAddOutlined fontSize="small" />
                    Agregar colaborador o empleado
                </Button>
                <Button variant="outlined" color="inherit" size="small" sx={actionBtnSx} className="flex items-center gap-2">
                    <AdminPanelSettings fontSize="small" />
                    Permisos
                </Button>
                <Button variant="outlined" color="inherit" size="small" sx={actionBtnSx} className="flex items-center gap-2">
                    <History fontSize="small" />
                    Historial
                </Button>
            </Box>

            {/* KPIs */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 1.5,
                    mb: 5
                }}
            >
                <KpiCard
                    title="Plantilla"
                    value={`${mockDepartment.stats.totalEmployees} empleados activos`}
                    subtitle="Capacidad operativa actual"
                    icon={<GroupOutlined sx={{ fontSize: 18 }} />}
                />
                <KpiCard
                    title="Estructura"
                    value={`${mockDepartment.stats.subDepartments} áreas dependientes`}
                    subtitle="Nivel jerárquico actual"
                    icon={<AccountTreeOutlined sx={{ fontSize: 18 }} />}
                />
                <KpiCard
                    title="Roles"
                    value={`${mockDepartment.stats.rolesCount} perfiles distintos`}
                    subtitle="Diversidad de puestos"
                    icon={<ShieldOutlined sx={{ fontSize: 18 }} />}
                />
            </Box>

            {/* Content Layout: Left Tables (2/3) + Right Documents (1/3) */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column (Tables Stacked) */}
                <Box className="col-span-1 md:col-span-2 flex flex-col gap-8">

                    {/* Sub-departments Table */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                                Sub-departamentos
                            </Typography>
                        </Box>
                        {mockDepartment.subDepartments?.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-[120px] font-bold text-slate-700 h-10">Código</TableHead>
                                            <TableHead className="font-bold text-slate-700 h-10">Nombre de Área</TableHead>
                                            <TableHead className="text-right font-bold text-slate-700 h-10">Empleados</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockDepartment.subDepartments.map(subDept => (
                                            <TableRow
                                                key={subDept.id}
                                                className="cursor-pointer group h-14 hover:bg-slate-50 transition-colors"
                                                onClick={() => navigate(`/departments/${subDept.code}`)}
                                            >
                                                <TableCell className="font-medium text-xs text-slate-500 py-4">{subDept.code}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <AccountTreeOutlined fontSize="small" className="text-primary opacity-80" />
                                                        <span className="font-semibold text-sm">{subDept.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4">
                                                    <Chip label={`${subDept.employees}`} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: 'action.selected' }} />
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
                                    <Button variant="outlined" size="small" startIcon={<AccountTreeOutlined />} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                        Crear sub-departamento
                                    </Button>
                                }
                            />
                        )}
                    </Box>

                    {/* Recent Employees Table */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                                Integrantes Recientes
                            </Typography>
                            <Button size="small" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>Directorio completo</Button>
                        </Box>

                        {mockDepartment.recentEmployees?.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-[80px] h-10"></TableHead>
                                            <TableHead className="font-bold text-slate-700 h-10">Nombre y Rol</TableHead>
                                            <TableHead className="text-right font-bold text-slate-700 h-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockDepartment.recentEmployees.map(emp => (
                                            <TableRow key={emp.id} className="cursor-pointer h-16">
                                                <TableCell className="py-4 text-center">
                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'action.hover', color: 'text.secondary', fontSize: 13, fontWeight: 700 }}>
                                                        {emp.initials}
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                                            {emp.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {emp.role}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell className="text-right py-4 pr-6">
                                                    <Button size="small" variant="text" color="primary" sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
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
                                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 40, height: 40, fontSize: '1rem', border: '2px solid white' } }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }} />
                                        <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }} />
                                    </AvatarGroup>
                                }
                                title="Sin integrantes registrados"
                                description="Aún no hay colaboradores asignados a este departamento."
                                action={
                                    <Button variant="outlined" size="small" startIcon={<PersonAddOutlined />} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                        Agregar integrante
                                    </Button>
                                }
                            />
                        )}
                    </Box>
                </Box>

                {/* Right Column (Documents List) */}
                <Box className="col-span-1">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                            Documentos Recientes
                        </Typography>
                    </Box>
                    <Box className="flex flex-col gap-3 rounded-md border p-3 bg-slate-50/30">
                        {mockDepartment.documents.map(doc => {
                            const iconColors = getDocIconColors(doc.type);
                            return (
                                <Box
                                    key={doc.id}
                                    className="flex items-center gap-3 p-3 rounded-md bg-white border shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
                                    sx={{ borderColor: 'divider' }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.25,
                                            borderRadius: 1.5,
                                            bgcolor: iconColors.bg,
                                            color: iconColors.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <InsertDriveFileOutlined fontSize="small" />
                                    </Box>
                                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                        <Typography variant="body2" fontWeight={600} noWrap sx={{ lineHeight: 1.2, mb: 0.5, color: 'text.primary' }}>
                                            {doc.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            Actualizado: {doc.date}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                        <Button fullWidth size="small" sx={{ mt: 1, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                            Ver todos los archivos
                        </Button>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}
