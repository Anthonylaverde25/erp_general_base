import { inject, injectable } from "inversify";
import { IUseCase } from "../IUseCase";
import { TYPES } from "@/di/types";
import type { IStoreActionRepository } from "@/domain/entities/stores/repositories/store.action.repository";



interface IParams {
    storeId: number;
    addressId: number;
}

@injectable()
export class RemoveAddressUseCase implements IUseCase<IParams, void> {
    constructor(@inject(TYPES.IStoreActionRepository)
    private readonly repository: IStoreActionRepository,
    ) { }

    async execute(params: IParams): Promise<void> {
        return await this.repository.removeAddress(params.storeId, params.addressId);
    }
}
