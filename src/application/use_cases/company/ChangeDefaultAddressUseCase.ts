import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { ICompanyActionRepository } from "@/domain/entities/companies/repositories/company.interface.action";

@injectable()
export class ChangeDefaultAddressUseCase {
    constructor(
        @inject(TYPES.ICompanyActionRepository) private repository: ICompanyActionRepository
    ) { }

    execute(addressId: number) {
        return this.repository.changeDefaultAddress(addressId);
    }
}
