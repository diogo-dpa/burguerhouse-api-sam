import { prisma } from '../../lib/prisma';
import { IPrismaOrderRepository } from '../../irepositories/prisma/IPrismaOrderRepository';
import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';

export class PrismaOrderRepository implements IPrismaOrderRepository {
    async getAll(): Promise<OrderPrismaModel[]> {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: true,
            },
        });

        return orders.map((order) => ({ ...order, totalPrice: Number(order.totalPrice) }));
    }

    async getById(id: string): Promise<OrderPrismaModel | null> {
        const orderFound = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                orderItems: true,
            },
        });

        if (orderFound === null) return null;

        return { ...orderFound, totalPrice: Number(orderFound.totalPrice) };
    }

    async create(newData: OrderCreateModel): Promise<OrderPrismaModel> {
        const createdOrder = await prisma.order.create({
            data: {
                orderDate: new Date(),
                totalPrice: newData.totalPrice,
                orderItems: {
                    create: newData.orderItems.map((orderItem) => ({
                        itemAmount: orderItem.itemAmount,
                        ingredient: {
                            connect: {
                                id: orderItem.ingredientId,
                            },
                        },
                        snack: {
                            connect: {
                                id: orderItem.snackId,
                            },
                        },
                    })),
                },
                user: {
                    connect: {
                        id: newData.userId,
                    },
                },
            },
            include: {
                orderItems: true,
            },
        });

        return { ...createdOrder, totalPrice: Number(createdOrder.totalPrice) };
    }
}
