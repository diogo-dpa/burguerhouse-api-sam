import { MenuItemResponseModel } from '../menuItem/MenuItemResponseModel';

export class MenuResponseModel {
    id: string;
    name: string;
    description: string;
    menuItems: MenuItemResponseModel[];

    constructor(_id: string, _name: string, _description: string, _menuItems: MenuItemResponseModel[]) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.menuItems = _menuItems;
    }
}
