import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCase } from "@/application/use_cases/IUseCase";
import type { IStoreRepository } from "@/domain/entities/stores/repositories/store.interface.repository";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";

@injectable()
export class UpdateStoreUseCase
    implements
    IUseCase<
        { id: number; data: Partial<StoreEntity> },
        { store: StoreEntity; message: string }
    > {
    constructor(
        @inject(TYPES.IStoreRepository)
        private readonly repository: IStoreRepository,
    ) { }

    async execute({
        id,
        data,
    }: {
        id: number;
        data: Partial<StoreEntity>;
    }): Promise<{ store: StoreEntity; message: string }> {
        return await this.repository.update(id, data);
    }
}
