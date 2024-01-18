import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';

export const lambdaOrderHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const orderRepository = new PrismaOrderRepository();
        const ingredientRepository = new PrismaIngredientRepository();
        const snackRepository = new PrismaSnacksRepository();
        const orderService = new OrderService(orderRepository, snackRepository, ingredientRepository);
        const orderController = new OrderController(orderService);

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case HTTPMethodEnum.POST.toString():
                const resultPost = await orderController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case HTTPMethodEnum.GET.toString():
                if (idParameter) {
                    const resultGet = await orderController.getById(idParameter);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                } else {
                    const resultGet = await orderController.getAll();
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                }

            default:
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Something went wrong',
                    }),
                };
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};
