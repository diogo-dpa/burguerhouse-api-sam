import { OrderResponseModel } from '../order/OrderResponseModel';

export class UserResponseModel {
    id: string;
    name: string;
    email: string;
    isEmployee: boolean;
    orders?: OrderResponseModel[];

    constructor(_id: string, _name: string, _email: string, _isEmployee: boolean, _orders: OrderResponseModel[]) {
        this.id = _id;
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
        this.orders = _orders;
    }
}
