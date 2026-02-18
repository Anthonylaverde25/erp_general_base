import { CategoryEntity } from "../CategoryEntity";

export interface ICategoryRepository {
    index(): Promise<CategoryEntity[]>;
}
