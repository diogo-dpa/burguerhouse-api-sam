import { OrderItemPrismaModel } from '../orderItem/OrderItemPrismaModel';
import { UserPrismaModel } from '../user/UserPrismaModel';

export class OrderPrismaModel {
    id: string;
    userId: string;
    user: UserPrismaModel | null;
    totalPrice: number;
    orderDate: Date;
    orderItems: OrderItemPrismaModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _userId: string,
        _user: UserPrismaModel | null,
        _totalPrice: number,
        _orderDate: Date,
        _orderItems: OrderItemPrismaModel[],
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.userId = _userId;
        this.user = _user;
        this.totalPrice = _totalPrice;
        this.orderDate = _orderDate;
        this.orderItems = _orderItems;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
