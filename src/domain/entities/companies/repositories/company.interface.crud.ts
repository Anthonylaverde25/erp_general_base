import { CompanyEntity } from '../Company';
import { UpdateCompanyDTO } from '../DTOs/UpdateCompanyDTO';

export interface ICompanyCrudRepository {
    index(): Promise<CompanyEntity[]>;
    show(id: number): Promise<CompanyEntity>;
    update(id: number, data: UpdateCompanyDTO): Promise<{ company: CompanyEntity; message: string }>;
}
