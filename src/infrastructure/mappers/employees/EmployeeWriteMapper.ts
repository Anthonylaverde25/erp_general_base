import { CreateEmployeeDTO, UpdateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { CreateEmployeeWriteData, UpdateEmployeeWriteData } from '@/domain/entities/employees/EmployeeEntity';

export class EmployeeWriteMapper {
	static toCreateDTO(data: CreateEmployeeWriteData): CreateEmployeeDTO {
		return {
			company_id: data.companyId,
			department_id: data.departmentId,
			job_position_id: data.jobPositionId,
			first_name: data.firstName,
			last_name: data.lastName,
			document_type: data.documentType,
			document_number: data.documentNumber,
			birth_date: data.birthDate,
			gender: data.gender,
			hire_date: data.hireDate,
			termination_date: data.terminationDate,
			status: data.status,
			address: data.address,
			contact: data.contact,
			bank_accounts: data.bankAccounts
		};
	}

	static toUpdateDTO(data: UpdateEmployeeWriteData): UpdateEmployeeDTO {
		return {
			company_id: data.companyId,
			department_id: data.departmentId,
			job_position_id: data.jobPositionId,
			first_name: data.firstName,
			last_name: data.lastName,
			document_type: data.documentType,
			document_number: data.documentNumber,
			birth_date: data.birthDate,
			gender: data.gender,
			hire_date: data.hireDate,
			termination_date: data.terminationDate,
			status: data.status,
			address: data.address,
			contact: data.contact,
			bank_accounts: data.bankAccounts
		};
	}
}
