import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { EmployeeMapper } from '@/infrastructure/mappers/employees/EmployeeMapper';
import { EmployeeWriteMapper } from '@/infrastructure/mappers/employees/EmployeeWriteMapper';

@injectable()
export class EmployeeRepositoryCrud implements IEmployeeRepository {
	async index(search?: string): Promise<EmployeeEntity[]> {
		const {
			data: { employees }
		} = await axiosInstance.get('employees', {
			params: { q: search }
		});
		return EmployeeMapper.fromDTOList(employees);
	}

	async show(id: number): Promise<EmployeeEntity> {
		const {
			data: { employee }
		} = await axiosInstance.get(`employees/${id}`);
		return EmployeeMapper.fromDTO(employee);
	}

	async create(data: EmployeeEntity): Promise<{ employee: EmployeeEntity; message: string }> {
		const payload = EmployeeWriteMapper.toCreateDTO(data.toCreateData());
		const {
			data: { employee, message }
		} = await axiosInstance.post('employees', payload);
		return {
			employee: EmployeeMapper.fromDTO(employee),
			message
		};
	}

	async update(id: number, data: EmployeeEntity): Promise<{ employee: EmployeeEntity; message: string }> {
		const payload = EmployeeWriteMapper.toUpdateDTO(data.toUpdateData());
		const {
			data: { employee, message }
		} = await axiosInstance.put(`employees/${id}`, payload);
		return {
			employee: EmployeeMapper.fromDTO(employee),
			message
		};
	}

	async delete(id: number): Promise<void> {
		await axiosInstance.delete(`employees/${id}`);
	}
}
