import { APIGatewayProxyEvent } from 'aws-lambda';
import { commonEventHandlerMock } from './commonHandler.mock';
import { mockJsonAPIResponseClause } from '../../../controllers/__tests__/__mocks__/commonController.mock';

export const ingredientEventHandler: APIGatewayProxyEvent = {
    ...commonEventHandlerMock,
    httpMethod: 'get',
    body: '',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/Ingredients',
    pathParameters: {},
    queryStringParameters: {},
};

// CREATE
export const ingredientCreateEventHandler: APIGatewayProxyEvent = {
    ...ingredientEventHandler,
    httpMethod: 'POST',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseCreateIngredientHandler = {
    data: {
        type: 'ingredient',
        id: '1',
        attributes: {
            name: 'Cenoura',
            availableAmount: 50,
            unitMoneyAmount: 10,
        },
    },
    links: {
        self: 'http://localhost:3000/ingredients/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// UPDATE
export const ingredientUpdateEventHandler: APIGatewayProxyEvent = {
    ...ingredientEventHandler,
    httpMethod: 'PATCH',
    path: '/ingredients/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseUpdateIngredientHandler = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'Arroz',
            availableAmount: 50,
            unitMoneyAmount: 10,
        },
    },
    links: {
        self: 'http://localhost:3000/ingredients/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// GET BY ID
export const ingredientGetByIdEventHandler: APIGatewayProxyEvent = {
    ...ingredientEventHandler,
    httpMethod: 'GET',
    path: '/ingredients/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseGetByIdIngredientsHandler = {
    data: {
        type: 'ingredient',
        id: '1',
        attributes: {
            name: 'Arroz',
            availableAmount: 50,
            unitMoneyAmount: 10,
        },
    },
    links: {
        self: 'http://localhost:3000/ingredients/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// GET ALL
export const ingredientGetAllEventHandler: APIGatewayProxyEvent = {
    ...ingredientEventHandler,
    httpMethod: 'GET',
    path: '/ingredients/',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: {},
    queryStringParameters: {},
};

export const mockResponseGetAllIngredientController = {
    data: [
        {
            type: 'ingredient',
            id: '1',
            attributes: {
                name: 'Cenoura',
                availableAmount: 20,
                unitMoneyAmount: 4,
            },
        },
        {
            type: 'ingredient',
            id: '2',
            attributes: {
                name: 'Arroz',
                availableAmount: 50,
                unitMoneyAmount: 10,
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/ingredients',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

// DELETE
export const ingredientDeleteEventHandler: APIGatewayProxyEvent = {
    ...ingredientEventHandler,
    httpMethod: 'DELETE',
    path: '/ingredients/1',
    body: '',
    multiValueQueryStringParameters: {},
    pathParameters: { id: '1' },
    queryStringParameters: {},
};

export const mockResponseDeleteIngredientController = {
    data: null,
    links: {
        self: 'http://localhost:3000/ingredients',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};
