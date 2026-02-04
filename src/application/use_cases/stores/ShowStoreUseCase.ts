import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCase } from "@/application/use_cases/IUseCase";
import type { IStoreRepository } from "@/domain/entities/stores/repositories/store.interface.repository";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";

@injectable()
export class ShowStoreUseCase implements IUseCase<number, StoreEntity> {
    constructor(
        @inject(TYPES.IStoreRepository)
        private readonly repository: IStoreRepository,
    ) { }

    async execute(id: number): Promise<StoreEntity> {
        return await this.repository.show(id);
    }
}
