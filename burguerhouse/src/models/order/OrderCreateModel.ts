import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackModel } from '../snack/SnackModel';

export class OrderCreateModel {
    userId: string;
    totalPrice: number;
    orderItems: OrderItems[];

    constructor(_userId: string, _totalPrice: number, _orderItems: OrderItems[]) {
        this.userId = _userId;
        this.totalPrice = _totalPrice;
        this.orderItems = _orderItems;
    }
}

class OrderItems {
    itemAmount: number;
    snacks?: SnackModel[];
    ingredients?: IngredientModel[];

    constructor(_itemAmount: number, _snacks: SnackModel[], _ingredients: IngredientModel[]) {
        this.itemAmount = _itemAmount;
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
