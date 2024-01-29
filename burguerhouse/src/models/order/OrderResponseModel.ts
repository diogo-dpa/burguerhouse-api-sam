import { OrderItemResponseModel } from '../orderItem/OrderItemResponseModel';
import { UserResponseModel } from '../user/UserResponseModel';

export class OrderResponseModel {
    id: string;
    userId: string;
    user: UserResponseModel | null;
    totalPrice: number;
    orderDate: Date;
    orderItems: OrderItemResponseModel[];

    constructor(
        _id: string,
        _userId: string,
        _user: UserResponseModel | null,
        _totalPrice: number,
        _orderDate: Date,
        _orderItems: OrderItemResponseModel[],
    ) {
        this.id = _id;
        this.userId = _userId;
        this.user = _user;
        this.totalPrice = _totalPrice;
        this.orderDate = _orderDate;
        this.orderItems = _orderItems;
    }
}
