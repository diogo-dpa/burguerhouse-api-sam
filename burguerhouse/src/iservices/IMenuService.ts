import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';

export interface IMenuService {
    createMenu: (newMenu: MenuCreateModel) => Promise<MenuResponseModel>;
    updateMenu: (menuId: string, updateMenu: MenuUpdateModel) => Promise<MenuResponseModel>;
    getAllMenus: () => Promise<MenuResponseModel[]>;
    getMenuById: (menuId: string) => Promise<MenuResponseModel>;
    deleteMenuById: (menuId: string) => Promise<void>;
}
