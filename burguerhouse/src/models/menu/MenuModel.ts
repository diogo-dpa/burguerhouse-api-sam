import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackModel } from '../snack/SnackModel';

export class MenuModel {
    id: string;
    name: string;
    description: string;
    menuItems: MenuItems[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _name: string,
        _description: string,
        _menuItems: MenuItems[],
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

class MenuItems {
    snacks?: SnackModel[];
    ingredients?: IngredientModel[];

    constructor(_snacks: SnackModel[], _ingredients: IngredientModel[]) {
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
