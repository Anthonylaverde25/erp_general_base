import { EmployeeEntity } from '../EmployeeEntity';

export interface IEmployeeRepository {
	index(search?: string): Promise<EmployeeEntity[]>;
	show(id: number): Promise<EmployeeEntity>;
	create(data: EmployeeEntity): Promise<{ employee: EmployeeEntity; message: string }>;
	update(id: number, data: EmployeeEntity): Promise<{ employee: EmployeeEntity; message: string }>;
	delete(id: number): Promise<void>;
}
