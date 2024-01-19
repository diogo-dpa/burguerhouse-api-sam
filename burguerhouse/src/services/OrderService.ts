import { Prisma } from '@prisma/client';
import { OrderDto } from '../dtos/OrderDto';
import { IOrderService } from '../iservices/IOrderService';
import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { OrderItemCreateModel } from '../models/orderItem/OrderItemCreateModel';
import { SnackPrismaModel } from '../models/snack/SnackPrismaModel';

export class OrderService implements IOrderService {
    private orderRepository: PrismaOrderRepository;
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;
    private userRepository: PrismaUserRepository;

    constructor(
        _orderRepository: PrismaOrderRepository,
        _snackRepository: PrismaSnacksRepository,
        _ingredientRepository: PrismaIngredientRepository,
        _userRepository: PrismaUserRepository,
    ) {
        this.orderRepository = _orderRepository;
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
        this.userRepository = _userRepository;
    }

    async createOrder(newOrder: OrderCreateModel): Promise<OrderResponseModel> {
        const { orderItems, userId } = newOrder;

        await this.validateIfUserExists(userId);
        const updatedAmountIngredients = await this.validateSnacksAndIngredientsFromOrderItems(orderItems);

        const order = await this.orderRepository.create(newOrder);

        await this.updateIngredientStock(updatedAmountIngredients);

        return OrderDto.convertPrismaModelToOrderModel(order);
    }

    async getAllOrders(): Promise<OrderResponseModel[]> {
        const orders = await this.orderRepository.getAll();
        return orders.map((order) => OrderDto.convertPrismaModelToOrderModel(order));
    }

    async getOrderById(orderId: string): Promise<OrderResponseModel> {
        const order = await this.orderRepository.getById(orderId);
        return OrderDto.convertPrismaModelToOrderModel(order);
    }

    // Private methods
    private async validateSnacksAndIngredientsFromOrderItems(orderItems: OrderCreateModel['orderItems']) {
        const ingredientIdFromOrderItems = orderItems.map((orderItem) => orderItem.ingredientId);
        const snackIdFromOrderItems = orderItems.map((orderItem) => orderItem.snackId);

        const ingredientPromise = ingredientIdFromOrderItems
            .filter((ingredientId) => !!ingredientId)
            .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

        const snackPromise = snackIdFromOrderItems
            .filter((snackId) => !!snackId)
            .map((snackId) => this.snackRepository.getById(snackId ?? ''));

        const ingredients = await Promise.all([...ingredientPromise]);
        const snacks = await Promise.all([...snackPromise]);

        if (ingredients?.some((ingredient) => ingredient === null))
            throw new Error(ErrorHandler.ingredientNotFoundMessage);

        if (snacks.some((snack) => snack === null)) throw new Error(ErrorHandler.snackNotFoundMessage);

        return await this.validateAndReturnUpdatedIngredientAmount(orderItems, snacks);
    }

    private async validateAndReturnUpdatedIngredientAmount(
        orderItems: OrderItemCreateModel[],
        snacks: Array<SnackPrismaModel | null>,
    ) {
        const ingredientOrdersAmount = orderItems
            .filter((orderItem) => !!orderItem.ingredientId)
            .reduce(
                (acm, cur) => ({
                    ...acm,
                    [cur.ingredientId ?? '']: (acm[cur.ingredientId ?? ''] ?? 0) + cur.itemAmount,
                }),
                {} as Record<string, number>,
            );

        const ingredientsAmount = orderItems
            .filter((orderItem) => !!orderItem.snackId)
            .reduce((acm, cur) => {
                const foundSnack = snacks.find((snack) => snack?.id === cur.snackId);
                const snackIngredientsAmount = foundSnack?.snackItems.reduce(
                    (innerAcm, innerCur) => ({
                        ...innerAcm,
                        [innerCur.ingredientId ?? '']:
                            (innerAcm[innerCur.ingredientId ?? ''] ?? 0) + innerCur.ingredientAmount * cur.itemAmount,
                    }),
                    ingredientOrdersAmount,
                );

                return {
                    ...acm,
                    ...snackIngredientsAmount,
                };
            }, {} as Record<string, number>);

        const allIngredients = await this.ingredientRepository.getAll();
        const usedIngredients = allIngredients.filter((ingredient) => !!ingredientsAmount[ingredient?.id ?? '']);

        if (
            usedIngredients.some(
                (ingredient) => ingredient && ingredient?.availableAmount < ingredientsAmount[ingredient?.id ?? ''],
            )
        )
            throw new Error(ErrorHandler.insufficientIngredientAmountMessage);

        const resultIngredients = usedIngredients.map((ingredient) => ({
            ...ingredient,
            availableAmount: ingredient?.availableAmount - ingredientsAmount[ingredient?.id ?? ''],
        }));

        return resultIngredients;
    }

    private async validateIfUserExists(userId: string) {
        const user = await this.userRepository.getById(userId);

        if (!user) throw new Error(ErrorHandler.userNotFoundMessage);
    }

    private async updateIngredientStock(updatedAmountIngredients: Prisma.IngredientsUpdateInput[]) {
        const updatedIngredientPromise = updatedAmountIngredients.map((ingredient) =>
            this.ingredientRepository.update(ingredient?.id as string, { ...ingredient }),
        );

        await Promise.all([...updatedIngredientPromise]);
    }
}
