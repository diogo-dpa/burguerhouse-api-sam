import { IMenuController } from '../icontrollers/IMenuController';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuService } from '../services/MenuService';
import { ErrorHandler } from '../utils/ErrorHandler';

export class MenuController implements IMenuController {
    private menuService: MenuService;

    constructor(_menuService: MenuService) {
        this.menuService = _menuService;
    }

    async getAll(): Promise<MenuResponseModel[]> {
        try {
            const menus = await this.menuService.getAllMenus();
            return menus;
        } catch (error: any) {
            return error.message;
        }
    }

    async getById(id: string): Promise<MenuResponseModel | null> {
        try {
            ErrorHandler.validateStringParameter(id);
            const menu = await this.menuService.getMenuById(id);
            return menu;
        } catch (error: any) {
            return error.message;
        }
    }

    async update(id: string, body: string): Promise<MenuResponseModel> {
        try {
            const { description, menuItems, ...rest } = JSON.parse(body);

            ErrorHandler.validateStringParameter(id);
            ErrorHandler.validateUnsedParameters(rest);

            if (
                !ErrorHandler.validateStringParameterReturningBool(description) &&
                (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0)
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const menu = await this.menuService.updateMenu(id, {
                description,
                menuItems,
            });
            return menu;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: string): Promise<MenuResponseModel> {
        try {
            const { name, description, menuItems, ...rest } = JSON.parse(body);

            ErrorHandler.validateUnsedParameters(rest);

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateStringParameterReturningBool(description) ||
                !menuItems ||
                !Array.isArray(menuItems) ||
                menuItems.length === 0
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const menu = await this.menuService.createMenu({
                name,
                description,
                menuItems,
            });
            return menu;
        } catch (error: any) {
            return error.message;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            ErrorHandler.validateStringParameter(id);
            await this.menuService.deleteMenuById(id);
        } catch (error: any) {
            return error.message;
        }
    }
}
