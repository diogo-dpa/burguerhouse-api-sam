import { OrderResponseModel } from '../../../models/order/OrderResponseModel';
import { UserCreateModel } from '../../../models/user/UserCreateModel';
import { UserResponseModel } from '../../../models/user/UserResponseModel';
import { UserUpdateModel } from '../../../models/user/UserUpdateModel';
import { JsonAPIBodyResponse, JsonAPIBodyResponseArray } from '../../../utils/jsonapi/typesJsonapi';
import { mockJsonAPIResponseClause } from './commonController.mock';

// Create
export const mockBodyRequestCreateUserController = {
    data: {
        type: 'people',
        attributes: {
            name: 'John Doe',
            email: 'johndoe@email.com',
            isEmployee: true,
        },
    },
};

export const mockResponseCreateUserController: JsonAPIBodyResponse<UserResponseModel> = {
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

export const mockInputCreateUserService: UserCreateModel = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    isEmployee: true,
};

export const mockOutputCreateUserService: UserResponseModel = {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@email.com',
    isEmployee: true,
};

// UPDATE
export const mockBodyRequestUpdateUserController = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'Other John Doe',
        },
    },
};

export const mockInputUpdateUserService: UserUpdateModel = {
    name: 'Other John Doe',
};

export const mockOutputUpdateUserService: UserResponseModel = {
    id: '1',
    name: 'Other John Doe',
    email: 'johndoe@email.com',
    isEmployee: true,
};

export const mockResponseUpdateUserController: JsonAPIBodyResponse<UserResponseModel> = {
    data: {
        type: 'people',
        id: '1',
        attributes: {
            name: 'Other John Doe',
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
export const mockOutputGetAllUserService: UserResponseModel[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@email.com',
        isEmployee: true,
    },
    {
        id: '2',
        name: 'Jose',
        email: 'jose@email.com',
        isEmployee: true,
    },
];

export const mockResponseGetAllUserController: JsonAPIBodyResponseArray<UserResponseModel> = {
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

// GetById
export const mockOutputGetByIdUserService: UserResponseModel = {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@email.com',
    isEmployee: true,
};

export const mockResponseGetByIdUserController: JsonAPIBodyResponse<UserResponseModel> = {
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

// GetRelationshipById
export const mockOutputGetRelatonshipByIdUserService: UserResponseModel = {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@email.com',
    isEmployee: true,
    orders: [
        {
            id: '11',
            userId: '1',
            user: null,
            orderDate: new Date('2024-01-25'),
            orderItems: [],
            totalPrice: 10.5,
        },
        {
            id: '21',
            userId: '1',
            user: null,
            orderDate: new Date('2024-02-01'),
            orderItems: [],
            totalPrice: 33.8,
        },
    ],
};

export const mockResponseGetRelationshipByIdUserController: JsonAPIBodyResponseArray<OrderResponseModel> = {
    data: [
        {
            type: 'order',
            id: '11',
            attributes: {
                userId: '1',
                user: null,
                orderDate: new Date('2024-01-25'),
                orderItems: [],
                totalPrice: 10.5,
            },
        },
        {
            type: 'order',
            id: '21',
            attributes: {
                userId: '1',
                user: null,
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

// Delete
export const mockResponseDeleteUserController: JsonAPIBodyResponse<UserResponseModel> = {
    data: null,
    links: {
        self: 'http://localhost:3000/users',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};
