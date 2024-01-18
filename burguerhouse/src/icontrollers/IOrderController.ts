import { OrderResponseModel } from '../models/order/OrderResponseModel';

export interface IOrderController {
    getAll: () => Promise<OrderResponseModel[]>;
    getById: (id: string) => Promise<OrderResponseModel | null>;
    create: (body: string) => Promise<OrderResponseModel>;
}
