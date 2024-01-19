import { IngredientPrismaModel } from '../ingredient/IngredienPrismaModel';
import { SnackPrismaModel } from '../snack/SnackPrismaModel';

export class OrderItemPrismaModel {
    id: string;
    orderId: string;
    itemAmount: number;
    snackId?: string;
    snack: SnackPrismaModel | null;
    ingredientId?: string;
    ingredient: IngredientPrismaModel | null;

    constructor(
        _id: string,
        _orderId: string,
        _itemAmount: number,
        _snackId: string,
        snack: SnackPrismaModel | null,
        _ingredientId: string,
        ingredient: IngredientPrismaModel | null,
    ) {
        this.id = _id;
        this.orderId = _orderId;
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
        this.snack = snack;
        this.ingredientId = _ingredientId;
        this.ingredient = ingredient;
    }
}
