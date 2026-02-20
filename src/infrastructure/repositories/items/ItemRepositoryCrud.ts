import axiosInstance from "@/lib/@axios";
import { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import {
  CreateItemDTO,
  UpdateItemDTO,
  ItemDTO,
} from "@/domain/entities/items/DTOs/ItemDTOs";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { ItemMapper } from "@/infrastructure/mappers/items/ItemMapper";
import { injectable } from "inversify";

@injectable()
export class ItemRepositoryCrud implements IItemRepository {
  private readonly baseUrl = "/items";

  private hasFile(value: unknown): boolean {
    if (value instanceof File) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.some((item) => this.hasFile(item));
    }

    if (value && typeof value === "object") {
      return Object.values(value).some((item) => this.hasFile(item));
    }

    return false;
  }

  private appendFormData(
    formData: FormData,
    key: string,
    value: unknown,
  ): void {
    if (value === undefined) {
      return;
    }

    if (value === null) {
      formData.append(key, "");
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        this.appendFormData(formData, `${key}[${index}]`, item);
      });
      return;
    }

    if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(
        ([nestedKey, nestedValue]) => {
          this.appendFormData(formData, `${key}[${nestedKey}]`, nestedValue);
        },
      );
      return;
    }

    formData.append(key, String(value));
  }

  private buildFormData(payload: CreateItemDTO): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      this.appendFormData(formData, key, value);
    });

    return formData;
  }

  async index(): Promise<ItemEntity[]> {
    const { data } = await axiosInstance.get<{ items: ItemDTO[] }>(
      this.baseUrl,
    );
    return data.items.map(ItemMapper.toDomain);
  }

  async show(id: number): Promise<ItemEntity> {
    const { data } = await axiosInstance.get<{ item: ItemDTO }>(
      `${this.baseUrl}/${id}`,
    );
    return ItemMapper.toDomain(data.item);
  }

  async create(
    itemData: CreateItemDTO,
  ): Promise<{ item: ItemEntity; message: string }> {
    const useMultipart = this.hasFile(itemData);
    const requestData = useMultipart
      ? this.buildFormData(itemData)
      : itemData;

    const {
      data: { item, message },
    } = await axiosInstance.post<{ item: ItemDTO; message: string }>(
      this.baseUrl,
      requestData,
      useMultipart
        ? {
            headers: { "Content-Type": "multipart/form-data" },
          }
        : undefined,
    );
    return {
      item: ItemMapper.toDomain(item),
      message,
    };
  }

  async update(
    id: number,
    itemData: UpdateItemDTO,
  ): Promise<{ item: ItemEntity; message: string }> {
    const { data } = await axiosInstance.put<{
      item: ItemDTO;
      message: string;
    }>(`${this.baseUrl}/${id}`, itemData);
    return {
      item: ItemMapper.toDomain(data.item),
      message: data.message,
    };
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}
