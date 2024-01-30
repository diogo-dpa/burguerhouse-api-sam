import { describe, expect, it } from '@jest/globals';
import { PrismaOrderRepository } from '../../repositories/prisma/PrismaOrderRepository';
import { OrderService } from '../OrderService';
import { PrismaSnacksRepository } from '../../repositories/prisma/PrismaSnacksRepository';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { OrderCreateModel } from '../../models/order/OrderCreateModel';
import { User } from '@prisma/client';
import { OrderResponseModel } from '../../models/order/OrderResponseModel';
import {
    mockGetAllIngredients,
    mockGetSnackById,
    mockOutputCreateOrder,
    mockOutputExpectedOrders,
    mockOutputOrderFromRepository,
    mockOutputRepositoryCreateOrder,
} from './__mocks__/OrderService.mock';
import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';

describe('OrderService', () => {
    const prismaOrderRepository: jest.Mocked<
        Omit<PrismaOrderRepository, 'formatOrderResponse' | 'formatOrdersResponse'>
    > = {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        defaultInclude: { orderItems: true },
    };
    const prismaSnackRepository: jest.Mocked<PrismaSnacksRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        getByName: jest.fn(),
        defaultInclude: { snackItems: true },
    };

    const prismaIngredientRepository: jest.Mocked<PrismaIngredientRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        getByName: jest.fn(),
    };

    const prismaUserRepository: jest.Mocked<PrismaUserRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        getByEmail: jest.fn(),
    };

    let spyPrismaOrderRepositoryCreate: jest.SpiedFunction<typeof prismaOrderRepository.create>;
    let spyPrismaOrderRepositoryGetAll: jest.SpiedFunction<typeof prismaOrderRepository.getAll>;
    let spyPrismaOrderRepositoryGetById: jest.SpiedFunction<typeof prismaOrderRepository.getById>;

    let spyPrismaSnackRepositoryGetById: jest.SpiedFunction<typeof prismaSnackRepository.getById>;

    let spyPrismaIngredientRepositoryGetAll: jest.SpiedFunction<typeof prismaIngredientRepository.getAll>;
    let spyPrismaIngredientRepositoryGetById: jest.SpiedFunction<typeof prismaIngredientRepository.getById>;
    let spyPrismaIngredientRepositoryUpdate: jest.SpiedFunction<typeof prismaIngredientRepository.update>;

    let spyPrismaUserRepositoryGetById: jest.SpiedFunction<typeof prismaUserRepository.getById>;
    let orderService: OrderService;

    beforeAll(() => {
        orderService = new OrderService(
            prismaOrderRepository as unknown as PrismaOrderRepository,
            prismaSnackRepository,
            prismaIngredientRepository,
            prismaUserRepository,
        );
    });

    beforeEach(() => {
        prismaOrderRepository.create.mockReset();
        prismaOrderRepository.getAll.mockReset();
        prismaOrderRepository.getById.mockReset();

        prismaUserRepository.getById.mockReset();

        prismaIngredientRepository.getAll.mockReset();
        prismaIngredientRepository.getById.mockReset();

        prismaSnackRepository.getById.mockReset();
    });

    describe('createOrder', () => {
        describe('Error cases', () => {
            it.each([
                [
                    'some ingredientId is invalid',
                    [{ ingredientId: '999', itemAmount: 10 }],
                    { ingredient: true, snack: false },
                ],
                ['some snackId is invalid', [{ snackId: '999', itemAmount: 5 }], { ingredient: false, snack: true }],
                [
                    'some ingredientId and snackId are invalid',
                    [
                        { ingredientId: '999', itemAmount: 10 },
                        { snackId: '999', itemAmount: 5 },
                    ],
                    { ingredient: true, snack: true },
                ],
            ])('should throw an error when %s', async (_, input, output) => {
                const newOrderFromRequest: OrderCreateModel = {
                    userId: '1',
                    totalPrice: 10,
                    orderItems: [...input],
                };

                spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                expect(async () => {
                    await orderService.createOrder(newOrderFromRequest, { ...output });
                }).rejects.toThrow('400 - Invalid params');

                expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(0);
                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
            });

            it('should throw an error when the user does not exist', async () => {
                const newOrderFromRequest: OrderCreateModel = {
                    userId: '999',
                    totalPrice: 10,
                    orderItems: [
                        { ingredientId: 'valid-id', itemAmount: 10 },
                        { snackId: 'valid-id', itemAmount: 5 },
                    ],
                };

                spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');
                prismaUserRepository.getById = jest.fn().mockResolvedValue(null);
                spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                expect(async () => {
                    await orderService.createOrder(newOrderFromRequest, { ingredient: true, snack: true });
                }).rejects.toThrow('404 - User not found');

                expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaUserRepositoryGetById).toBeCalledWith(newOrderFromRequest.userId);
                expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(0);
                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
            });

            it.each([
                ['some ingredientId does not exist', null, {}, '404 - Ingredient not found'],
                ['some snackId does not exist', {}, null, '404 - Snack not found'],
                ['some ingredientId and snackId do not exist', null, null, '404 - Ingredient not found'],
            ])(
                'should throw an error when %s',
                async (_, outputRepositoryIngredient, outputRepositorySnack, output) => {
                    const newOrderFromRequest: OrderCreateModel = {
                        userId: '1',
                        totalPrice: 10,
                        orderItems: [
                            { ingredientId: 'non-existing-id', itemAmount: 10 },
                            { snackId: 'non-existing-id', itemAmount: 5 },
                        ],
                    };

                    const userFromRepository: User = {
                        id: '1',
                        name: 'valid-name',
                        email: 'valid-email',
                        isEmployee: false,
                        createdAt: new Date(),
                    };

                    spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');

                    prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
                    spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

                    prismaIngredientRepository.getById = jest.fn().mockResolvedValue(outputRepositoryIngredient);
                    spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
                    spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                    prismaSnackRepository.getById = jest.fn().mockResolvedValue(outputRepositorySnack);
                    spyPrismaSnackRepositoryGetById = jest.spyOn(prismaSnackRepository, 'getById');

                    expect(async () => {
                        await orderService.createOrder(newOrderFromRequest, { snack: true, ingredient: true });
                    }).rejects.toThrow(output);

                    expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
                    expect(spyPrismaUserRepositoryGetById).toBeCalledWith(newOrderFromRequest.userId);
                    expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(0);
                    expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
                },
            );

            it('should throw an error when there are a huge amount of ingredient in the order and the ingredient amount is insufficient', async () => {
                const newOrderWithHugeAmountFromRequest: OrderCreateModel = {
                    userId: '1',
                    totalPrice: 10,
                    orderItems: [
                        { ingredientId: 'valid-id-5', itemAmount: 200 },
                        { snackId: 'valid-id-1', itemAmount: 5 },
                    ],
                };

                const userFromRepository: User = {
                    id: '1',
                    name: 'valid-name',
                    email: 'valid-email',
                    isEmployee: false,
                    createdAt: new Date(),
                };

                spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');

                prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
                spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

                prismaIngredientRepository.getById = jest
                    .fn()
                    .mockResolvedValue(mockGetAllIngredients.filter((ingredient) => ingredient.id === 'valid-id-5')[0]);

                prismaIngredientRepository.getAll = jest.fn().mockResolvedValue(mockGetAllIngredients);
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                prismaSnackRepository.getById = jest.fn().mockResolvedValue(mockGetSnackById);

                expect(async () => {
                    await orderService.createOrder(newOrderWithHugeAmountFromRequest, {
                        snack: true,
                        ingredient: true,
                    });
                }).rejects.toThrow('400 - Available ingredient amount is insufficient');

                expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaUserRepositoryGetById).toBeCalledWith(newOrderWithHugeAmountFromRequest.userId);

                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
                expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(0);
            });

            it('should throw an error when there are a huge amount of snack in the order and the ingredient amount is insufficient', async () => {
                const newOrderWithHugeAmountFromRequest: OrderCreateModel = {
                    userId: '1',
                    totalPrice: 10,
                    orderItems: [
                        { ingredientId: 'valid-id-5', itemAmount: 5 },
                        { snackId: 'valid-id-1', itemAmount: 100 },
                    ],
                };

                const userFromRepository: User = {
                    id: '1',
                    name: 'valid-name',
                    email: 'valid-email',
                    isEmployee: false,
                    createdAt: new Date(),
                };

                spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');

                prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
                spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

                prismaIngredientRepository.getById = jest
                    .fn()
                    .mockResolvedValue(mockGetAllIngredients.filter((ingredient) => ingredient.id === 'valid-id-5')[0]);

                prismaIngredientRepository.getAll = jest.fn().mockResolvedValue(mockGetAllIngredients);
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                prismaSnackRepository.getById = jest.fn().mockResolvedValue(mockGetSnackById);

                expect(async () => {
                    await orderService.createOrder(newOrderWithHugeAmountFromRequest, {
                        snack: true,
                        ingredient: true,
                    });
                }).rejects.toThrow('400 - Available ingredient amount is insufficient');

                expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaUserRepositoryGetById).toBeCalledWith(newOrderWithHugeAmountFromRequest.userId);

                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
                expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(0);
            });
        });

        describe('Success cases', () => {
            it('should be able to create an order and update the ingredient amount', async () => {
                const newOrderWithHugeAmountFromRequest: OrderCreateModel = {
                    userId: '1',
                    totalPrice: 10,
                    orderItems: [
                        { ingredientId: 'valid-id-5', itemAmount: 5 },
                        { snackId: 'valid-id-1', itemAmount: 1 },
                    ],
                };

                const userFromRepository: User = {
                    id: '1',
                    name: 'valid-name',
                    email: 'valid-email',
                    isEmployee: false,
                    createdAt: new Date(),
                };

                prismaOrderRepository.create = jest.fn().mockResolvedValue(mockOutputRepositoryCreateOrder);
                spyPrismaOrderRepositoryCreate = jest.spyOn(prismaOrderRepository, 'create');

                prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
                spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

                prismaIngredientRepository.getById = jest
                    .fn()
                    .mockResolvedValue(mockGetAllIngredients.filter((ingredient) => ingredient.id === 'valid-id-5')[0]);
                spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');

                prismaIngredientRepository.getAll = jest.fn().mockResolvedValue(mockGetAllIngredients);
                spyPrismaIngredientRepositoryGetAll = jest.spyOn(prismaIngredientRepository, 'getAll');

                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                prismaSnackRepository.getById = jest.fn().mockResolvedValue(mockGetSnackById);
                spyPrismaSnackRepositoryGetById = jest.spyOn(prismaSnackRepository, 'getById');

                const createdOrder = await orderService.createOrder(newOrderWithHugeAmountFromRequest, {
                    snack: true,
                    ingredient: true,
                });

                expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaUserRepositoryGetById).toBeCalledWith(newOrderWithHugeAmountFromRequest.userId);

                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetById).toBeCalledWith('valid-id-5');
                expect(spyPrismaIngredientRepositoryGetAll).toHaveBeenCalledTimes(1);

                expect(spyPrismaSnackRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaSnackRepositoryGetById).toBeCalledWith('valid-id-1');

                expect(spyPrismaOrderRepositoryCreate).toBeCalledWith(newOrderWithHugeAmountFromRequest);
                expect(spyPrismaOrderRepositoryCreate).toHaveBeenCalledTimes(1);

                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(3);

                expect(createdOrder).toEqual(mockOutputCreateOrder);
            });
        });
    });

    describe('getAllOrders', () => {
        describe('Success cases', () => {
            it('should return an empty array when there is no data', async () => {
                prismaOrderRepository.getAll = jest.fn().mockResolvedValue([]);
                spyPrismaOrderRepositoryGetAll = jest.spyOn(prismaOrderRepository, 'getAll');

                const ordersFromService = await orderService.getAllOrders();

                expect(spyPrismaOrderRepositoryGetAll).toHaveBeenCalledTimes(1);
                expect(ordersFromService).toStrictEqual([]);
            });
            it('should return all orders', async () => {
                prismaOrderRepository.getAll = jest.fn().mockResolvedValue(mockOutputOrderFromRepository);
                spyPrismaOrderRepositoryGetAll = jest.spyOn(prismaOrderRepository, 'getAll');

                const ordersFromService = await orderService.getAllOrders();

                expect(spyPrismaOrderRepositoryGetAll).toHaveBeenCalledTimes(1);
                expect(ordersFromService).toStrictEqual(mockOutputExpectedOrders);
            });
        });
    });

    describe('getOrderById', () => {
        const queryOptions = { sort: undefined, include: undefined, page: undefined, fields: undefined };
        it('should return an empty object when the order was not found', async () => {
            const orderId = '999';
            prismaOrderRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaOrderRepositoryGetById = jest.spyOn(prismaOrderRepository, 'getById');

            const orderFromService = await orderService.getOrderById(orderId);

            expect(spyPrismaOrderRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaOrderRepositoryGetById).toHaveBeenCalledWith(orderId, queryOptions);
            expect(orderFromService).toStrictEqual({});
        });

        it('should return the order when it was found', async () => {
            const orderId = '1';
            const ingredientFromRepository: OrderPrismaModel = mockOutputOrderFromRepository[0];
            const expectedIngredient: OrderResponseModel = mockOutputExpectedOrders[0];

            prismaOrderRepository.getById = jest.fn().mockResolvedValue(ingredientFromRepository);
            spyPrismaOrderRepositoryGetById = jest.spyOn(prismaOrderRepository, 'getById');

            const orderFromService = await orderService.getOrderById(orderId);

            expect(spyPrismaOrderRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaOrderRepositoryGetById).toHaveBeenCalledWith(orderId, queryOptions);
            expect(orderFromService).toStrictEqual(expectedIngredient);
        });
    });
});
