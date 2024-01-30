import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { formatQueryParameters } from './utilsHandler';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { defineErrorResponse } from '../controllers/utilsController';

export class OrderHandler {
    private orderController: OrderController;

    constructor(_orderController: OrderController) {
        this.orderController = _orderController;
    }

    public lambdaOrderHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const idParameter = event.pathParameters?.id ?? '';
            const relationParameter = event.pathParameters?.relation ?? '';
            const headerString = JSON.stringify(event.headers);
            const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
            const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

            switch (event.httpMethod) {
                case HTTPMethodEnum.POST:
                    const resultPost = await this.orderController.create({
                        header: headerString,
                        params: {
                            queryParameter,
                        },
                        body: event.body ?? '',
                    });
                    return resultPost as APIGatewayProxyResult;
                case HTTPMethodEnum.GET:
                    if (relationParameter) {
                        const resultGet = await this.orderController.getRelationshipById({
                            header: headerString,
                            params: {
                                pathParameter: { id: idParameter, relation: relationParameter },
                                queryParameter: {
                                    ...queryParameter,
                                },
                            },
                        });
                        return resultGet as APIGatewayProxyResult;
                    } else if (idParameter) {
                        const resultGet = await this.orderController.getById({
                            header: headerString,
                            params: {
                                pathParameter: { id: idParameter },
                                queryParameter: {
                                    ...queryParameter,
                                },
                            },
                        });
                        return resultGet as APIGatewayProxyResult;
                    } else {
                        const resultGet = await this.orderController.getAll({
                            header: headerString,
                            params: { queryParameter },
                        });
                        return resultGet as APIGatewayProxyResult;
                    }

                default:
                    const response = new JSONAPIHandler().mountErrorResponseNotFound();
                    return response as APIGatewayProxyResult;
            }
        } catch (error: any) {
            return defineErrorResponse(error.message) as APIGatewayProxyResult;
        }
    };
}

const orderRepository = new PrismaOrderRepository();
const ingredientRepository = new PrismaIngredientRepository();
const snackRepository = new PrismaSnacksRepository();
const userRepository = new PrismaUserRepository();
const orderService = new OrderService(orderRepository, snackRepository, ingredientRepository, userRepository);
const orderController = new OrderController(orderService);

export const lambdaOrderHandler = new OrderHandler(orderController).lambdaOrderHandler;
