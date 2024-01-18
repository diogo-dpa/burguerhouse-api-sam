import { OrderItemPrismaModel } from '../orderItem/OrderItemPrismaModel';

export class OrderPrismaModel {
    id: string;
    userId: string;
    totalPrice: number;
    orderDate: Date;
    orderItems: OrderItemPrismaModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _userId: string,
        _totalPrice: number,
        _orderDate: Date,
        _orderItems: OrderItemPrismaModel[],
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.userId = _userId;
        this.totalPrice = _totalPrice;
        this.orderDate = _orderDate;
        this.orderItems = _orderItems;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
