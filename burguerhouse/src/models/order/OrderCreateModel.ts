import { OrderItemCreateModel } from '../orderItem/OrderItemCreateModel';

export class OrderCreateModel {
    userId: string;
    totalPrice: number;
    orderItems: OrderItemCreateModel[];

    constructor(_userId: string, _totalPrice: number, _orderItems: OrderItemCreateModel[]) {
        this.userId = _userId;
        this.totalPrice = _totalPrice;
        this.orderItems = _orderItems;
    }
}
