import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

export class MenuCreateModel {
    name: string;
    description: string;
    menuItems: MenuItems[];

    constructor(_name: string, _description: string, _menuItems: MenuItems[]) {
        this.name = _name;
        this.description = _description;
        this.menuItems = _menuItems;
    }
}

class MenuItems {
    snacks?: SnackResponseModel[];
    ingredients?: IngredientModel[];

    constructor(_snacks: SnackResponseModel[], _ingredients: IngredientModel[]) {
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
