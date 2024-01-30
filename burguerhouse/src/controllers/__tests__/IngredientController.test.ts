import { expect, describe, it } from '@jest/globals';
import { IngredientController } from '../IngredientController';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { IngredientService } from '../../services/IngredientService';
import { ControllerOptions } from '../typesController';
import {
    mockErrorResponseBadRequest,
    mockErrorResponseConflict,
    mockErrorResponseForbidden,
    mockErrorResponseInternalServerError,
    mockErrorResponseUnsuporttedMediaType,
    mockHeaderRequest,
    mockPathParamsRequest,
    mockPathParamsWithIdRequest,
    mockQueryParamsRequest,
    mockWrongBodyDataAttributeAsNull,
    mockWrongBodyDataPrimaryAttributesRequest,
    mockWrongBodyDataTypeDifferent,
    mockWrongHeaderRequest,
} from './__mocks__/commonController.mock';
import {
    mockBodyRequestCreateIngredientController,
    mockBodyRequestUpdateIngredientController,
    mockInputCreateIngredientService,
    mockInputUpdateIngredientService,
    mockOutputCreateIngredientService,
    mockOutputGetAllIngredientService,
    mockOutputGetByIdIngredientService,
    mockOutputUpdateIngredientService,
    mockResponseCreateIngredientController,
    mockResponseDeleteIngredientController,
    mockResponseGetAllIngredientController,
    mockResponseGetByIdIngredientController,
    mockResponseUpdateIngredientController,
} from './__mocks__/IngredientController.mock';
import { ControllerResponseJsonAPI, JsonAPIProjectTypesEnum } from '../../utils/jsonapi/typesJsonapi';
import { IngredientCreateModel } from '../../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../../models/ingredient/IngredientUpdateModel';

describe('IngredientController', () => {
    const ingredientRepository: jest.Mocked<PrismaIngredientRepository> =
        new PrismaIngredientRepository() as jest.Mocked<PrismaIngredientRepository>;
    const ingredientService: jest.Mocked<IngredientService> = new IngredientService(
        ingredientRepository,
    ) as jest.Mocked<IngredientService>;
    ingredientService.createIngredient = jest.fn();
    ingredientService.updateIngredient = jest.fn();
    ingredientService.deleteIngredientById = jest.fn();
    ingredientService.getAllIngredients = jest.fn();
    ingredientService.getIngredientById = jest.fn();

    let spyIngredientServiceCreate: jest.SpiedFunction<typeof ingredientService.createIngredient>;
    let spyIngredientServiceUpdate: jest.SpiedFunction<typeof ingredientService.updateIngredient>;
    let spyIngredientServiceDelete: jest.SpiedFunction<typeof ingredientService.deleteIngredientById>;
    let spyIngredientServiceGetAll: jest.SpiedFunction<typeof ingredientService.getAllIngredients>;
    let spyIngredientServiceGetById: jest.SpiedFunction<typeof ingredientService.getIngredientById>;
    let ingredientController: IngredientController;

    beforeAll(() => {
        ingredientController = new IngredientController(ingredientService);
    });

    beforeEach(() => {
        ingredientService.createIngredient.mockReset();
        ingredientService.updateIngredient.mockReset();
        ingredientService.deleteIngredientById.mockReset();
        ingredientService.getAllIngredients.mockReset();
        ingredientService.getIngredientById.mockReset();
    });

    describe('create', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the wrong data primary attributes', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataPrimaryAttributesRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the data attribute as null', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataAttributeAsNull),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it("should return the status code 409 when passing the type different from 'ingredient'", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict();

                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond data', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.ingredient;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict();

                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['name', '', mockErrorResponseForbidden()],
                ['availableAmount', undefined, mockErrorResponseForbidden()],
                ['unitMoneyAmount', undefined, mockErrorResponseForbidden()],
            ])(
                'should return the status code 403 when passing wrong %s in ingredient data',
                async (key, input, expected) => {
                    const wrongData = {
                        ...mockBodyRequestCreateIngredientController,
                        data: {
                            ...mockBodyRequestCreateIngredientController.data,
                            attributes: {
                                ...mockBodyRequestCreateIngredientController.data.attributes,
                                [key]: input,
                            },
                        },
                    };
                    const request: ControllerOptions = {
                        header: JSON.stringify(mockHeaderRequest),
                        body: JSON.stringify(wrongData),
                        params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                    };
                    const expectedResponse: ControllerResponseJsonAPI = expected;

                    spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                    const ingredientResponse = await ingredientController.create(request);

                    expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(0);
                    expect(ingredientResponse).toStrictEqual(expectedResponse);
                },
            );

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                ingredientService.createIngredient = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(1);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response when the ingredient is created', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const serviceInput: IngredientCreateModel = mockInputCreateIngredientService;
                const serviceResponse: IngredientResponseModel = mockOutputCreateIngredientService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 201,
                    body: JSON.stringify(mockResponseCreateIngredientController),
                };
                ingredientService.createIngredient = jest.fn().mockResolvedValue(serviceResponse);
                spyIngredientServiceCreate = jest.spyOn(ingredientService, 'createIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceCreate).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceCreate).toHaveBeenCalledWith(serviceInput);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('update', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing the wrong id', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataPrimaryAttributesRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: { id: '' } },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the data attribute as null', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataAttributeAsNull),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it("should return the status code 409 when passing the type different from 'ingredient'", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond data', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.people;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.create(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when the id from params is different from the id of the data', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateIngredientController,
                    data: {
                        ...mockBodyRequestUpdateIngredientController.data,
                        id: '2',
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing wrong id inside data', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateIngredientController,
                    data: {
                        ...mockBodyRequestUpdateIngredientController.data,
                        id: undefined,
                        attributes: {
                            ...mockBodyRequestUpdateIngredientController.data.attributes,
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing wrong name, unitMoneyAmount and availableAmount in ingredient data', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateIngredientController,
                    data: {
                        ...mockBodyRequestUpdateIngredientController.data,
                        attributes: {
                            ...mockBodyRequestUpdateIngredientController.data.attributes,
                            availableAmount: undefined,
                            unitMoneyAmount: undefined,
                            name: undefined,
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing any data different from name, unitMoneyAmount and availableAmount', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateIngredientController,
                    data: {
                        ...mockBodyRequestUpdateIngredientController.data,
                        attributes: {
                            ...mockBodyRequestUpdateIngredientController.data.attributes,
                            someInformation: '',
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestUpdateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                ingredientService.updateIngredient = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(1);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response when the ingredient is updated', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestUpdateIngredientController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceInput: IngredientUpdateModel = mockInputUpdateIngredientService;
                const serviceResponse: IngredientResponseModel = mockOutputUpdateIngredientService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseUpdateIngredientController),
                };
                ingredientService.updateIngredient = jest.fn().mockResolvedValue(serviceResponse);
                spyIngredientServiceUpdate = jest.spyOn(ingredientService, 'updateIngredient');

                const ingredientResponse = await ingredientController.update(request);

                expect(spyIngredientServiceUpdate).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceUpdate).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id, serviceInput);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getAll', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyIngredientServiceGetAll = jest.spyOn(ingredientService, 'getAllIngredients');

                const ingredientResponse = await ingredientController.getAll(request);

                expect(spyIngredientServiceGetAll).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['include', {}],
                ['fields', {}],
                ['page', {}],
            ])('should return the status code 400 when passing the %s query params', async (key, value) => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { [key]: value }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyIngredientServiceGetAll = jest.spyOn(ingredientService, 'getAllIngredients');

                const ingredientResponse = await ingredientController.getAll(request);

                expect(spyIngredientServiceGetAll).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                ingredientService.getAllIngredients = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyIngredientServiceGetAll = jest.spyOn(ingredientService, 'getAllIngredients');

                const ingredientResponse = await ingredientController.getAll(request);

                expect(spyIngredientServiceGetAll).toHaveBeenCalledTimes(1);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with all the ingredients', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: IngredientResponseModel[] = mockOutputGetAllIngredientService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetAllIngredientController),
                };
                ingredientService.getAllIngredients = jest.fn().mockResolvedValue(serviceResponse);
                spyIngredientServiceGetAll = jest.spyOn(ingredientService, 'getAllIngredients');

                const ingredientResponse = await ingredientController.getAll(request);

                expect(spyIngredientServiceGetAll).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceGetAll).toHaveBeenCalledWith({});
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getById', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyIngredientServiceGetById = jest.spyOn(ingredientService, 'getIngredientById');

                const ingredientResponse = await ingredientController.getById(request);

                expect(spyIngredientServiceGetById).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['include', {}],
                ['fields', {}],
                ['page', {}],
            ])('should return the status code 400 when passing the %s query params', async (key, value) => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { [key]: value }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest();

                spyIngredientServiceGetById = jest.spyOn(ingredientService, 'getIngredientById');

                const ingredientResponse = await ingredientController.getAll(request);

                expect(spyIngredientServiceGetById).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceGetById = jest.spyOn(ingredientService, 'getIngredientById');

                const ingredientResponse = await ingredientController.getById(request);

                expect(spyIngredientServiceGetById).toHaveBeenCalledTimes(0);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                ingredientService.getIngredientById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyIngredientServiceGetById = jest.spyOn(ingredientService, 'getIngredientById');

                const ingredientResponse = await ingredientController.getById(request);

                expect(spyIngredientServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceGetById).toBeCalledWith(mockPathParamsWithIdRequest.id);
                expect(ingredientResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with the specific ingredient', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: IngredientResponseModel = mockOutputGetByIdIngredientService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetByIdIngredientController),
                };
                ingredientService.getIngredientById = jest.fn().mockResolvedValue(serviceResponse);
                spyIngredientServiceGetById = jest.spyOn(ingredientService, 'getIngredientById');

                const IngredientResponse = await ingredientController.getById(request);

                expect(spyIngredientServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceGetById).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id);
                expect(IngredientResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('delete', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyIngredientServiceDelete = jest.spyOn(ingredientService, 'deleteIngredientById');

                const userResponse = await ingredientController.delete(request);

                expect(spyIngredientServiceDelete).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden();

                spyIngredientServiceDelete = jest.spyOn(ingredientService, 'deleteIngredientById');

                const userResponse = await ingredientController.delete(request);

                expect(spyIngredientServiceDelete).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                ingredientService.deleteIngredientById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyIngredientServiceDelete = jest.spyOn(ingredientService, 'deleteIngredientById');

                const userResponse = await ingredientController.delete(request);

                expect(spyIngredientServiceDelete).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseDeleteIngredientController),
                };
                spyIngredientServiceDelete = jest.spyOn(ingredientService, 'deleteIngredientById');

                const userResponse = await ingredientController.delete(request);

                expect(spyIngredientServiceDelete).toHaveBeenCalledTimes(1);
                expect(spyIngredientServiceDelete).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });
});
