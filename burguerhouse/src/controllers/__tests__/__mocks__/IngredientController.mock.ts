import { IngredientCreateModel } from '../../../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../../../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../../../models/ingredient/IngredientUpdateModel';
import { JsonAPIBodyResponse, JsonAPIBodyResponseArray } from '../../../utils/jsonapi/typesJsonapi';
import { mockJsonAPIResponseClause } from './commonController.mock';

// Create
export const mockBodyRequestCreateIngredientController = {
    data: {
        type: 'ingredient',
        attributes: {
            name: 'Cebola',
            availableAmount: 10,
            unitMoneyAmount: 1,
        },
    },
};

export const mockResponseCreateIngredientController: JsonAPIBodyResponse<IngredientResponseModel> = {
    data: {
        type: 'ingredient',
        id: '1',
        attributes: {
            name: 'Cebola',
            availableAmount: 10,
            unitMoneyAmount: 1,
        },
    },
    links: {
        self: 'http://localhost:3000/ingredients/1',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};

export const mockInputCreateIngredientService: IngredientCreateModel = {
    name: 'Cebola',
    availableAmount: 10,
    unitMoneyAmount: 1,
};

export const mockOutputCreateIngredientService: IngredientResponseModel = {
    id: '1',
    name: 'Cebola',
    availableAmount: 10,
    unitMoneyAmount: 1,
};

// Update
export const mockBodyRequestUpdateIngredientController = {
    data: {
        type: 'ingredient',
        id: '1',
        attributes: {
            name: 'Brocolis',
        },
    },
};

export const mockInputUpdateIngredientService: IngredientUpdateModel = {
    name: 'Brocolis',
};

export const mockOutputUpdateIngredientService: IngredientResponseModel = {
    id: '1',
    name: 'Brocolis',
    availableAmount: 10,
    unitMoneyAmount: 1,
};

export const mockResponseUpdateIngredientController: JsonAPIBodyResponse<IngredientResponseModel> = {
    data: {
        type: 'ingredient',
        id: '1',
        attributes: {
            name: 'Brocolis',
            availableAmount: 10,
            unitMoneyAmount: 1,
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
export const mockOutputGetAllIngredientService: IngredientResponseModel[] = [
    {
        id: '1',
        name: 'Cenoura',
        availableAmount: 50,
        unitMoneyAmount: 10,
    },
    {
        id: '2',
        name: 'Brocolis',
        availableAmount: 10,
        unitMoneyAmount: 1,
    },
];

export const mockResponseGetAllIngredientController: JsonAPIBodyResponseArray<IngredientResponseModel> = {
    data: [
        {
            type: 'ingredient',
            id: '1',
            attributes: {
                name: 'Cenoura',
                availableAmount: 50,
                unitMoneyAmount: 10,
            },
        },
        {
            type: 'ingredient',
            id: '2',
            attributes: {
                name: 'Brocolis',
                availableAmount: 10,
                unitMoneyAmount: 1,
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

// GET BY ID
export const mockOutputGetByIdIngredientService: IngredientResponseModel = {
    id: '1',
    name: 'Cenoura',
    availableAmount: 50,
    unitMoneyAmount: 10,
};

export const mockResponseGetByIdIngredientController: JsonAPIBodyResponse<IngredientResponseModel> = {
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

// DELETE
export const mockResponseDeleteIngredientController: JsonAPIBodyResponse<IngredientResponseModel> = {
    data: null,
    links: {
        self: 'http://localhost:3000/ingredients',
    },
    jsonapi: {
        ...mockJsonAPIResponseClause,
    },
};
