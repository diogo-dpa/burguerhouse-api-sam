import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

export class OrderItemResponseModel {
    id: string;
    itemAmount: number;
    snackId?: string;
    snack: SnackResponseModel | null;
    ingredientId?: string;
    ingredient: IngredientResponseModel | null;

    constructor(
        _id: string,
        _itemAmount: number,
        _snackId: string,
        snack: SnackResponseModel | null,
        _ingredientId: string,
        ingredient: IngredientResponseModel | null,
    ) {
        this.id = _id;
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
        this.snack = snack;
        this.ingredientId = _ingredientId;
        this.ingredient = ingredient;
    }
}
