

export interface IFamilyActionRepository {
    toggleStatus(id: number, status: boolean): Promise<void>;
}
