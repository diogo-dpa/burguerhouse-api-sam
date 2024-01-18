import { OrderPrismaModel } from '../order/OrderPrismaModel';

export class UserPrismaModel {
    id: string;
    name: string;
    email: string;
    isEmployee: boolean;
    orders?: OrderPrismaModel[];

    constructor(
        _id: string,
        _name: string,
        _email: string,
        _isEmployee: boolean,
        _createdAt: Date,
        _orders: OrderPrismaModel[],
    ) {
        this.id = _id;
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
        this.orders = _orders;
    }
}
