import { describe, it, expect } from '@jest/globals';
import { IngredientHandler } from '../IngredientHandler';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { IngredientService } from '../../services/IngredientService';
import { IngredientController } from '../../controllers/IngredientController';
import { ControllerOptions } from '../../controllers/typesController';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
    mockErrorResponseInternalServerError,
    mockErrorResponseNotFound,
} from '../../controllers/__tests__/__mocks__/commonController.mock';
import {
    ingredientCreateEventHandler,
    ingredientDeleteEventHandler,
    ingredientGetAllEventHandler,
    ingredientGetByIdEventHandler,
    ingredientUpdateEventHandler,
    mockResponseCreateIngredientHandler,
    mockResponseDeleteIngredientController,
    mockResponseGetAllIngredientController,
    mockResponseGetByIdIngredientsHandler,
    mockResponseUpdateIngredientHandler,
} from './__mocks__/IngredientHandler.mock';

describe('Ingredient Handler', () => {
    const ingredientRepository: jest.Mocked<PrismaIngredientRepository> =
        new PrismaIngredientRepository() as jest.Mocked<PrismaIngredientRepository>;
    const ingredientService: jest.Mocked<IngredientService> = new IngredientService(
        ingredientRepository,
    ) as jest.Mocked<IngredientService>;
    const ingredientController: jest.Mocked<IngredientController> = new IngredientController(
        ingredientService,
    ) as jest.Mocked<IngredientController>;
    ingredientController.create = jest.fn();
    ingredientController.update = jest.fn();
    ingredientController.delete = jest.fn();
    ingredientController.getAll = jest.fn();
    ingredientController.getById = jest.fn();

    let spyIngredientControllerCreate: jest.SpiedFunction<typeof ingredientController.create>;
    let spyIngredientControllerUpdate: jest.SpiedFunction<typeof ingredientController.update>;
    let spyIngredientControllerDelete: jest.SpiedFunction<typeof ingredientController.delete>;
    let spyIngredientControllerGetAll: jest.SpiedFunction<typeof ingredientController.getAll>;
    let spyIngredientControllerGetById: jest.SpiedFunction<typeof ingredientController.getById>;
    let ingredientHandler: IngredientHandler;

    beforeAll(() => {
        ingredientHandler = new IngredientHandler(ingredientController);
    });

    beforeEach(() => {
        ingredientController.create.mockReset();
        ingredientController.update.mockReset();
        ingredientController.delete.mockReset();
        ingredientController.getAll.mockReset();
    });

    describe('Error cases', () => {
        it('should return the status code 500 when some unexpected error happens', async () => {
            const request = {
                ...ingredientGetAllEventHandler,
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseInternalServerError('some.error');
            ingredientController.getAll = jest.fn().mockRejectedValue(new Error('code-some.error'));
            spyIngredientControllerGetAll = jest.spyOn(ingredientController, 'getAll');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should return the status code 404 when sending a not known request', async () => {
            const request = {
                ...ingredientGetAllEventHandler,
                httpMethod: 'PUT',
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseNotFound();
            spyIngredientControllerCreate = jest.spyOn(ingredientController, 'create');
            spyIngredientControllerUpdate = jest.spyOn(ingredientController, 'update');
            spyIngredientControllerGetAll = jest.spyOn(ingredientController, 'getAll');
            spyIngredientControllerGetById = jest.spyOn(ingredientController, 'getById');
            spyIngredientControllerDelete = jest.spyOn(ingredientController, 'delete');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerCreate).toHaveBeenCalledTimes(0);
            expect(spyIngredientControllerUpdate).toHaveBeenCalledTimes(0);
            expect(spyIngredientControllerGetAll).toHaveBeenCalledTimes(0);
            expect(spyIngredientControllerGetById).toHaveBeenCalledTimes(0);
            expect(spyIngredientControllerDelete).toHaveBeenCalledTimes(0);
            expect(response).toStrictEqual(expectedResponse);
        });
    });

    describe('Success cases', () => {
        it('should call the POST method and return successfully', async () => {
            const request = {
                ...ingredientCreateEventHandler,
                body: JSON.stringify({
                    data: {
                        type: 'ingredient',
                        attributes: {
                            name: 'Cenoura',
                            availableAmount: 50,
                            unitMoneyAmount: 10,
                        },
                    },
                }),
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 201,
                body: JSON.stringify(mockResponseCreateIngredientHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
                body: request.body,
            };
            ingredientController.create = jest.fn().mockResolvedValue(expectedResponse);
            spyIngredientControllerCreate = jest.spyOn(ingredientController, 'create');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerCreate).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerCreate).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the PATCH method and return successfully', async () => {
            const request = {
                ...ingredientUpdateEventHandler,
                body: JSON.stringify({
                    data: {
                        type: 'ingredient',
                        attributes: {
                            name: 'Arroz',
                        },
                    },
                }),
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseUpdateIngredientHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: ingredientUpdateEventHandler.pathParameters?.id ?? '',
                    },
                },
                body: request.body,
            };
            ingredientController.update = jest.fn().mockResolvedValue(expectedResponse);
            spyIngredientControllerUpdate = jest.spyOn(ingredientController, 'update');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerUpdate).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerUpdate).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET BY ID method and return successfully', async () => {
            const request = {
                ...ingredientGetByIdEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetByIdIngredientsHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: ingredientUpdateEventHandler.pathParameters?.id ?? '',
                    },
                },
            };
            ingredientController.getById = jest.fn().mockResolvedValue(expectedResponse);
            spyIngredientControllerGetById = jest.spyOn(ingredientController, 'getById');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerGetById).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerGetById).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET ALL method and return successfully', async () => {
            const request = {
                ...ingredientGetAllEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetAllIngredientController),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };
            ingredientController.getAll = jest.fn().mockResolvedValue(expectedResponse);
            spyIngredientControllerGetAll = jest.spyOn(ingredientController, 'getAll');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the DELETE method and return successfully', async () => {
            const request = {
                ...ingredientDeleteEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseDeleteIngredientController),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    pathParameter: { id: request.pathParameters?.id ?? '' },
                },
            };
            ingredientController.delete = jest.fn().mockResolvedValue(expectedResponse);
            spyIngredientControllerDelete = jest.spyOn(ingredientController, 'delete');

            const response = await ingredientHandler.lambdaIngredientHandler(request);

            expect(spyIngredientControllerDelete).toHaveBeenCalledTimes(1);
            expect(spyIngredientControllerDelete).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });
    });
});
