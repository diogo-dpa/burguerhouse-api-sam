import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';
import { RelationSnackIngredient } from '../utils/commonTypes';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export interface IMenuService {
    createMenu: (newMenu: MenuCreateModel, relation: RelationSnackIngredient) => Promise<MenuResponseModel>;
    updateMenu: (
        menuId: string,
        updateMenu: MenuUpdateModel,
        relation: RelationSnackIngredient,
    ) => Promise<MenuResponseModel>;
    getAllMenus: (queryOptions?: JsonAPIQueryOptions) => Promise<MenuResponseModel[]>;
    getMenuById: (menuId: string, queryOptions?: JsonAPIQueryOptions) => Promise<MenuResponseModel>;
    deleteMenuById: (menuId: string) => Promise<void>;
}
