import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuModel } from '../models/menu/MenuModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';

export interface IMenuService {
    createMenu: (newMenu: MenuCreateModel) => Promise<MenuModel>;
    updateMenu: (newMenu: MenuUpdateModel) => Promise<MenuModel>;
    getAllMenus: () => Promise<MenuModel[]>;
    getMenuById: (menuId: string) => Promise<MenuModel>;
    deleteMenuById: (menuId: string) => Promise<void>;
}
