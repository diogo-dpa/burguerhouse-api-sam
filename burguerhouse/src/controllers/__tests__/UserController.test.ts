import { expect, describe, it } from '@jest/globals';
import { UserService } from '../../services/UserService';
import { UserController } from '../UserController';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { ControllerOptions } from '../typesController';
import { UserResponseModel } from '../../models/user/UserResponseModel';
import { ControllerResponseJsonAPI, JsonAPIProjectTypesEnum } from '../../utils/jsonapi/typesJsonapi';
import { UserCreateModel } from '../../models/user/UserCreateModel';
import {
    mockBodyRequestCreateUserController,
    mockBodyRequestUpdateUserController,
    mockInputCreateUserService,
    mockInputUpdateUserService,
    mockOutputCreateUserService,
    mockOutputGetAllUserService,
    mockOutputGetByIdUserService,
    mockOutputGetRelatonshipByIdUserService,
    mockOutputUpdateUserService,
    mockResponseCreateUserController,
    mockResponseDeleteUserController,
    mockResponseGetAllUserController,
    mockResponseGetByIdUserController,
    mockResponseGetRelationshipByIdUserController,
    mockResponseUpdateUserController,
} from './__mocks__/UserController.mock';
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
import { UserUpdateModel } from '../../models/user/UserUpdateModel';

describe('UserController', () => {
    const userRepository: jest.Mocked<PrismaUserRepository> =
        new PrismaUserRepository() as jest.Mocked<PrismaUserRepository>;
    const userService: jest.Mocked<UserService> = new UserService(userRepository) as jest.Mocked<UserService>;
    userService.createUser = jest.fn();
    userService.updateUser = jest.fn();
    userService.deleteUserById = jest.fn();
    userService.getAllUsers = jest.fn();
    userService.getUserById = jest.fn();

    let spyUserServiceCreate: jest.SpiedFunction<typeof userService.createUser>;
    let spyUserServiceUpdate: jest.SpiedFunction<typeof userService.updateUser>;
    let spyUserServiceDelete: jest.SpiedFunction<typeof userService.deleteUserById>;
    let spyUserServiceGetAll: jest.SpiedFunction<typeof userService.getAllUsers>;
    let spyUserServiceGetById: jest.SpiedFunction<typeof userService.getUserById>;
    let userController: UserController;

    beforeAll(() => {
        userController = new UserController(userService);
    });

    beforeEach(() => {
        userService.createUser.mockReset();
        userService.updateUser.mockReset();
        userService.deleteUserById.mockReset();
        userService.getAllUsers.mockReset();
        userService.getUserById.mockReset();
    });

    describe('create', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the wrong data primary attributes', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataPrimaryAttributesRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the data attribute as null', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataAttributeAsNull),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it("should return the status code 409 when passing the type different from 'people'", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict;

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond data', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.people;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict;

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it.each([
                ['name', '', mockErrorResponseForbidden],
                ['email', '', mockErrorResponseForbidden],
                ['isEmployee', undefined, mockErrorResponseForbidden],
            ])('should return the status code 403 when passing wrong %s in user data', async (key, input, expected) => {
                const wrongData = {
                    ...mockBodyRequestCreateUserController,
                    data: {
                        ...mockBodyRequestCreateUserController.data,
                        attributes: {
                            ...mockBodyRequestCreateUserController.data.attributes,
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

                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.createUser = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response when the user is created', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const serviceInput: UserCreateModel = mockInputCreateUserService;
                const serviceResponse: UserResponseModel = mockOutputCreateUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 201,
                    body: JSON.stringify(mockResponseCreateUserController),
                };
                userService.createUser = jest.fn().mockResolvedValue(serviceResponse);
                spyUserServiceCreate = jest.spyOn(userService, 'createUser');

                const userResponse = await userController.create(request);

                expect(spyUserServiceCreate).toHaveBeenCalledTimes(1);
                expect(spyUserServiceCreate).toHaveBeenCalledWith(serviceInput);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('update', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    body: JSON.stringify(mockBodyRequestCreateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing the wrong id', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataPrimaryAttributesRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: { id: '' } },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the data attribute as null', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataAttributeAsNull),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it("should return the status code 409 when passing the type different from 'people'", async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when passing any attribute beyond data', async () => {
                mockWrongBodyDataTypeDifferent.data.type = JsonAPIProjectTypesEnum.people;
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockWrongBodyDataTypeDifferent),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 409 when the id from params is different from the id of the data', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateUserController,
                    data: {
                        ...mockBodyRequestUpdateUserController.data,
                        id: '2',
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseConflict;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing wrong name, email and isEmployee in user data', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateUserController,
                    data: {
                        ...mockBodyRequestUpdateUserController.data,
                        attributes: {
                            ...mockBodyRequestCreateUserController.data.attributes,
                            isEmployee: undefined,
                            email: undefined,
                            name: undefined,
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when passing any data different from name, email and isEmployee', async () => {
                const wrongData = {
                    ...mockBodyRequestUpdateUserController,
                    data: {
                        ...mockBodyRequestUpdateUserController.data,
                        attributes: {
                            ...mockBodyRequestUpdateUserController.data.attributes,
                            someInformation: '',
                        },
                    },
                };
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(wrongData),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestUpdateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.updateUser = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response when the user is updated', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    body: JSON.stringify(mockBodyRequestUpdateUserController),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceInput: UserUpdateModel = mockInputUpdateUserService;
                const serviceResponse: UserResponseModel = mockOutputUpdateUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseUpdateUserController),
                };
                userService.updateUser = jest.fn().mockResolvedValue(serviceResponse);
                spyUserServiceUpdate = jest.spyOn(userService, 'updateUser');

                const userResponse = await userController.update(request);

                expect(spyUserServiceUpdate).toHaveBeenCalledTimes(1);
                expect(spyUserServiceUpdate).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id, serviceInput);
                expect(userResponse).toStrictEqual(expectedResponse);
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

                spyUserServiceGetAll = jest.spyOn(userService, 'getAllUsers');

                const userResponse = await userController.getAll(request);

                expect(spyUserServiceGetAll).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
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
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetAll = jest.spyOn(userService, 'getAllUsers');

                const userResponse = await userController.getAll(request);

                expect(spyUserServiceGetAll).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.getAllUsers = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceGetAll = jest.spyOn(userService, 'getAllUsers');

                const userResponse = await userController.getAll(request);

                expect(spyUserServiceGetAll).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with all the users', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: UserResponseModel[] = mockOutputGetAllUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetAllUserController),
                };
                userService.getAllUsers = jest.fn().mockResolvedValue(serviceResponse);
                spyUserServiceGetAll = jest.spyOn(userService, 'getAllUsers');

                const userResponse = await userController.getAll(request);

                expect(spyUserServiceGetAll).toHaveBeenCalledTimes(1);
                expect(spyUserServiceGetAll).toHaveBeenCalledWith({});
                expect(userResponse).toStrictEqual(expectedResponse);
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

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the include query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { include: {} }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the fields query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: { fields: {} as Record<string, string>[] },
                        pathParameter: mockPathParamsRequest,
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the page query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: { page: {} as Record<string, string>[] },
                        pathParameter: mockPathParamsRequest,
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.getUserById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with the specific user', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: UserResponseModel = mockOutputGetByIdUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetByIdUserController),
                };
                userService.getUserById = jest.fn().mockResolvedValue(serviceResponse);
                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyUserServiceGetById).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id, {});
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });

    describe('getRelationshipById', () => {
        describe('Error cases', () => {
            it('should return the status code 415 when passing the wrong content type in header', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockWrongHeaderRequest),
                    params: { queryParameter: mockQueryParamsRequest, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseUnsuporttedMediaType;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the include query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: { include: {} }, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the fields query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: { fields: {} as Record<string, string>[] },
                        pathParameter: mockPathParamsRequest,
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the filter query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: { filter: {} as Record<string, string>[] },
                        pathParameter: mockPathParamsRequest,
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 400 when passing the page query params', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: {
                        queryParameter: { page: {} as Record<string, string>[] },
                        pathParameter: mockPathParamsRequest,
                    },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseBadRequest;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.getUserById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(1);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });

        describe('Success cases', () => {
            it('should return a success response with the relations of the specific user', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const serviceResponse: UserResponseModel = mockOutputGetRelatonshipByIdUserService;
                const expectedResponse: ControllerResponseJsonAPI = {
                    statusCode: 200,
                    body: JSON.stringify(mockResponseGetRelationshipByIdUserController),
                };
                userService.getUserById = jest.fn().mockResolvedValue(serviceResponse);
                spyUserServiceGetById = jest.spyOn(userService, 'getUserById');

                const userResponse = await userController.getRelationshipById(request);

                expect(spyUserServiceGetById).toHaveBeenCalledTimes(1);
                expect(spyUserServiceGetById).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id, {
                    include: { orders: true },
                });
                expect(userResponse).toStrictEqual(expectedResponse);
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

                spyUserServiceDelete = jest.spyOn(userService, 'deleteUserById');

                const userResponse = await userController.delete(request);

                expect(spyUserServiceDelete).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 403 when the id in the params is invalid', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseForbidden;

                spyUserServiceDelete = jest.spyOn(userService, 'deleteUserById');

                const userResponse = await userController.delete(request);

                expect(spyUserServiceDelete).toHaveBeenCalledTimes(0);
                expect(userResponse).toStrictEqual(expectedResponse);
            });

            it('should return the status code 500 when some unexpected error happens', async () => {
                const request: ControllerOptions = {
                    header: JSON.stringify(mockHeaderRequest),
                    params: { queryParameter: {}, pathParameter: mockPathParamsWithIdRequest },
                };
                const expectedResponse: ControllerResponseJsonAPI = mockErrorResponseInternalServerError('some.error');

                userService.deleteUserById = jest.fn().mockRejectedValue(new Error('code-some.error'));
                spyUserServiceDelete = jest.spyOn(userService, 'deleteUserById');

                const userResponse = await userController.delete(request);

                expect(spyUserServiceDelete).toHaveBeenCalledTimes(1);
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
                    body: JSON.stringify(mockResponseDeleteUserController),
                };
                spyUserServiceDelete = jest.spyOn(userService, 'deleteUserById');

                const userResponse = await userController.delete(request);

                expect(spyUserServiceDelete).toHaveBeenCalledTimes(1);
                expect(spyUserServiceDelete).toHaveBeenCalledWith(mockPathParamsWithIdRequest.id);
                expect(userResponse).toStrictEqual(expectedResponse);
            });
        });
    });
});
