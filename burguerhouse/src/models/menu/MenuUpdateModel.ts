import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

export class MenuUpdateModel {
    description: string;
    menuItems: MenuItems[];

    constructor(_description: string, _menuItems: MenuItems[]) {
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
