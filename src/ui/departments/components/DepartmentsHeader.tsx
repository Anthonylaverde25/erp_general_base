import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from '@fuse/core/Link';
import { Fragment } from 'react';
import PageHeader from '@/components/PageHeader';
import { useNavigate } from 'react-router';

interface DepartmentsHeaderProps {
	className?: string;
	currentDepartmentCode: string;
	onSelectDepartment: (code: string) => void;
	customBreadcrumbs?: { title: string; url: string; code: string }[];
}

export default function DepartmentsHeader({ className, currentDepartmentCode, onSelectDepartment, customBreadcrumbs }: DepartmentsHeaderProps) {
	const { t } = useTranslation('navigation');
	const { departments, isLoading } = useIndexDepartments();
	const navigate = useNavigate();

	const hasBack = customBreadcrumbs && customBreadcrumbs.length > 1;
	const onBack = hasBack ? () => {
		const parentUrl = customBreadcrumbs[customBreadcrumbs.length - 2].url;
		navigate(parentUrl);
	} : undefined;

	return (
		<Box className={clsx('flex flex-col w-full', className)} sx={{ bgcolor: 'background.paper' }}>
			<PageHeader
				showBreadcrumb={!customBreadcrumbs || customBreadcrumbs.length === 0}
				title={
					<Box className="flex flex-col">
						{customBreadcrumbs && customBreadcrumbs.length > 0 && (
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
						)}
						<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
							{t('DEPARTMENTS')}
						</Typography>
					</Box>
				}
				subtitle="Estructura organizacional"
				onBack={onBack}
			/>

			<Box sx={{ px: 8, pb: 2 }}>
				<Tabs
					value={currentDepartmentCode}
					onValueChange={(value) => onSelectDepartment(value)}
					className="w-full"
				>
					<div
						className="w-full overflow-x-auto overflow-y-hidden pb-1"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						<TabsList className="bg-transparent h-auto p-0 flex justify-start gap-2 w-max">
							{isLoading ? (
								<Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
									Cargando departamentos…
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
		</Box>
	);
}
