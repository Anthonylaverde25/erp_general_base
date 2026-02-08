import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCase } from "@/application/use_cases/IUseCase";
import type { ICompanyActionRepository } from "@/domain/entities/companies/repositories/company.interface.action";

@injectable()
export class ChangeDefaultAddressUseCase implements IUseCase<number, { status: number; message: string }> {
    constructor(
        @inject(TYPES.ICompanyActionRepository) private repository: ICompanyActionRepository
    ) { }

    async execute(addressId: number): Promise<{ status: number; message: string }> {
        return await this.repository.changeDefaultAddress(addressId);
    }
}
