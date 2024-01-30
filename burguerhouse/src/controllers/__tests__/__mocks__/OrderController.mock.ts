import { IngredientResponseModel } from '../../../models/ingredient/IngredientResponseModel';
import { OrderCreateModel } from '../../../models/order/OrderCreateModel';
import { OrderResponseModel } from '../../../models/order/OrderResponseModel';
import { SnackResponseModel } from '../../../models/snack/SnackResponseModel';
import { UserResponseModel } from '../../../models/user/UserResponseModel';
import { JsonAPIBodyResponse, JsonAPIBodyResponseArray } from '../../../utils/jsonapi/typesJsonapi';
import { mockJsonAPIResponseClause } from './commonController.mock';

// CREATE
export const mockBodyRequestCreateOrderController = {
    data: {
        type: 'order',
        attributes: {
            userId: 'valid-id-user-1',
            totalPrice: 99.5,
            orderItems: [
                {
                    itemAmount: 3,
                    snackId: 'valid-id-snack-1',
                },
                {
                    itemAmount: 1,
                    ingredientId: 'valid-id-ingredient-1',
                },
            ],
        },
        relationships: {
            snack: {
                data: [
                    {
                        type: 'snack',
                        id: 'valid-id-snack-1',
                    },
                ],
            },
            ingredient: {
                data: [
                    {
                        type: 'ingredient',
                        id: 'valid-id-ingredient-1',
                    },
                ],
            },
            people: {
                data: [
                    {
                        type: 'people',
                        id: 'valid-id-user-1',
                    },
                ],
            },
        },
    },
};

export const mockWrongRelationshipPeopleBodyRequestCreateOrderController = {
    ...mockBodyRequestCreateOrderController,
    data: {
        ...mockBodyRequestCreateOrderController.data,
        relationships: {
            snack: {
                data: [
                    {
                        type: 'snack',
                        id: 'valid-id-snack-1',
                    },
                ],
            },
            ingredient: {
                data: [
                    {
                        type: 'ingredient',
                        id: 'valid-id-ingredient-1',
                    },
                ],
            },
        },
    },
};

export const mockWrongRelationshipSnackIngredientBodyRequestCreateOrderController = {
    ...mockBodyRequestCreateOrderController,
    data: {
        ...mockBodyRequestCreateOrderController.data,
        relationships: {
            people: {
                data: [
                    {
                        type: 'people',
                        id: 'valid-id-user-1',
                    },
                ],
            },
        },
    },
};

export const mockInputCreateOrderService: OrderCreateModel = {
    userId: 'valid-id-user-1',
    totalPrice: 99.5,
    orderItems: [
        {
            itemAmount: 3,
            snackId: 'valid-id-snack-1',
        },
        {
            itemAmount: 1,
            ingredientId: 'valid-id-ingredient-1',
        },
    ],
};

export const mockOutputCreateOrderService: OrderResponseModel = {
    id: 'valid-id-order-1',
    userId: 'valid-id-user-1',
    user: null,
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
};

export const mockResponseCreateOrderController: JsonAPIBodyResponse<Omit<OrderResponseModel, 'user'>> = {
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

// GET ALL
export const mockOutputGetAllOrderService: OrderResponseModel[] = [
    {
        id: 'valid-id-order-1',
        userId: 'valid-id-user-1',
        user: null,
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
    {
        id: 'valid-id-order-2',
        userId: 'valid-id-user-2',
        user: null,
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
];

export const mockResponseGetAllOrderController: JsonAPIBodyResponseArray<Omit<OrderResponseModel, 'user'>> = {
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

// GET BY ID
export const mockOutputGetByIdOrderService: OrderResponseModel = {
    id: 'valid-id-order-1',
    userId: 'valid-id-user-1',
    user: null,
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
};

export const mockResponseGetByIdOrderController: JsonAPIBodyResponse<Omit<OrderResponseModel, 'user'>> = {
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

// GET RELATION BY ID
export const mockOutputGetRelatonshipByIdOrderService: OrderResponseModel = {
    id: 'valid-id-order-1',
    userId: 'valid-id-user-1',
    user: null,
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
};

export const mockOutputGetRelatonshipByIdOrderUserService: OrderResponseModel = {
    ...mockOutputGetRelatonshipByIdOrderService,
    user: {
        id: 'valid-id-user-1',
        name: 'Diogo Almazan',
        email: '',
        isEmployee: false,
    },
};

export const mockResponseGetRelationshipByIdOrderUserController: JsonAPIBodyResponseArray<UserResponseModel> = {
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

export const mockOutputGetRelatonshipByIdOrderSnackService: OrderResponseModel = {
    ...mockOutputGetRelatonshipByIdOrderService,
    orderItems: mockOutputGetRelatonshipByIdOrderService.orderItems.map((item, index) =>
        index === 0
            ? {
                  ...item,
                  snack: {
                      id: 'valid-id-snack-1',
                      name: 'X-Bacon',
                      description: 'X-Bacon description',
                      unitMoneyAmount: 10.5,
                      snackItems: [
                          {
                              id: 'valid-id-snack-item-1',
                              ingredientId: 'valid-id-ingredient-1',
                              ingredientAmount: 2,
                          },
                          {
                              id: 'valid-id-snack-item-2',
                              ingredientId: 'valid-id-ingredient-2',
                              ingredientAmount: 1,
                          },
                      ],
                  },
              }
            : item,
    ),
};

export const mockResponseGetRelationshipByIdOrderSnackController: JsonAPIBodyResponseArray<SnackResponseModel> = {
    data: [
        {
            type: 'snack',
            id: 'valid-id-snack-1',
            attributes: {
                name: 'X-Bacon',
                description: 'X-Bacon description',
                unitMoneyAmount: 10.5,
                snackItems: [
                    {
                        id: 'valid-id-snack-item-1',
                        ingredientId: 'valid-id-ingredient-1',
                        ingredientAmount: 2,
                    },
                    {
                        id: 'valid-id-snack-item-2',
                        ingredientId: 'valid-id-ingredient-2',
                        ingredientAmount: 1,
                    },
                ],
            },
        },
    ],
    links: {
        self: 'http://localhost:3000/orders/valid-id-order-1/relationships/snacks',
        related: 'http://localhost:3000/orders/valid-id-order-1/snacks',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

export const mockOutputGetRelatonshipByIdOrderIngredientService: OrderResponseModel = {
    ...mockOutputGetRelatonshipByIdOrderService,
    orderItems: mockOutputGetRelatonshipByIdOrderService.orderItems.map((item, index) =>
        index === 1
            ? {
                  ...item,
                  ingredient: {
                      id: 'valid-id-ingredient-1',
                      name: 'Bacon',
                      availableAmount: 10,
                      unitMoneyAmount: 5,
                  },
              }
            : item,
    ),
};

export const mockResponseGetRelationshipByIdOrderIngredientController: JsonAPIBodyResponseArray<IngredientResponseModel> =
    {
        data: [
            {
                type: 'ingredient',
                id: 'valid-id-ingredient-1',
                attributes: {
                    name: 'Bacon',
                    availableAmount: 10,
                    unitMoneyAmount: 5,
                },
            },
        ],
        links: {
            self: 'http://localhost:3000/orders/valid-id-order-1/relationships/ingredients',
            related: 'http://localhost:3000/orders/valid-id-order-1/ingredients',
        },
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    };
