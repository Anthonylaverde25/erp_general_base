export interface DepartmentStats {
	totalEmployees: number;
	subDepartments: number;
	rolesCount: number;
}

export interface DepartmentManager {
	initials: string;
	name: string;
}

export interface DepartmentSubDepartment {
	id: number;
	name: string;
	code: string;
	employees: number;
}

export interface DepartmentRecentEmployee {
	id: number;
	name: string;
	role: string;
	initials: string;
}

export interface DepartmentOverviewModel {
	name: string;
	code: string;
	description: string;
	active: boolean;
	manager: DepartmentManager;
	stats: DepartmentStats;
	recentEmployees: DepartmentRecentEmployee[];
	subDepartments: DepartmentSubDepartment[];
}
