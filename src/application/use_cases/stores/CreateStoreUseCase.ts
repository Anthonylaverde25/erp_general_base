import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCase } from "@/application/use_cases/IUseCase";
import type { IStoreRepository } from "@/domain/entities/stores/repositories/store.interface.repository";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";
import { CreateStoreDTO } from "@/domain/entities/stores/DTOs/CreateStoreDTO";

@injectable()
export class CreateStoreUseCase
    implements IUseCase<CreateStoreDTO, { store: StoreEntity; message: string }> {
    constructor(
        @inject(TYPES.IStoreRepository)
        private readonly repository: IStoreRepository,
    ) { }

    async execute(
        data: CreateStoreDTO,
    ): Promise<{ store: StoreEntity; message: string }> {
        return await this.repository.create(data);
    }
}
