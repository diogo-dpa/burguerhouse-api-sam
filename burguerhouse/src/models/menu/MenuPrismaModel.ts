import { MenuItemPrismaModel } from '../menuItem/MenuItemPrismaModel';

export class MenuPrismaModel {
    id: string;
    name: string;
    description: string;
    menuItems: MenuItemPrismaModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _name: string,
        _description: string,
        _menuItems: MenuItemPrismaModel[],
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.menuItems = _menuItems;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
