import { OrderPrismaModel } from '../models/order/OrderPrismaModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';

export class OrderDto {
    static convertPrismaModelToOrderModel(order: OrderPrismaModel | null): OrderResponseModel {
        if (order === null) return {} as OrderResponseModel;

        return {
            id: order.id,
            userId: order.userId,
            user: order.user,
            totalPrice: order.totalPrice,
            orderDate: order.orderDate,
            orderItems:
                order.orderItems?.map((orderItem) => ({
                    id: orderItem.id,
                    itemAmount: orderItem.itemAmount,
                    ingredientId: orderItem.ingredientId,
                    ingredient: orderItem.ingredient,
                    snackId: orderItem.snackId,
                    snack: orderItem.snack,
                })) ?? undefined,
        };
    }

    static convertPrismaModelArrayToMenuModelArray(orders: OrderPrismaModel[] | null): OrderResponseModel[] {
        if (orders === null) return [] as OrderResponseModel[];

        return orders.map((order) => ({
            id: order.id,
            userId: order.userId,
            user: order.user,
            totalPrice: order.totalPrice,
            orderDate: order.orderDate,
            orderItems:
                order.orderItems?.map((orderItem) => ({
                    id: orderItem.id,
                    itemAmount: orderItem.itemAmount,
                    ingredientId: orderItem.ingredientId,
                    ingredient: orderItem.ingredient,
                    snackId: orderItem.snackId,
                    snack: orderItem.snack,
                })) ?? undefined,
        }));
    }
}
