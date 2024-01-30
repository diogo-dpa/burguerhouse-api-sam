import { prisma } from '../../lib/prisma';
import { IPrismaOrderRepository } from '../../irepositories/prisma/IPrismaOrderRepository';
import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export class PrismaOrderRepository implements IPrismaOrderRepository {
    public defaultInclude = { orderItems: true };

    async getAll(queryOptions?: JsonAPIQueryOptions): Promise<OrderPrismaModel[]> {
        const { sort, include } = queryOptions ?? {};

        const orders = await prisma.order.findMany({
            orderBy: [...(sort ?? [])],
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        return this.formatOrdersResponse(
            orders.map((order) => ({ ...order, totalPrice: Number(order.totalPrice) })) as OrderPrismaModel[],
        );
    }

    async getById(id: string, queryOptions?: JsonAPIQueryOptions): Promise<OrderPrismaModel | null> {
        const { include } = queryOptions ?? {};

        const orderFound = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        if (orderFound === null) return null;

        return this.formatOrderResponse({
            ...orderFound,
            totalPrice: Number(orderFound.totalPrice),
        } as OrderPrismaModel);
    }

    async create(newData: OrderCreateModel): Promise<OrderPrismaModel> {
        const createdOrder = await prisma.order.create({
            data: {
                orderDate: new Date(),
                totalPrice: newData.totalPrice,
                orderItems: {
                    create: newData.orderItems.map((orderItem) =>
                        !!orderItem.ingredientId
                            ? {
                                  itemAmount: orderItem.itemAmount,
                                  ingredient: {
                                      connect: {
                                          id: orderItem.ingredientId,
                                      },
                                  },
                              }
                            : {
                                  itemAmount: orderItem.itemAmount,
                                  snack: {
                                      connect: {
                                          id: orderItem.snackId,
                                      },
                                  },
                              },
                    ),
                },
                user: {
                    connect: {
                        id: newData.userId,
                    },
                },
            },
            include: {
                ...this.defaultInclude,
            },
        });

        return this.formatOrderResponse({
            ...createdOrder,
            totalPrice: Number(createdOrder.totalPrice),
        } as OrderPrismaModel);
    }

    // Private methods
    private formatOrderResponse(order: OrderPrismaModel): OrderPrismaModel {
        return {
            ...order,
            totalPrice: Number(order.totalPrice),
            orderItems: order.orderItems.map((orderItem) => ({
                ...orderItem,
                ingredient: orderItem.ingredient
                    ? { ...orderItem.ingredient, unitMoneyAmount: Number(orderItem.ingredient.unitMoneyAmount) }
                    : null,
                snack: orderItem.snack
                    ? { ...orderItem.snack, unitMoneyAmount: Number(orderItem.snack.unitMoneyAmount) }
                    : null,
            })),
        };
    }

    private formatOrdersResponse(orders: OrderPrismaModel[]): OrderPrismaModel[] {
        return orders.map((order) => ({
            ...order,
            totalPrice: Number(order.totalPrice),
            orderItems:
                order.orderItems?.map((orderItem) => ({
                    ...orderItem,
                    ingredient: orderItem.ingredient
                        ? { ...orderItem.ingredient, unitMoneyAmount: Number(orderItem.ingredient.unitMoneyAmount) }
                        : null,
                    snack: orderItem.snack
                        ? { ...orderItem.snack, unitMoneyAmount: Number(orderItem.snack.unitMoneyAmount) }
                        : null,
                })) ?? [],
        }));
    }
}
