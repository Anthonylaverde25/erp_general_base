import { Container } from 'inversify';
import { TYPES } from '../types';
import { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { DepartmentRepositoryImpl } from '@/infrastructure/repositories/DepartmentRepositoryImpl';
import { IndexDepartmentsUseCase } from '@/application/use_cases/departments/IndexDepartmentsUseCase';
import { ShowDepartmentUseCase } from '@/application/use_cases/departments/ShowDepartmentUseCase';
import { CreateDepartmentUseCase } from '@/application/use_cases/departments/CreateDepartmentUseCase';
import { UpdateDepartmentUseCase } from '@/application/use_cases/departments/UpdateDepartmentUseCase';
import { DeleteDepartmentUseCase } from '@/application/use_cases/departments/DeleteDepartmentUseCase';

export const registerDepartmentModule = (container: Container) => {
    // Repository
    container.bind<IDepartmentRepository>(TYPES.IDepartmentRepository).to(DepartmentRepositoryImpl);

    // Use Cases
    container.bind<IndexDepartmentsUseCase>(TYPES.IndexDepartmentsUseCase).to(IndexDepartmentsUseCase);
    container.bind<ShowDepartmentUseCase>(TYPES.ShowDepartmentUseCase).to(ShowDepartmentUseCase);
    container.bind<CreateDepartmentUseCase>(TYPES.CreateDepartmentUseCase).to(CreateDepartmentUseCase);
    container.bind<UpdateDepartmentUseCase>(TYPES.UpdateDepartmentUseCase).to(UpdateDepartmentUseCase);
    container.bind<DeleteDepartmentUseCase>(TYPES.DeleteDepartmentUseCase).to(DeleteDepartmentUseCase);
};
