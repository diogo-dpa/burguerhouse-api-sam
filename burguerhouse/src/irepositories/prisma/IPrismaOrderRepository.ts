import { Prisma, Order } from '@prisma/client';

export interface IPrismaOrderRepository {
    getAll: () => Promise<Order[]>;
    getById: (id: string) => Promise<Order | null>;
    create: (newData: Prisma.OrderCreateInput) => Promise<Order>;
}
