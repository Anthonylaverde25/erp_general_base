import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { PaymentMethodEntity } from '@/domain/entities/payment_methods/PaymentMethod';
import { CreatePaymentMethodDTO } from '@/domain/entities/payment_methods/DTOs/CreatePaymentMethodDTO';
import { PaymentMethod } from '@/types/payment_method.types';
import { PaymentMethodMapper } from '@/domain/entities/payment_methods/Mappers/PaymentMethodMapper';

@injectable()
export class PaymentMethodRepositoryCrud implements IPaymentMethodRepository {
    async index(): Promise<PaymentMethodEntity[]> {
        const { data: { payment_methods } } = await axiosInstance.get(`payment-methods`);
        return PaymentMethodMapper.fromDetailDTOList(payment_methods);
    }

    async create(data: CreatePaymentMethodDTO): Promise<{ paymentMethod: PaymentMethodEntity; message: string }> {
        const {
            data: { payment_method, message }
        } = await axiosInstance.post(`payment-methods`, data);
        return {
            paymentMethod: PaymentMethodMapper.fromDetailDTO(payment_method),
            message
        };
    }

    async show(id: PaymentMethod['id']): Promise<PaymentMethodEntity> {
        const {
            data: { payment_method }
        } = await axiosInstance.get(`payment-methods/${id}`);
        return PaymentMethodEntity.fromPrimitives(payment_method);
    }

    async update(id: PaymentMethod['id'], data: Partial<PaymentMethodEntity>): Promise<{ paymentMethod: PaymentMethodEntity; message: string; }> {
        const payload = data.toPlainObject();
        try {
            const { data: { payment_method, message } } = await axiosInstance.put(`payment-methods/${id}`, payload);
            return {
                paymentMethod: PaymentMethodMapper.fromDetailDTO(payment_method),
                message
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`payment-methods/${id}`);
    }
}
