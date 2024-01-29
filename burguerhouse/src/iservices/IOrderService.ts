import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { RelationSnackIngredient } from '../utils/commonTypes';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export interface IOrderService {
    createOrder: (newOrder: OrderCreateModel, relation: RelationSnackIngredient) => Promise<OrderResponseModel>;
    getAllOrders: (queryOptions?: JsonAPIQueryOptions) => Promise<OrderResponseModel[]>;
    getOrderById: (orderId: string, queryOptions?: JsonAPIQueryOptions) => Promise<OrderResponseModel>;
}
