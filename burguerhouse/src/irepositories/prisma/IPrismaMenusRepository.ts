import { MenuPrismaModel } from '../../models/menu/MenuPrismaModel';
import { MenuUpdateModel } from '../../models/menu/MenuUpdateModel';
import { MenuCreateModel } from '../../models/menu/MenuCreateModel';

export interface IPrismaMenusRepository {
    getAll: () => Promise<MenuPrismaModel[]>;
    getById: (id: string) => Promise<MenuPrismaModel | null>;
    update: (id: string, updateData: MenuUpdateModel) => Promise<MenuPrismaModel>;
    create: (newData: MenuCreateModel) => Promise<MenuPrismaModel>;
    delete: (id: string) => Promise<void>;
}
