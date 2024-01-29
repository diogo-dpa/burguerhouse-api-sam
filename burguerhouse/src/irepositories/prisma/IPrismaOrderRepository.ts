import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export interface IPrismaOrderRepository {
    getAll: (queryOptions?: JsonAPIQueryOptions) => Promise<OrderPrismaModel[]>;
    getById: (id: string, queryOptions?: JsonAPIQueryOptions) => Promise<OrderPrismaModel | null>;
    create: (newData: OrderCreateModel) => Promise<OrderPrismaModel>;
}
