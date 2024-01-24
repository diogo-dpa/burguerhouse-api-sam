import {
    JsonAPIBodyResponse,
    JsonAPIBodyResponseArray,
    JsonAPIProjectTypesEnum,
    MountSuccessResponseType,
} from '../../typesJsonapi';

// MountSuccessResponse
export const mockInputMountSuccessResponseWithoutRelationshipAndBody: MountSuccessResponseType = {
    options: { type: JsonAPIProjectTypesEnum.people, linkSelf: 'link-self-test' },
};

export const mockOutputMountSuccessResponseWithoutRelationshipAndBody: JsonAPIBodyResponse<any> = {
    data: null,
    links: {
        self: 'http://localhost:3000/link-self-test',
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

export const mockInputMountSuccessResponseWithoutRelationship: MountSuccessResponseType = {
    options: { type: JsonAPIProjectTypesEnum.people, linkSelf: 'link-self-test' },
    body: { id: '1', name: 'Joao', email: 'joao@email.com', isEmployee: true },
};

export const mockOutputMountSuccessResponseWithoutRelationship: JsonAPIBodyResponse<any> = {
    data: {
        type: JsonAPIProjectTypesEnum.people,
        id: '1',
        attributes: {
            name: 'Joao',
            email: 'joao@email.com',
            isEmployee: true,
        },
        relationships: undefined,
    },
    links: {
        self: 'http://localhost:3000/link-self-test',
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

export const mockInputMountSuccessResponseWithRelationship: MountSuccessResponseType = {
    ...mockInputMountSuccessResponseWithoutRelationship,
    body: {
        ...mockInputMountSuccessResponseWithoutRelationship.body,
        ['orders']: [
            {
                id: '10',
                totalPrice: 10,
                status: 'pending',
            },
            {
                id: '11',
                totalPrice: 20,
                status: 'completed',
            },
        ],
    },
    relationships: {
        relations: [JsonAPIProjectTypesEnum.order],
    },
};

export const mockOutputMountSuccessResponseWithRelationship: JsonAPIBodyResponse<any> = {
    data: {
        type: JsonAPIProjectTypesEnum.people,
        id: '1',
        attributes: {
            name: 'Joao',
            email: 'joao@email.com',
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
        self: 'http://localhost:3000/link-self-test',
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

// MountSuccessResponseArray
export const mockInputMountSuccessResponseArrayWithoutRelationship: MountSuccessResponseType = {
    options: { type: JsonAPIProjectTypesEnum.people, linkSelf: 'link-self-test' },
    body: [
        { id: '1', name: 'Joao', email: 'joao@email.com', isEmployee: true },
        { id: '2', name: 'Jose', email: 'jose@email.com', isEmployee: false },
        { id: '3', name: 'Jonas', email: 'jonas@email.com', isEmployee: true },
    ],
};

export const mockOutputMountSuccessResponseArrayWithoutRelationship: JsonAPIBodyResponseArray<any> = {
    data: [
        {
            type: JsonAPIProjectTypesEnum.people,
            id: '1',
            attributes: {
                name: 'Joao',
                email: 'joao@email.com',
                isEmployee: true,
            },
            relationships: undefined,
        },
        {
            type: JsonAPIProjectTypesEnum.people,
            id: '2',
            attributes: {
                name: 'Jose',
                email: 'jose@email.com',
                isEmployee: false,
            },
            relationships: undefined,
        },
        {
            type: JsonAPIProjectTypesEnum.people,
            id: '3',
            attributes: {
                name: 'Jonas',
                email: 'jonas@email.com',
                isEmployee: true,
            },
            relationships: undefined,
        },
    ],
    links: {
        self: 'http://localhost:3000/link-self-test',
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

export const mockInputMountSuccessResponseArrayWithRelationship: MountSuccessResponseType = {
    ...mockInputMountSuccessResponseWithoutRelationship,
    body: [...((mockInputMountSuccessResponseArrayWithoutRelationship?.body ?? []) as Array<any>)],
    relationships: {
        relations: [JsonAPIProjectTypesEnum.order],
    },
};

export const mockOutputMountSuccessResponseArrayWithRelationship: JsonAPIBodyResponseArray<any> = {
    data: mockOutputMountSuccessResponseArrayWithoutRelationship.data.map((item) => ({
        ...item,
        relationships: {
            order: {
                links: {
                    self: `http://localhost:3000/users/${item.id}/relationships/orders`,
                    related: `http://localhost:3000/users/${item.id}/orders`,
                },
            },
        },
    })),
    links: {
        self: 'http://localhost:3000/link-self-test',
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

//mountSuccessResponseRelationshipArray
export const mockInputMountSuccessResponseRelationshipWithBodyEmpty: MountSuccessResponseType = {
    options: {
        type: JsonAPIProjectTypesEnum.order,
        linkSelf: 'link-self-test',
        baseLinkReference: 'base-link-reference',
    },
    body: [],
};

export const mockOutputMountSuccessResponseRelationshipWithBodyEmpty: JsonAPIBodyResponseArray<any> = {
    data: [],
    links: {
        self: `http://localhost:3000/base-link-reference/relationships/link-self-test`,
        related: `http://localhost:3000/base-link-reference/link-self-test`,
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};

export const mockInputMountSuccessResponseRelationship: MountSuccessResponseType = {
    ...mockInputMountSuccessResponseRelationshipWithBodyEmpty,
    body: [
        { id: '1', orderPrice: 100.5, orderDate: '01/01/2024', orderDetails: 'order-details-1' },
        { id: '2', orderPrice: 80.3, orderDate: '01/02/2024', orderDetails: 'order-details-2' },
        { id: '3', orderPrice: 22.5, orderDate: '01/03/2024', orderDetails: 'order-details-3' },
    ],
};

export const mockOutMountSuccessResponseRelationship: JsonAPIBodyResponseArray<any> = {
    data: [
        {
            type: JsonAPIProjectTypesEnum.order,
            id: '1',
            attributes: {
                orderPrice: 100.5,
                orderDate: '01/01/2024',
                orderDetails: 'order-details-1',
            },
        },
        {
            type: JsonAPIProjectTypesEnum.order,
            id: '2',
            attributes: {
                orderPrice: 80.3,
                orderDate: '01/02/2024',
                orderDetails: 'order-details-2',
            },
        },
        {
            type: JsonAPIProjectTypesEnum.order,
            id: '3',
            attributes: {
                orderPrice: 22.5,
                orderDate: '01/03/2024',
                orderDetails: 'order-details-3',
            },
        },
    ],
    links: {
        self: `http://localhost:3000/base-link-reference/relationships/link-self-test`,
        related: `http://localhost:3000/base-link-reference/link-self-test`,
    },
    jsonapi: {
        version: '1.0',
        authors: ['Diogo Almazan'],
    },
};
