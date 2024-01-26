import { MenuPrismaModel } from '../../models/menu/MenuPrismaModel';
import { MenuUpdateModel } from '../../models/menu/MenuUpdateModel';
import { MenuCreateModel } from '../../models/menu/MenuCreateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export interface IPrismaMenusRepository {
    getAll: (queryOptions?: JsonAPIQueryOptions) => Promise<MenuPrismaModel[]>;
    getById: (id: string, queryOptions?: JsonAPIQueryOptions) => Promise<MenuPrismaModel | null>;
    getByName: (name: string) => Promise<MenuPrismaModel | null>;
    update: (id: string, updateData: MenuUpdateModel) => Promise<MenuPrismaModel>;
    create: (newData: MenuCreateModel) => Promise<MenuPrismaModel>;
    delete: (id: string) => Promise<void>;
}
