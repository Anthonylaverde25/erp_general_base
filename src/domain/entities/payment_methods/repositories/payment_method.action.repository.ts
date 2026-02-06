
export interface IPaymentMethodActionRepository {
    toggleStatus(id: number, status: boolean): Promise<void>;
}
