export class OrderItemCreateModel {
    itemAmount: number;
    snackId?: string;
    ingredientId?: string;

    constructor(_itemAmount: number, _snackId: string, _ingredientId: string) {
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
    }
}
