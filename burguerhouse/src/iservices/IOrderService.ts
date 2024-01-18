import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';

export interface IOrderService {
    createOrder: (newOrder: OrderCreateModel) => Promise<OrderResponseModel>;
    getAllOrders: () => Promise<OrderResponseModel[]>;
    getOrderById: (orderId: string) => Promise<OrderResponseModel>;
}
