import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

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
    snacks?: SnackResponseModel[];
    ingredients?: IngredientResponseModel[];

    constructor(_snacks: SnackResponseModel[], _ingredients: IngredientResponseModel[]) {
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
