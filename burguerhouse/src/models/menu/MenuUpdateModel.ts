import { MenuItemCreateUpdateModel } from '../menuItem/MenuItemCreateUpdateModel';

export class MenuUpdateModel {
    description?: string;
    menuItems?: MenuItemCreateUpdateModel[];

    constructor(_description: string, _menuItems: MenuItemCreateUpdateModel[]) {
        this.description = _description;
        this.menuItems = _menuItems;
    }
}
