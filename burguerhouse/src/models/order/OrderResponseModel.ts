import { OrderItemResponseModel } from '../orderItem/OrderItemResponseModel';

export class OrderResponseModel {
    id: string;
    totalPrice: number;
    orderDate: Date;
    orderItems: OrderItemResponseModel[];

    constructor(_id: string, _totalPrice: number, _orderDate: Date, _orderItems: OrderItemResponseModel[]) {
        this.id = _id;
        this.totalPrice = _totalPrice;
        this.orderDate = _orderDate;
        this.orderItems = _orderItems;
    }
}
