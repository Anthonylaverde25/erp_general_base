import { Store } from "@/types/store.types";
import { CreateStoreDTO } from "./DTOs/CreateStoreDTO";

export class StoreEntity implements Store {
    constructor(
        public id: number | undefined,
        public company_id: number | undefined,
        public name: string,
        public code: string | undefined,
        public is_active: boolean,
    ) { }

    static fromPrimitives(data: Store): StoreEntity {
        return new StoreEntity(
            data.id,
            data.company_id,
            data.name,
            data.code,
            data.is_active ?? true,
        );
    }

    static create(data: CreateStoreDTO): StoreEntity {
        return new StoreEntity(
            undefined,
            undefined,
            data.name,
            data.code,
            data.is_active ?? true,
        );
    }

    toPlainObject(): Store {
        return {
            id: this.id,
            company_id: this.company_id,
            name: this.name,
            code: this.code,
            is_active: this.is_active,
        };
    }
}
