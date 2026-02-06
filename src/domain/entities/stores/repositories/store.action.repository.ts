
export interface IStoreActionRepository {
    toggleStatus(id: number, status: boolean): Promise<void>;
}
