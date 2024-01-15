import { IngredientModel } from '../ingredient/IngredientModel';
import { SnackModel } from '../snack/SnackModel';

export class OrderModel {
    id: string;
    userId: string;
    totalPrice: number;
    orderItems: OrderItems[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _userId: string,
        _totalPrice: number,
        _orderItems: OrderItems[],
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.userId = _userId;
        this.totalPrice = _totalPrice;
        this.orderItems = _orderItems;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
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
