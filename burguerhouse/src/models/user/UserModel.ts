import { OrderModel } from '../order/OrderModel';

export class UserModel {
    id: string;
    name: string;
    email: string;
    isEmployee: boolean;
    createdAt: Date;
    orders?: OrderModel[];

    constructor(
        _id: string,
        _name: string,
        _email: string,
        _isEmployee: boolean,
        _createdAt: Date,
        _orders: OrderModel[],
    ) {
        this.id = _id;
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
        this.createdAt = _createdAt;
        this.orders = _orders;
    }
}
