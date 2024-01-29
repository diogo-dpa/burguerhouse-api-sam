import { APIGatewayProxyEvent } from 'aws-lambda';
import { commonEventHandlerMock } from './commonHandler.mock';
import { mockJsonAPIResponseClause } from '../../../controllers/__tests__/__mocks__/commonController.mock';

export const userEventHandler: APIGatewayProxyEvent = {
    ...commonEventHandlerMock,
    httpMethod: 'get',
    body: '',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/users',
    pathParameters: {},
    queryStringParameters: {},
};

// Create
export const userCreateEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'POST',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseCreateUserHandler = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'John Doe',
            email: 'johndoe@email.com',
            isEmployee: true,
        },
        relationships: {
            order: {
                links: {
                    self: 'http://localhost:3000/users/1/relationships/orders',
                    related: 'http://localhost:3000/users/1/orders',
                },
            },
        },
    },
    links: {
        self: 'http://localhost:3000/users/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// Update
export const userUpdateEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'PATCH',
    path: '/users/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseUpdateUserHandler = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'John',
            email: 'johndoe@email.com',
            isEmployee: true,
        },
        relationships: {
            order: {
                links: {
                    self: 'http://localhost:3000/users/1/relationships/orders',
                    related: 'http://localhost:3000/users/1/orders',
                },
            },
        },
    },
    links: {
        self: 'http://localhost:3000/users/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// Get Relation By Id
export const userGetRelationByIdEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'GET',
    path: '/users/1/orders',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1', relation: 'orders' },
    queryStringParameters: {},
};

export const mockResponseGetRelationUserHandler = {
    data: [
        {
            type: 'order',
            id: '11',
            attributes: {
                orderDate: new Date('2024-01-25'),
                orderItems: [],
                totalPrice: 10.5,
            },
        },
        {
            type: 'order',
            id: '21',
            attributes: {
                orderDate: new Date('2024-02-01'),
                orderItems: [],
                totalPrice: 33.8,
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/users/1/relationships/orders',
        related: 'http://localhost:3000/users/1/orders',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// Get By Id
export const userGetByIdEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'GET',
    path: '/users/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseGetByIdUserHandler = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'John',
            email: 'johndoe@email.com',
            isEmployee: true,
        },
        relationships: {
            order: {
                links: {
                    self: 'http://localhost:3000/users/1/relationships/orders',
                    related: 'http://localhost:3000/users/1/orders',
                },
            },
        },
    },
    links: {
        self: 'http://localhost:3000/users/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// GET ALL
export const userGetAllEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'GET',
    path: '/users/',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseGetAllUserController = {
    data: [
        {
            type: 'people',
            id: '1',
            attributes: {
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: true,
            },
            relationships: {
                order: {
                    links: {
                        self: 'http://localhost:3000/users/1/relationships/orders',
                        related: 'http://localhost:3000/users/1/orders',
                    },
                },
            },
        },
        {
            type: 'people',
            id: '2',
            attributes: {
                name: 'Jose',
                email: 'jose@email.com',
                isEmployee: true,
            },
            relationships: {
                order: {
                    links: {
                        self: 'http://localhost:3000/users/2/relationships/orders',
                        related: 'http://localhost:3000/users/2/orders',
                    },
                },
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/users',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// Delete
export const userDeleteEventHandler: APIGatewayProxyEvent = {
    ...userEventHandler,
    httpMethod: 'DELETE',
    path: '/users/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseDeleteUserController = {
    data: null,
    links: {
        self: 'http://localhost:3000/users',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};
