import { MenuItemCreateUpdateModel } from '../menuItem/MenuItemCreateUpdateModel';

export class MenuCreateModel {
    name: string;
    description: string;
    menuItems: MenuItemCreateUpdateModel[];

    constructor(_name: string, _description: string, _menuItems: MenuItemCreateUpdateModel[]) {
        this.name = _name;
        this.description = _description;
        this.menuItems = _menuItems;
    }
}
