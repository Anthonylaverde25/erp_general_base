import { Company } from "../Company";

export interface ICompanyActionRepository {
    changeCompany(companyId: Company['id']): Promise<void>;
}