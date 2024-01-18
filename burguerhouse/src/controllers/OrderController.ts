import { IOrderController } from '../icontrollers/IOrderController';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { OrderService } from '../services/OrderService';
import { ErrorHandler } from '../utils/ErrorHandler';

export class OrderController implements IOrderController {
    private orderService: OrderService;

    constructor(_orderService: OrderService) {
        this.orderService = _orderService;
    }

    async getAll(): Promise<OrderResponseModel[]> {
        try {
            const orders = await this.orderService.getAllOrders();
            return orders;
        } catch (error: any) {
            return error.message;
        }
    }

    async getById(id: string): Promise<OrderResponseModel | null> {
        try {
            ErrorHandler.validateStringParameter(id);
            const order = await this.orderService.getOrderById(id);
            return order;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: string): Promise<OrderResponseModel> {
        try {
            const { userId, totalPrice, orderItems, ...rest } = JSON.parse(body);

            ErrorHandler.validateUnsedParameters(rest);

            if (
                !ErrorHandler.validateStringParameterReturningBool(userId) ||
                !ErrorHandler.validateNumberParameterReturningBool(totalPrice) ||
                !orderItems ||
                !Array.isArray(orderItems) ||
                orderItems.length === 0
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const order = await this.orderService.createOrder({
                userId,
                totalPrice,
                orderItems,
            });
            return order;
        } catch (error: any) {
            return error.message;
        }
    }
}
