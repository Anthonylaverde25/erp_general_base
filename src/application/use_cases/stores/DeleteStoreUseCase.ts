import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCase } from "@/application/use_cases/IUseCase";
import type { IStoreRepository } from "@/domain/entities/stores/repositories/store.interface.repository";

@injectable()
export class DeleteStoreUseCase implements IUseCase<number, void> {
    constructor(
        @inject(TYPES.IStoreRepository)
        private readonly repository: IStoreRepository,
    ) { }

    async execute(id: number): Promise<void> {
        return await this.repository.delete(id);
    }
}
