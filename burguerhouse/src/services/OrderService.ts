import { OrderDto } from '../dtos/OrderDto';
import { IOrderService } from '../iservices/IOrderService';
import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';

export class OrderService implements IOrderService {
    private orderRepository: PrismaOrderRepository;
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;

    constructor(
        _orderRepository: PrismaOrderRepository,
        _snackRepository: PrismaSnacksRepository,
        _ingredientRepository: PrismaIngredientRepository,
    ) {
        this.orderRepository = _orderRepository;
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
    }

    async createOrder(newOrder: OrderCreateModel): Promise<OrderResponseModel> {
        const { orderItems } = newOrder;

        const ingredientIdFromOrderItems = orderItems.map((orderItem) => orderItem.ingredientId);
        const snackIdFromOrderItems = orderItems.map((orderItem) => orderItem.snackId);

        const ingredientPromise = ingredientIdFromOrderItems
            .filter((ingredientId) => !!ingredientId)
            .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

        const snackPromise = snackIdFromOrderItems
            .filter((snackId) => !!snackId)
            .map((snackId) => this.snackRepository.getById(snackId ?? ''));

        const [ingredients, snacks] = await Promise.all([ingredientPromise, snackPromise]);

        if (ingredients.some((ingredient) => ingredient === null))
            throw new Error(ErrorHandler.ingredientNotFoundMessage);

        if (snacks.some((snack) => snack === null)) throw new Error(ErrorHandler.snackNotFoundMessage);

        const order = await this.orderRepository.create(newOrder);
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
}
