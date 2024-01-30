import { describe, expect, it } from '@jest/globals';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { PrismaSnacksRepository } from '../../repositories/prisma/PrismaSnacksRepository';
import { PrismaOrderRepository } from '../../repositories/prisma/PrismaOrderRepository';
import { OrderService } from '../../services/OrderService';
import { OrderController } from '../../controllers/OrderController';
import { OrderHandler } from '../OrderHandler';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
    mockErrorResponseInternalServerError,
    mockErrorResponseNotFound,
} from '../../controllers/__tests__/__mocks__/commonController.mock';
import { ControllerOptions } from '../../controllers/typesController';
import {
    mockResponseCreateOrderHandler,
    mockResponseGetAllOrderController,
    mockResponseGetByIdOrderHandler,
    mockResponseGetRelationOrderHandler,
    orderCreateEventHandler,
    orderGetAllEventHandler,
    orderGetByIdEventHandler,
    orderGetRelationByIdEventHandler,
} from './__mocks__/OrderHandler.mock';

describe('OrderHandler', () => {
    const userRepository: jest.Mocked<PrismaUserRepository> =
        new PrismaUserRepository() as jest.Mocked<PrismaUserRepository>;
    const ingredientRepository: jest.Mocked<PrismaIngredientRepository> =
        new PrismaIngredientRepository() as jest.Mocked<PrismaIngredientRepository>;
    const snackRepository: jest.Mocked<PrismaSnacksRepository> =
        new PrismaSnacksRepository() as jest.Mocked<PrismaSnacksRepository>;
    const orderRepository: jest.Mocked<PrismaOrderRepository> =
        new PrismaOrderRepository() as jest.Mocked<PrismaOrderRepository>;
    const orderService: jest.Mocked<OrderService> = new OrderService(
        orderRepository,
        snackRepository,
        ingredientRepository,
        userRepository,
    ) as jest.Mocked<OrderService>;
    const orderController: jest.Mocked<OrderController> = new OrderController(
        orderService,
    ) as jest.Mocked<OrderController>;
    orderController.create = jest.fn();
    orderController.getAll = jest.fn();
    orderController.getById = jest.fn();
    orderController.getRelationshipById = jest.fn();

    let spyOrderControllerCreate: jest.SpiedFunction<typeof orderController.create>;
    let spyOrderControllerGetAll: jest.SpiedFunction<typeof orderController.getAll>;
    let spyOrderControllerGetById: jest.SpiedFunction<typeof orderController.getById>;
    let spyOrderControllerGetRelationById: jest.SpiedFunction<typeof orderController.getRelationshipById>;
    let orderHandler: OrderHandler;

    beforeAll(() => {
        orderHandler = new OrderHandler(orderController);
    });

    beforeEach(() => {
        orderController.create.mockReset();
        orderController.getAll.mockReset();
        orderController.getRelationshipById.mockReset();
    });

    describe('Error cases', () => {
        it('should return the status code 500 when some unexpected error happens', async () => {
            const request = {
                ...orderGetAllEventHandler,
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseInternalServerError('some.error');
            orderController.getAll = jest.fn().mockRejectedValue(new Error('code-some.error'));
            spyOrderControllerGetAll = jest.spyOn(orderController, 'getAll');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyOrderControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should return the status code 404 when sending a not known request', async () => {
            const request = {
                ...orderGetAllEventHandler,
                httpMethod: 'PUT',
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseNotFound();
            spyOrderControllerCreate = jest.spyOn(orderController, 'create');
            spyOrderControllerGetAll = jest.spyOn(orderController, 'getAll');
            spyOrderControllerGetById = jest.spyOn(orderController, 'getById');
            spyOrderControllerGetRelationById = jest.spyOn(orderController, 'getRelationshipById');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerCreate).toHaveBeenCalledTimes(0);
            expect(spyOrderControllerGetAll).toHaveBeenCalledTimes(0);
            expect(spyOrderControllerGetById).toHaveBeenCalledTimes(0);
            expect(spyOrderControllerGetRelationById).toHaveBeenCalledTimes(0);
            expect(response).toStrictEqual(expectedResponse);
        });
    });

    describe('Successful cases', () => {
        it('should call the POST method and return successfully', async () => {
            const request = {
                ...orderCreateEventHandler,
                body: JSON.stringify({
                    data: {
                        type: 'order',
                        attributes: {
                            userId: 'valid-id-user-1',
                            totalPrice: 99.5,
                            orderItems: [
                                {
                                    id: 'some-id-1',
                                    itemAmount: 3,
                                    snackId: 'valid-id-snack-1',
                                    snack: null,
                                    ingredient: null,
                                },
                                {
                                    id: 'some-id-2',
                                    itemAmount: 1,
                                    ingredientId: 'valid-id-ingredient-1',
                                    snack: null,
                                    ingredient: null,
                                },
                            ],
                        },
                    },
                }),
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 201,
                body: JSON.stringify(mockResponseCreateOrderHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
                body: request.body,
            };
            orderController.create = jest.fn().mockResolvedValue(expectedResponse);
            spyOrderControllerCreate = jest.spyOn(orderController, 'create');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerCreate).toHaveBeenCalledTimes(1);
            expect(spyOrderControllerCreate).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET RELATION BY ID method and return successfully', async () => {
            const request = {
                ...orderGetRelationByIdEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetRelationOrderHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: orderGetRelationByIdEventHandler.pathParameters?.id ?? '',
                        relation: 'user',
                    },
                },
            };
            orderController.getRelationshipById = jest.fn().mockResolvedValue(expectedResponse);
            spyOrderControllerGetRelationById = jest.spyOn(orderController, 'getRelationshipById');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerGetRelationById).toHaveBeenCalledTimes(1);
            expect(spyOrderControllerGetRelationById).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET BY ID method and return successfully', async () => {
            const request = {
                ...orderGetByIdEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetByIdOrderHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: orderGetByIdEventHandler.pathParameters?.id ?? '',
                    },
                },
            };
            orderController.getById = jest.fn().mockResolvedValue(expectedResponse);
            spyOrderControllerGetById = jest.spyOn(orderController, 'getById');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerGetById).toHaveBeenCalledTimes(1);
            expect(spyOrderControllerGetById).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET ALL method and return successfully', async () => {
            const request = {
                ...orderGetAllEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetAllOrderController),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };
            orderController.getAll = jest.fn().mockResolvedValue(expectedResponse);
            spyOrderControllerGetAll = jest.spyOn(orderController, 'getAll');

            const response = await orderHandler.lambdaOrderHandler(request);

            expect(spyOrderControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyOrderControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });
    });
});
