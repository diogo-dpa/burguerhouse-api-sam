import { OrderResponseModel } from '../../../models/order/OrderResponseModel';
import { OrderPrismaModel } from '../../../models/order/OrderPrismaModel';

export const mockGetAllIngredients = [
    {
        id: 'valid-id-1',
        name: 'Alface',
        unitMoneyAmount: 0.4,
        availableAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'valid-id-2',
        name: 'Bacon',
        unitMoneyAmount: 2,
        availableAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'valid-id-3',
        name: 'Hambúrguer de carne',
        unitMoneyAmount: 3,
        availableAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'valid-id-4',
        name: 'Ovo',
        unitMoneyAmount: 0.8,
        availableAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'valid-id-5',
        name: 'Queijo',
        unitMoneyAmount: 1.5,
        availableAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const mockGetSnackById = {
    id: 'valid-id-1',
    name: 'X-Bacon',
    snackItems: [
        {
            id: 'valid-id-1',
            ingredientId: 'valid-id-2',
            ingredientAmount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'valid-id-2',
            ingredientId: 'valid-id-3',
            ingredientAmount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'valid-id-3',
            ingredientId: 'valid-id-5',
            ingredientAmount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockOutputRepositoryCreateOrder: OrderPrismaModel = {
    id: 'valid-id-1',
    userId: 'valid-id-1',
    user: null,
    totalPrice: 10,
    orderDate: new Date('2024-01-01'),
    orderItems: [
        {
            id: 'valid-id-1',
            orderId: 'valid-id-1',
            ingredientId: 'valid-id-5',
            ingredient: null,
            snackId: undefined,
            snack: null,
            itemAmount: 5,
        },
        {
            id: 'valid-id-2',
            orderId: 'valid-id-1',
            snack: null,
            snackId: 'valid-id-1',
            ingredientId: undefined,
            ingredient: null,
            itemAmount: 1,
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockOutputCreateOrder: OrderResponseModel = {
    id: 'valid-id-1',
    userId: 'valid-id-1',
    user: null,
    totalPrice: 10,
    orderDate: new Date('2024-01-01'),
    orderItems: [
        {
            id: 'valid-id-1',
            ingredientId: 'valid-id-5',
            ingredient: null,
            snackId: undefined,
            snack: null,
            itemAmount: 5,
        },
        {
            id: 'valid-id-2',
            snackId: 'valid-id-1',
            snack: null,
            ingredientId: undefined,
            ingredient: null,
            itemAmount: 1,
        },
    ],
};

// GET ALL
export const mockOutputOrderFromRepository: OrderPrismaModel[] = [
    {
        id: '1',
        userId: '1',
        user: null,
        totalPrice: 10,
        orderItems: [
            {
                id: '1',
                orderId: '1',
                ingredientId: '1',
                ingredient: null,
                snackId: undefined,
                snack: null,
                itemAmount: 10,
            },
        ],
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        userId: '4',
        user: null,
        totalPrice: 30,
        orderItems: [
            {
                id: '5',
                orderId: '2',
                ingredientId: '11',
                ingredient: null,
                snackId: undefined,
                snack: null,
                itemAmount: 10,
            },
        ],
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const mockOutputExpectedOrders: OrderResponseModel[] = [
    {
        id: '1',
        userId: '1',
        user: null,
        totalPrice: 10,
        orderItems: [
            {
                id: '1',
                ingredientId: '1',
                ingredient: null,
                snackId: undefined,
                snack: null,
                itemAmount: 10,
            },
        ],
        orderDate: new Date(),
    },
    {
        id: '2',
        userId: '4',
        user: null,
        totalPrice: 30,
        orderItems: [
            {
                id: '5',
                ingredientId: '11',
                ingredient: null,
                snackId: undefined,
                snack: null,
                itemAmount: 10,
            },
        ],
        orderDate: new Date(),
    },
];
