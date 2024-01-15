import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderModel } from '../models/order/OrderModel';

export interface IOrderService {
    createOrder: (newOrder: OrderCreateModel) => Promise<OrderModel>;
    getAllOrders: () => Promise<OrderModel[]>;
    getOrderById: (orderId: string) => Promise<OrderModel>;
}
