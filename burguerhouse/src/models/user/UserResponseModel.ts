import { OrderModel } from '../order/OrderModel';

export class UserResponseModel {
    id: string;
    name: string;
    email: string;
    isEmployee: boolean;
    orders?: OrderModel[];

    constructor(_id: string, _name: string, _email: string, _isEmployee: boolean, _orders: OrderModel[]) {
        this.id = _id;
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
        this.orders = _orders;
    }
}
