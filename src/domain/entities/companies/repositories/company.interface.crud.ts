import { UpdateCompanyDTO } from '../DTOs/UpdateCompanyDTO';

export interface ICompanyCrudRepository {
    index(): Promise<Company[]>;
    show(id: number): Promise<Company>;
    update(id: number, data: UpdateCompanyDTO): Promise<{ company: Company; message: string }>;
}
