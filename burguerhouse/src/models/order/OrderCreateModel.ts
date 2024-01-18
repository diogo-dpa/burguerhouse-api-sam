import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackResponseModel } from '../snack/SnackResponseModel';

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
    snacks?: SnackResponseModel[];
    ingredients?: IngredientModel[];

    constructor(_itemAmount: number, _snacks: SnackResponseModel[], _ingredients: IngredientModel[]) {
        this.itemAmount = _itemAmount;
        this.snacks = _snacks;
        this.ingredients = _ingredients;
    }
}
