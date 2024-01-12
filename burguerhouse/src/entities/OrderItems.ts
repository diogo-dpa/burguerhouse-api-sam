import { BaseEntity } from './BaseEntity';

export class OrderItemsEntity extends BaseEntity {
    public orderId: string;
    public itemAmount: number;
    public snackId: Date;

    constructor(_id: number, _orderId: string, _itemAmount: number, _snackId: Date) {
        super(_id);
        this.orderId = _orderId;
        this.itemAmount = _itemAmount;
        this.snackId = _snackId;
    }
}
