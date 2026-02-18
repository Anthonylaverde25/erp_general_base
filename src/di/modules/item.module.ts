import { Container } from "inversify";
import { TYPES } from "../types";
import { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import { ItemRepositoryCrud } from "@/infrastructure/repositories/items/ItemRepositoryCrud";
import { IndexItemsUseCase } from "@/application/use_cases/items/IndexItemsUseCase";
import { CreateItemUseCase } from "@/application/use_cases/items/CreateItemUseCase";
import { UpdateItemUseCase } from "@/application/use_cases/items/UpdateItemUseCase";
import { ShowItemUseCase } from "@/application/use_cases/items/ShowItemUseCase";

export function registerItemModule(container: Container) {
    // Repository
    container
        .bind<IItemRepository>(TYPES.ItemRepository)
        .to(ItemRepositoryCrud)
        .inSingletonScope();

    // Use Cases
    container.bind<IndexItemsUseCase>(TYPES.IndexItemsUseCase).to(IndexItemsUseCase);
    container.bind<CreateItemUseCase>(TYPES.CreateItemUseCase).to(CreateItemUseCase);
    container.bind<UpdateItemUseCase>(TYPES.UpdateItemUseCase).to(UpdateItemUseCase);
    container.bind<ShowItemUseCase>(TYPES.ShowItemUseCase).to(ShowItemUseCase);
}
