export class OrderItemPrismaModel {
    id: string;
    orderId: string;
    itemAmount: number;
    snackId?: string;
    ingredientId?: string;

    constructor(_id: string, _orderId: string, _itemAmount: number, _snackId: string, _ingredientId: string) {
        this.id = _id;
        this.orderId = _orderId;
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
    }
}
