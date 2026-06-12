import { Container } from 'inversify';
import { TYPES } from '../types';
import { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';
import { EmployeeRepositoryCrud } from '@/infrastructure/repositories/employee/EmployeeRepositoryCrud';
import { IndexEmployeesUseCase } from '@/application/use_cases/employees/IndexEmployeesUseCase';
import { ShowEmployeeUseCase } from '@/application/use_cases/employees/ShowEmployeeUseCase';
import { CreateEmployeeUseCase } from '@/application/use_cases/employees/CreateEmployeeUseCase';
import { UpdateEmployeeUseCase } from '@/application/use_cases/employees/UpdateEmployeeUseCase';
import { DeleteEmployeeUseCase } from '@/application/use_cases/employees/DeleteEmployeeUseCase';

export const registerEmployeeModule = (container: Container) => {
	container.bind<IEmployeeRepository>(TYPES.EmployeeRepository).to(EmployeeRepositoryCrud);
	container.bind<IndexEmployeesUseCase>(TYPES.IndexEmployeesUseCase).to(IndexEmployeesUseCase);
	container.bind<ShowEmployeeUseCase>(TYPES.ShowEmployeeUseCase).to(ShowEmployeeUseCase);
	container.bind<CreateEmployeeUseCase>(TYPES.CreateEmployeeUseCase).to(CreateEmployeeUseCase);
	container.bind<UpdateEmployeeUseCase>(TYPES.UpdateEmployeeUseCase).to(UpdateEmployeeUseCase);
	container.bind<DeleteEmployeeUseCase>(TYPES.DeleteEmployeeUseCase).to(DeleteEmployeeUseCase);
};
