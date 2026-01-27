import { Company } from '../Company';

export interface ICompanyCrudRepository {
    index(): Promise<Company[]>;
    show(id: number): Promise<Company>;
}
