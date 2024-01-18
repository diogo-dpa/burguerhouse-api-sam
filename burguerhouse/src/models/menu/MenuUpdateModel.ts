import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';
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
    ingredients?: IngredientResponseModel[];

    constructor(_snacks: SnackResponseModel[], _ingredients: IngredientResponseModel[]) {
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
