import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DepartmentsHeader from '../components/DepartmentsHeader';
import DepartmentOverview from '../components/DepartmentOverview';
import useIndexDepartments from '@/features/departments/hooks/useIndexDepartments';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IDepartment } from '@/types/department.types';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
}));

// Recursive function to find a department and its breadcrumb path
function findDepartmentAndPath(
	departments: IDepartment[],
	targetCode: string,
	currentPath: { title: string; url: string; code: string }[] = []
): { department: IDepartment | null; path: { title: string; url: string; code: string }[] } {
	for (const dept of departments) {
		const newPath = [...currentPath, { title: dept.name, url: `/departments/${dept.code}`, code: dept.code }];

		if (dept.code === targetCode) {
			return { department: dept, path: newPath };
		}

		if (dept.children && dept.children.length > 0) {
			const found = findDepartmentAndPath(dept.children, targetCode, newPath);

			if (found.department) {
				return found;
			}
		}
	}
	return { department: null, path: [] };
}

export default function DepartmentsPage() {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const { departments } = useIndexDepartments();

	// Use memo to avoid recalculating the path on every render if inputs haven't changed
	const { selectedDepartment, breadcrumbPath } = useMemo(() => {
		if (!departments || departments.length === 0)
			return {
				selectedDepartment: null as IDepartment | null,
				breadcrumbPath: [] as { title: string; url: string; code: string }[]
			};

		// If there's a code in URL, find it anywhere in the tree
		if (code) {
			const found = findDepartmentAndPath(departments, code);
			return {
				selectedDepartment: found.department,
				breadcrumbPath: found.path
			};
		}

		// Otherwise, default to first root department
		const defaultDept = departments[0];
		return {
			selectedDepartment: defaultDept,
			breadcrumbPath: [
				{ title: defaultDept.name, url: `/departments/${defaultDept.code}`, code: defaultDept.code }
			]
		};
	}, [departments, code]);

	useEffect(() => {
		// Guarantee we are on an active tab if /departments is hit without a code
		if (!code && selectedDepartment) {
			navigate(`/departments/${selectedDepartment.code}`, { replace: true });
		}
	}, [code, selectedDepartment, navigate]);

	const handleSelectDepartment = (newCode: string) => {
		navigate(`/departments/${newCode}`);
	};

	// Determine which root tab should be highlighted (the ancestor of the current selection)
	const activeRootTabCode =
		breadcrumbPath.length > 0
			? breadcrumbPath[0].code
			: departments && departments.length > 0
				? departments[0].code
				: '';

	const selectedDepartmentId = selectedDepartment?.id || null;

	return (
		<Root
			header={
				<DepartmentsHeader
					currentDepartmentCode={activeRootTabCode}
					onSelectDepartment={handleSelectDepartment}
					customBreadcrumbs={breadcrumbPath}
				/>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					<DepartmentOverview departmentId={selectedDepartmentId} />
				</Box>
			}
			scroll="content"
		/>
	);
}
