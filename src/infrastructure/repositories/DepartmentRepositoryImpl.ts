import { injectable } from 'inversify';
import { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { IDepartment, ICreateDepartment, IUpdateDepartment } from '@/types/department.types';
import axios from 'axios';
import { DepartmentEntity } from '@/domain/entities/departments/Department';
import axiosInstance from '@/lib/@axios';

@injectable()
export class DepartmentRepositoryImpl implements IDepartmentRepository {
    private readonly baseUrl = '/departments';

    async index(): Promise<IDepartment[]> {
        const { data: { departments } } = await axiosInstance.get(this.baseUrl);
        return departments.map((item: any) => DepartmentEntity.fromPrimitives(item));
    }

    async show(id: number): Promise<IDepartment> {
        const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
        const departmentData = response.data.data || response.data.department || response.data;
        return DepartmentEntity.fromPrimitives(departmentData);
    }
    async create(data: ICreateDepartment): Promise<IDepartment> {
        const response = await axiosInstance.post(this.baseUrl, data);
        const departmentData = response.data.data || response.data.department || response.data;
        return DepartmentEntity.fromPrimitives(departmentData);
    }

    async update(id: number, data: IUpdateDepartment): Promise<IDepartment> {
        const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
        const departmentData = response.data.data || response.data.department || response.data;
        return DepartmentEntity.fromPrimitives(departmentData);
    }

    async destroy(id: number): Promise<void> {
        await axiosInstance.delete(`${this.baseUrl}/${id}`);
    }
}
