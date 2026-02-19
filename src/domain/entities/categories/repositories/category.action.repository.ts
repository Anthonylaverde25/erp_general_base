export interface ICategoryActionRepository {
    toggleStatus(id: number, status: boolean): Promise<void>;
}
