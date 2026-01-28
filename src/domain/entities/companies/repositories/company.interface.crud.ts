import { Company } from '../Company';

export interface ICompanyCrudRepository {
    index(): Promise<Company[]>;
    show(id: number): Promise<Company>;
    update(id: number, data: Company): Promise<{ company: Company; message: string }>;
}
