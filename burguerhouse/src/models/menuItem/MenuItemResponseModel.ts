import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

export class MenuItemResponseModel {
    id: string;
    menuId: string;
    snack: SnackResponseModel | null;
    ingredient?: IngredientResponseModel | null;

    constructor(
        _id: string,
        _menuId: string,
        _snack: SnackResponseModel | null,
        _ingredient: IngredientResponseModel | null,
    ) {
        this.id = _id;
        this.menuId = _menuId;
        this.snack = _snack;
        this.ingredient = _ingredient;
    }
}
