import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';

export interface IPrismaOrderRepository {
    getAll: () => Promise<OrderPrismaModel[]>;
    getById: (id: string) => Promise<OrderPrismaModel | null>;
    create: (newData: OrderCreateModel) => Promise<OrderPrismaModel>;
}
