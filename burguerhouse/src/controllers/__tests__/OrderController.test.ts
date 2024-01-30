import { describe, expect, it } from '@jest/globals';
import { PrismaOrderRepository } from '../../repositories/prisma/PrismaOrderRepository';
import { OrderService } from '../../services/OrderService';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { PrismaSnacksRepository } from '../../repositories/prisma/PrismaSnacksRepository';
import { OrderController } from '../OrderController';
import { ControllerOptions } from '../typesController';
import {
    mockErrorResponseBadRequest,
    mockErrorResponseConflict,
    mockErrorResponseForbidden,
    mockErrorResponseInternalServerError,
    mockErrorResponseUnsuporttedMediaType,
    mockHeaderRequest,
    mockPathParamsRequest,
    mockPathParamsWithIdRequest,
    mockQueryParamsRequest,
    mockWrongBodyDataAttributeAsNull,
    mockWrongBodyDataPrimaryAttributesRequest,
    mockWrongBodyDataTypeDifferent,
    mockWrongHeaderRequest,
} from './__mocks__/commonController.mock';
import { ControllerResponseJsonAPI, JsonAPIProjectTypesEnum } from '../../utils/jsonapi/typesJsonapi';
import {
    mockBodyRequestCreateOrderController,
    mockInputCreateOrderService,
    mockOutputCreateOrderService,
    mockOutputGetAllOrderService,
    mockOutputGetByIdOrderService,
    mockOutputGetRelatonshipByIdOrderIngredientService,
    mockOutputGetRelatonshipByIdOrderSnackService,
    mockOutputGetRelatonshipByIdOrderUserService,
    mockResponseCreateOrderController,
    mockResponseGetAllOrderController,
    mockResponseGetByIdOrderController,
    mockResponseGetRelationshipByIdOrderIngredientController,
    mockResponseGetRelationshipByIdOrderSnackController,
    mockResponseGetRelationshipByIdOrderUserController,
    mockWrongRelationshipPeopleBodyRequestCreateOrderController,
    mockWrongRelationshipSnackIngredientBodyRequestCreateOrderController,
} from './__mocks__/OrderController.mock';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';
import { OrderResponseModel } from '../../models/order/OrderResponseModel';

describe('OrderController', () => {
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
    orderService.createOrder = jest.fn();
    orderService.getAllOrders = jest.fn();
    orderService.getOrderById = jest.fn();

    let spyOrderServiceCreate: jest.SpiedFunction<typeof orderService.createOrder>;
    let spyOrderServiceGetAll: jest.SpiedFunction<typeof orderService.getAllOrders>;
    let spyOrderServiceGetById: jest.SpiedFunction<typeof orderService.getOrderById>;
    let orderController: OrderController;

    beforeAll(() => {
        orderController = new OrderController(orderService);
    });

    beforeEach(() => {
        orderService.createOrder.mockReset();
        orderService.getAllOrders.mockReset();
        orderService.getOrderById.mockReset();
    });

    describe('createOrder', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateOrderController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the wrong data primary attributes', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataPrimaryAttributesRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the data attribute as null', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataAttributeAsNull),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it("should return the status code 409 when passing the type different from 'order'", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict('Data: Invalid format.');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond data', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict('Data: Invalid format.');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing a missing people attribute inside relationship', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongRelationshipPeopleBodyRequestCreateOrderController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict(
                    'Relationships: Invalid format.',
                );

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing a missing snack and ingredient attributes inside relationship', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongRelationshipSnackIngredientBodyRequestCreateOrderController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict(
                    'Relationships: Invalid format.',
                );

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond people, snack and ingredient inside relationship', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            something: {},
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict(
                    'Relationships: Invalid format.',
                );

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['userId', 'userId', ''],
                ['totalPrice', 'totalPrice', ''],
                ['orderItems (null)', 'orderItems', null],
                ['orderItems (not an array)', 'orderItems', ''],
                ['orderItems (empty array)', 'orderItems', []],
            ])('should return the status code 403 when the parameter %s is invalid', async (_, key, value) => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        attributes: {
                            ...mockBodyRequestCreateOrderController.data.attributes,
                            [key]: value,
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI =
                    mockErrorResponseForbidden('Attributes: Invalid format.');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing any attribute beyond the order', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        attributes: {
                            ...mockBodyRequestCreateOrderController.data.attributes,
                            something: '',
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI =
                    mockErrorResponseForbidden('Attributes: Invalid format.');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(as null)', null],
                ['(not an array)', ''],
                ['(empty array)', []],
            ])(
                'should return the status code 403 when an invalid data %s attribute inside people',
                async (_, value) => {
                    mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                    const mockRequest = {
                        ...mockBodyRequestCreateOrderController,
                        data: {
                            ...mockBodyRequestCreateOrderController.data,
                            relationships: {
                                ...mockBodyRequestCreateOrderController.data.relationships,
                                people: {
                                    data: value,
                                },
                            },
                        },
                    };
                    const request: ControllerOptions = {
                        header: JSON.stringify(mockHeaderRequest),
                        body: JSON.stringify(mockRequest),
                        params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                    };
                    const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden(
                        'Relationships Object: Invalid format.',
                    );

                    spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                    const orderResponse = await orderController.create(request);

                    expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                    expect(orderResponse).toStrictEqual(expectedResponse);
                },
            );

            it('should return the status code 403 when there is some invalid type inside people', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            people: {
                                data: [
                                    {
                                        type: 'some-type',
                                        id: 'valid-id-user-1',
                                    },
                                ],
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden('Invalid user type');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(empty string)', ''],
                ['(different ids)', 'other-valid-id'],
            ])('should return the status code 403 when there is some invalid id %s inside people', async (_, value) => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            people: {
                                data: [
                                    {
                                        type: JsonAPIProjectTypesEnum.people,
                                        id: value,
                                    },
                                ],
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden('User Id don`t match');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(as null)', null],
                ['(not an array)', ''],
                ['(empty array)', []],
            ])(
                'should return the status code 403 when an invalid data %s attribute inside ingredient',
                async (_, value) => {
                    mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                    const mockRequest = {
                        ...mockBodyRequestCreateOrderController,
                        data: {
                            ...mockBodyRequestCreateOrderController.data,
                            relationships: {
                                ...mockBodyRequestCreateOrderController.data.relationships,
                                ingredient: {
                                    data: value,
                                },
                            },
                        },
                    };
                    const request: ControllerOptions = {
                        header: JSON.stringify(mockHeaderRequest),
                        body: JSON.stringify(mockRequest),
                        params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                    };
                    const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden(
                        'Relationships Object: Invalid format.',
                    );

                    spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                    const orderResponse = await orderController.create(request);

                    expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                    expect(orderResponse).toStrictEqual(expectedResponse);
                },
            );

            it('should return the status code 403 when there is some invalid type inside ingredient', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            ingredient: {
                                data: [
                                    {
                                        type: 'some-type',
                                        id: 'valid-id-ingredient-1',
                                    },
                                ],
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI =
                    mockErrorResponseForbidden('Invalid ingredient type');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(empty string)', ''],
                ['(different ids)', 'other-valid-id'],
            ])(
                'should return the status code 403 when there is some invalid id %s inside ingredient',
                async (_, value) => {
                    mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                    const mockRequest = {
                        ...mockBodyRequestCreateOrderController,
                        data: {
                            ...mockBodyRequestCreateOrderController.data,
                            relationships: {
                                ...mockBodyRequestCreateOrderController.data.relationships,
                                ingredient: {
                                    data: [
                                        {
                                            type: JsonAPIProjectTypesEnum.ingredient,
                                            id: value,
                                        },
                                    ],
                                },
                            },
                        },
                    };
                    const request: ControllerOptions = {
                        header: JSON.stringify(mockHeaderRequest),
                        body: JSON.stringify(mockRequest),
                        params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                    };
                    const expectedResponse: ControllerResponseJsonAPI =
                        mockErrorResponseForbidden('Ingredient Ids don`t match');

                    spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                    const orderResponse = await orderController.create(request);

                    expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                    expect(orderResponse).toStrictEqual(expectedResponse);
                },
            );

            it.each([
                ['(as null)', null],
                ['(not an array)', ''],
                ['(empty array)', []],
            ])('should return the status code 403 when an invalid data %s attribute inside snack', async (_, value) => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            snack: {
                                data: value,
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden(
                    'Relationships Object: Invalid format.',
                );

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when there is some invalid type inside snack', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            snack: {
                                data: [
                                    {
                                        type: 'some-type',
                                        id: 'valid-id-ingredient-1',
                                    },
                                ],
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden('Invalid snack type');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(empty string)', ''],
                ['(different ids)', 'other-valid-id'],
            ])('should return the status code 403 when there is some invalid id %s inside snack', async (_, value) => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.order;
                const mockRequest = {
                    ...mockBodyRequestCreateOrderController,
                    data: {
                        ...mockBodyRequestCreateOrderController.data,
                        relationships: {
                            ...mockBodyRequestCreateOrderController.data.relationships,
                            snack: {
                                data: [
                                    {
                                        type: JsonAPIProjectTypesEnum.snack,
                                        id: value,
                                    },
                                ],
                            },
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden('Snack Ids don`t match');

                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const orderResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateOrderController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                orderService.createOrder = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const userResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response when the user is created', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateOrderController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const serviceInput: OrderCreateModel = mockInputCreateOrderService;
                const serviceResponse: OrderResponseModel = mockOutputCreateOrderService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 201,
                    body: JSON.stringify(mockResponseCreateOrderController),
                };
                orderService.createOrder = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceCreate = jest.spyOn(orderService, 'createOrder');

                const userResponse = await orderController.create(request);

                expect(spyOrderServiceCreate).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceCreate).toHaveBeenCalledWith(serviceInput, { ingredient: true, snack: true });
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getAllOrders', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyOrderServiceGetAll = jest.spyOn(orderService, 'getAllOrders');

                const orderResponse = await orderController.getAll(request);

                expect(spyOrderServiceGetAll).toHaveBeenCalledTimes(0);
                expect(orderResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['include', {}],
                ['fields', {}],
                ['page', {}],
            ])('should return the status code 400 when passing the %s query params', async (key, value) => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { [key]: value }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyOrderServiceGetAll = jest.spyOn(orderService, 'getAllOrders');

                const userResponse = await orderController.getAll(request);

                expect(spyOrderServiceGetAll).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                orderService.getAllOrders = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyOrderServiceGetAll = jest.spyOn(orderService, 'getAllOrders');

                const userResponse = await orderController.getAll(request);

                expect(spyOrderServiceGetAll).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with all the orders', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: OrderResponseModel[] = mockOutputGetAllOrderService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetAllOrderController),
                };

                orderService.getAllOrders = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceGetAll = jest.spyOn(orderService, 'getAllOrders');

                const userResponse = await orderController.getAll(request);

                expect(spyOrderServiceGetAll).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceGetAll).toHaveBeenCalledWith({});
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getOrderById', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['include', {}],
                ['fields', {}],
                ['page', {}],
            ])('should return the status code 400 when passing the %s query params', async (key, value) => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { [key]: value }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                orderService.getOrderById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with the specific user', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: { id: 'valid-id-order-1' } },
                };
                const serviceResponse: OrderResponseModel = mockOutputGetByIdOrderService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetByIdOrderController),
                };
                orderService.getOrderById = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceGetById).toHaveBeenCalledWith('valid-id-order-1');
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getRelationshipById', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['include', {}],
                ['fields', {}],
                ['filter', {}],
                ['page', {}],
            ])('should return the status code 400 when passing the %s query params', async (key, value) => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { [key]: value }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['(null)', null],
                ['(none of them)', 'other-type'],
            ])(
                'should return the status code 403 when passing some relation different %s between people, snack and ingredient',
                async (_, value) => {
                    const request: ControllerOptions = {
                        header: JSON.stringify(mockHeaderRequest),
                        params: {
                            queryParameter: {},
                            pathParameter: { ...mockPathParamsWithIdRequest, relation: value ?? '' },
                        },
                    };
                    const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                    orderService.getOrderById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                    spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                    const userResponse = await orderController.getRelationshipById(request);

                    expect(spyOrderServiceGetById).toHaveBeenCalledTimes(0);
                    expect(userResponse).toStrictEqual(expectedResponse);
                },
            );

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: {},
                        pathParameter: { ...mockPathParamsWithIdRequest, relation: 'user' },
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                orderService.getOrderById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it("should return a success response with the relations of the specific user's order", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: { id: 'valid-id-order-1', relation: 'user' } },
                };
                const serviceResponse: OrderResponseModel = mockOutputGetRelatonshipByIdOrderUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetRelationshipByIdOrderUserController),
                };
                orderService.getOrderById = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceGetById).toHaveBeenCalledWith('valid-id-order-1', {
                    include: { orderItems: true, user: true },
                });
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it("should return a success response with the relations of the specific snack's order", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: {},
                        pathParameter: { id: 'valid-id-order-1', relation: 'snacks' },
                    },
                };
                const serviceResponse: OrderResponseModel = mockOutputGetRelatonshipByIdOrderSnackService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetRelationshipByIdOrderSnackController),
                };
                orderService.getOrderById = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceGetById).toHaveBeenCalledWith('valid-id-order-1', {
                    include: { orderItems: { include: { snack: true } } },
                });
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it("should return a success response with the relations of the specific ingredient's order", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: {},
                        pathParameter: { id: 'valid-id-order-1', relation: 'ingredients' },
                    },
                };
                const serviceResponse: OrderResponseModel = mockOutputGetRelatonshipByIdOrderIngredientService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetRelationshipByIdOrderIngredientController),
                };
                orderService.getOrderById = jest.fn().mockResolvedValue(serviceResponse);
                spyOrderServiceGetById = jest.spyOn(orderService, 'getOrderById');

                const userResponse = await orderController.getRelationshipById(request);

                expect(spyOrderServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyOrderServiceGetById).toHaveBeenCalledWith('valid-id-order-1', {
                    include: { orderItems: { include: { ingredient: true } } },
                });
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });
});
