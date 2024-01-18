import { MenuPrismaModel } from '../models/menu/MenuPrismaModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';

export class MenuDto {
    static convertPrismaModelToMenuModel(menu: MenuPrismaModel | null): MenuResponseModel {
        if (menu === null) return {} as MenuResponseModel;

        return {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            menuItems: menu.menuItems.map((menuItem) => ({
                id: menuItem.id,
                menuId: menuItem.menuId,
                ingredientId: menuItem.ingredientId,
                snackId: menuItem.snackId,
            })),
        };
    }

    static convertPrismaModelArrayToMenuModelArray(menus: MenuPrismaModel[] | null): MenuResponseModel[] {
        if (menus === null) return [] as MenuResponseModel[];

        return menus.map((menu) => ({
            id: menu.id,
            name: menu.name,
            description: menu.description,
            menuItems: menu.menuItems.map((menuItem) => ({
                id: menuItem.id,
                menuId: menuItem.menuId,
                ingredientId: menuItem.ingredientId,
                snackId: menuItem.snackId,
            })),
        }));
    }
}