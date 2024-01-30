import { APIGatewayProxyEvent } from 'aws-lambda';
import { commonEventHandlerMock } from './commonHandler.mock';
import { mockJsonAPIResponseClause } from '../../../controllers/__tests__/__mocks__/commonController.mock';

export const orderEventHandler: APIGatewayProxyEvent = {
    ...commonEventHandlerMock,
    httpMethod: '',
    body: '',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/orders',
    pathParameters: {},
    queryStringParameters: {},
};

// GET ALL
export const orderGetAllEventHandler: APIGatewayProxyEvent = {
    ...orderEventHandler,
    httpMethod: 'GET',
    path: '/orders',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseGetAllOrderController = {
    data: [
        {
            type: 'order',
            id: 'valid-id-order-1',
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
                orderDate: new Date('2024-01-25'),
            },
            relationships: {
                people: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-1/relationships/users',
                        related: 'http://localhost:3000/orders/valid-id-order-1/users',
                    },
                },
                snack: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-1/relationships/snacks',
                        related: 'http://localhost:3000/orders/valid-id-order-1/snacks',
                    },
                },
                ingredient: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-1/relationships/ingredients',
                        related: 'http://localhost:3000/orders/valid-id-order-1/ingredients',
                    },
                },
            },
        },
        {
            type: 'order',
            id: 'valid-id-order-2',
            attributes: {
                userId: 'valid-id-user-2',
                totalPrice: 23.5,
                orderItems: [
                    {
                        id: 'some-id-4',
                        itemAmount: 13,
                        snackId: 'valid-id-snack-4',
                        snack: null,
                        ingredient: null,
                    },
                    {
                        id: 'some-id-6',
                        itemAmount: 3,
                        ingredientId: 'valid-id-ingredient-8',
                        snack: null,
                        ingredient: null,
                    },
                ],
                orderDate: new Date('2024-01-25'),
            },
            relationships: {
                people: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-2/relationships/users',
                        related: 'http://localhost:3000/orders/valid-id-order-2/users',
                    },
                },
                snack: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-2/relationships/snacks',
                        related: 'http://localhost:3000/orders/valid-id-order-2/snacks',
                    },
                },
                ingredient: {
                    links: {
                        self: 'http://localhost:3000/orders/valid-id-order-2/relationships/ingredients',
                        related: 'http://localhost:3000/orders/valid-id-order-2/ingredients',
                    },
                },
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/orders',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// CREATE
export const orderCreateEventHandler: APIGatewayProxyEvent = {
    ...orderEventHandler,
    httpMethod: 'POST',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseCreateOrderHandler = {
    data: {
        type: 'order',
        id: '1',
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
        relationships: {
            people: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/users',
                    related: 'http://localhost:3000/orders/valid-id-order-1/users',
                },
            },
            snack: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/snacks',
                    related: 'http://localhost:3000/orders/valid-id-order-1/snacks',
                },
            },
            ingredient: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/ingredients',
                    related: 'http://localhost:3000/orders/valid-id-order-1/ingredients',
                },
            },
        },
    },
    links: {
        self: 'http://localhost:3000/orders/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// GET RELATION BY ID
export const orderGetRelationByIdEventHandler: APIGatewayProxyEvent = {
    ...orderEventHandler,
    httpMethod: 'GET',
    path: '/orders/1/users',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1', relation: 'user' },
    queryStringParameters: {},
};

export const mockResponseGetRelationOrderHandler = {
    data: [
        {
            type: 'people',
            id: 'valid-id-user-1',
            attributes: {
                name: 'Diogo Almazan',
                email: '',
                isEmployee: false,
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/orders/valid-id-order-1/relationships/user',
        related: 'http://localhost:3000/orders/valid-id-order-1/user',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// GET BY ID
export const orderGetByIdEventHandler: APIGatewayProxyEvent = {
    ...orderEventHandler,
    httpMethod: 'GET',
    path: '/orders/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseGetByIdOrderHandler = {
    data: {
        type: 'order',
        id: 'valid-id-order-1',
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
            orderDate: new Date('2024-01-25'),
        },
        relationships: {
            people: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/users',
                    related: 'http://localhost:3000/orders/valid-id-order-1/users',
                },
            },
            snack: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/snacks',
                    related: 'http://localhost:3000/orders/valid-id-order-1/snacks',
                },
            },
            ingredient: {
                links: {
                    self: 'http://localhost:3000/orders/valid-id-order-1/relationships/ingredients',
                    related: 'http://localhost:3000/orders/valid-id-order-1/ingredients',
                },
            },
        },
    },
    links: {
        self: 'http://localhost:3000/orders/valid-id-order-1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};
