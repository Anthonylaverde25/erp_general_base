import { IDepartment, ICreateDepartment, IUpdateDepartment } from '@/types/department.types';

export interface IDepartmentRepository {
    index(): Promise<IDepartment[]>;
    show(id: number): Promise<IDepartment>;
    create(data: ICreateDepartment): Promise<IDepartment>;
    update(id: number, data: IUpdateDepartment): Promise<IDepartment>;
    destroy(id: number): Promise<void>;
}
