export class OrderItemResponseModel {
    itemAmount: number;
    snackId?: string;
    ingredients?: string;

    constructor(_itemAmount: number, _snackId: string, _ingredientId: string) {
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
        this.ingredients = _ingredientId;
    }
}
