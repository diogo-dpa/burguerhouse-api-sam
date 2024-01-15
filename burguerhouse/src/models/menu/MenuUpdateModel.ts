import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackModel } from '../snack/SnackModel';

export class MenuUpdateModel {
    description: string;
    menuItems: MenuItems[];

    constructor(_description: string, _menuItems: MenuItems[]) {
        this.description = _description;
        this.menuItems = _menuItems;
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
