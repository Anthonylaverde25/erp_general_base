import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { EmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { AddressEntity } from '@/domain/entities/addresses/Address';
import { ContactEntity } from '@/domain/entities/contacts/Contact';
import { BankAccountEntity } from '@/domain/entities/bank_accounts/BankAccount';

export class EmployeeMapper {
	static fromDTO(dto: EmployeeDTO): EmployeeEntity {
		return new EmployeeEntity(
			dto.id,
			dto.company_id,
			dto.department_id ?? null,
			dto.job_position_id ?? null,
			dto.first_name,
			dto.last_name,
			dto.document_type,
			dto.document_number,
			dto.birth_date ?? null,
			dto.gender ?? null,
			dto.hire_date,
			dto.termination_date ?? null,
			dto.status ?? 'active',
			Array.isArray(dto.address) ? dto.address.map((addr) => AddressEntity.fromPrimitives(addr)) : [],
			Array.isArray(dto.contact) ? dto.contact.map((cnt) => ContactEntity.fromPrimitives(cnt)) : [],
			Array.isArray(dto.bank_accounts)
				? dto.bank_accounts.map((acc) => BankAccountEntity.fromPrimitives(acc))
				: [],
			dto.job_position ?? null
		);
	}

	static fromDTOList(dtos: EmployeeDTO[]): EmployeeEntity[] {
		return dtos.map((dto) => EmployeeMapper.fromDTO(dto));
	}
}
