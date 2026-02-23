import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from '@fuse/core/Link';
import { Fragment } from 'react';

interface DepartmentsHeaderProps {
    className?: string;
    currentDepartmentCode: string;
    onSelectDepartment: (code: string) => void;
    customBreadcrumbs?: { title: string, url: string, code: string }[];
}

export default function DepartmentsHeader({ className, currentDepartmentCode, onSelectDepartment, customBreadcrumbs }: DepartmentsHeaderProps) {
    const { t } = useTranslation('navigation');
    const { departments, isLoading } = useIndexDepartments();

    return (
        <Box
            className={clsx('flex flex-col', className)}
            sx={{
                pt: '0.5rem',
                px: '0.5rem',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}
        >
            {customBreadcrumbs && customBreadcrumbs.length > 0 ? (
                <Breadcrumb className="mb-2">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/departments" className="max-w-32 truncate capitalize">
                                    Departamentos
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {customBreadcrumbs.map((crumb, index) => {
                            const isLast = index === customBreadcrumbs.length - 1;

                            return (
                                <Fragment key={crumb.code}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="max-w-32 truncate capitalize">
                                                {crumb.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link to={crumb.url} className="max-w-32 truncate capitalize">
                                                    {crumb.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            ) : (
                <PageBreadcrumb className="mb-2" />
            )}

            <Box className="mt-2 mb-2 flex items-center gap-3">
                {customBreadcrumbs && customBreadcrumbs.length > 1 && (
                    <IconButton
                        size="small"
                        onClick={() => {
                            // Obtener la URL del penúltimo elemento de las migas de pan (el padre directo)
                            const parentUrl = customBreadcrumbs[customBreadcrumbs.length - 2].url;
                            window.location.href = parentUrl;
                        }}
                        sx={{ bgcolor: 'action.hover' }}
                    >
                        <ArrowBack />
                    </IconButton>
                )}
                <Box>
                    <Typography className="text-3xl leading-none font-bold tracking-tight lg:ml-0">
                        {t('DEPARTMENTS')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mt-1"
                    >
                        Estructura organizacional
                    </Typography>
                </Box>
            </Box>

            <Tabs
                value={currentDepartmentCode}
                onValueChange={(value) => onSelectDepartment(value)}
                className="w-full mt-4"
            >
                <div
                    className="w-full overflow-x-auto overflow-y-hidden pb-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-2 w-max">
                        {isLoading ? (
                            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                                Cargando departamentos...
                            </Typography>
                        ) : departments?.map((dept) => (
                            <TabsTrigger
                                key={dept.id}
                                value={dept.code}
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent px-4 py-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {dept.code} - {dept.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            </Tabs>
        </Box>
    );
}
