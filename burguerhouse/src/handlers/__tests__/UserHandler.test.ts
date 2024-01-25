import { describe, it, expect } from '@jest/globals';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/UserService';
import { UserHandler } from '../UserHandler';
import {
    mockResponseCreateUserHandler,
    mockResponseDeleteUserController,
    mockResponseGetAllUserController,
    mockResponseGetByIdUserHandler,
    mockResponseGetRelationUserHandler,
    mockResponseUpdateUserHandler,
    userCreateEventHandler,
    userDeleteEventHandler,
    userGetAllEventHandler,
    userGetByIdEventHandler,
    userGetRelationByIdEventHandler,
    userUpdateEventHandler,
} from './__mocks__/UserHandler.mock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ControllerOptions } from '../../controllers/typesController';
import {
    mockErrorResponseInternalServerError,
    mockErrorResponseNotFound,
} from '../../controllers/__tests__/__mocks__/commonController.mock';

describe('UserHandler', () => {
    const userRepository: jest.Mocked<PrismaUserRepository> =
        new PrismaUserRepository() as jest.Mocked<PrismaUserRepository>;
    const userService: jest.Mocked<UserService> = new UserService(userRepository) as jest.Mocked<UserService>;
    const userController: jest.Mocked<UserController> = new UserController(userService) as jest.Mocked<UserController>;
    userController.create = jest.fn();
    userController.update = jest.fn();
    userController.delete = jest.fn();
    userController.getAll = jest.fn();
    userController.getById = jest.fn();
    userController.getRelationshipById = jest.fn();

    let spyUserControllerCreate: jest.SpiedFunction<typeof userController.create>;
    let spyUserControllerUpdate: jest.SpiedFunction<typeof userController.update>;
    let spyUserControllerDelete: jest.SpiedFunction<typeof userController.delete>;
    let spyUserControllerGetAll: jest.SpiedFunction<typeof userController.getAll>;
    let spyUserControllerGetById: jest.SpiedFunction<typeof userController.getById>;
    let spyUserControllerGetRelationById: jest.SpiedFunction<typeof userController.getRelationshipById>;
    let userHandler: UserHandler;

    beforeAll(() => {
        userHandler = new UserHandler(userController);
    });

    beforeEach(() => {
        userController.create.mockReset();
        userController.update.mockReset();
        userController.delete.mockReset();
        userController.getAll.mockReset();
        userController.getRelationshipById.mockReset();
    });

    describe('Error cases', () => {
        it('should return the status code 500 when some unexpected error happens', async () => {
            const request = {
                ...userGetAllEventHandler,
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseInternalServerError('some.error');
            userController.getAll = jest.fn().mockRejectedValue(new Error('code-some.error'));
            spyUserControllerGetAll = jest.spyOn(userController, 'getAll');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyUserControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should return the status code 404 when sending a not known request', async () => {
            const request = {
                ...userGetAllEventHandler,
                httpMethod: 'PUT',
            };

            const expectedResponse: APIGatewayProxyResult = mockErrorResponseNotFound();
            spyUserControllerCreate = jest.spyOn(userController, 'create');
            spyUserControllerUpdate = jest.spyOn(userController, 'update');
            spyUserControllerGetAll = jest.spyOn(userController, 'getAll');
            spyUserControllerGetById = jest.spyOn(userController, 'getById');
            spyUserControllerGetRelationById = jest.spyOn(userController, 'getRelationshipById');
            spyUserControllerDelete = jest.spyOn(userController, 'delete');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerCreate).toHaveBeenCalledTimes(0);
            expect(spyUserControllerUpdate).toHaveBeenCalledTimes(0);
            expect(spyUserControllerGetAll).toHaveBeenCalledTimes(0);
            expect(spyUserControllerGetById).toHaveBeenCalledTimes(0);
            expect(spyUserControllerGetRelationById).toHaveBeenCalledTimes(0);
            expect(spyUserControllerDelete).toHaveBeenCalledTimes(0);
            expect(response).toStrictEqual(expectedResponse);
        });
    });

    describe('Successful cases', () => {
        it('should call the POST method and return successfully', async () => {
            const request = {
                ...userCreateEventHandler,
                body: JSON.stringify({
                    data: {
                        type: 'people',
                        attributes: {
                            name: 'John Doe',
                            email: 'johndoe@email.com',
                            isEmployee: true,
                        },
                    },
                }),
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 201,
                body: JSON.stringify(mockResponseCreateUserHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
                body: request.body,
            };
            userController.create = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerCreate = jest.spyOn(userController, 'create');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerCreate).toHaveBeenCalledTimes(1);
            expect(spyUserControllerCreate).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the PATCH method and return successfully', async () => {
            const request = {
                ...userUpdateEventHandler,
                body: JSON.stringify({
                    data: {
                        type: 'people',
                        attributes: {
                            name: 'John',
                        },
                    },
                }),
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseUpdateUserHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: userUpdateEventHandler.pathParameters?.id ?? '',
                    },
                },
                body: request.body,
            };
            userController.update = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerUpdate = jest.spyOn(userController, 'update');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerUpdate).toHaveBeenCalledTimes(1);
            expect(spyUserControllerUpdate).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET RELATION BY ID method and return successfully', async () => {
            const request = {
                ...userGetRelationByIdEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetRelationUserHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: userUpdateEventHandler.pathParameters?.id ?? '',
                    },
                },
            };
            userController.getRelationshipById = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerGetRelationById = jest.spyOn(userController, 'getRelationshipById');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerGetRelationById).toHaveBeenCalledTimes(1);
            expect(spyUserControllerGetRelationById).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET BY ID method and return successfully', async () => {
            const request = {
                ...userGetByIdEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetByIdUserHandler),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                    pathParameter: {
                        id: userUpdateEventHandler.pathParameters?.id ?? '',
                    },
                },
            };
            userController.getById = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerGetById = jest.spyOn(userController, 'getById');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerGetById).toHaveBeenCalledTimes(1);
            expect(spyUserControllerGetById).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the GET ALL method and return successfully', async () => {
            const request = {
                ...userGetAllEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseGetAllUserController),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    queryParameter: {},
                },
            };
            userController.getAll = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerGetAll = jest.spyOn(userController, 'getAll');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerGetAll).toHaveBeenCalledTimes(1);
            expect(spyUserControllerGetAll).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });

        it('should call the DELETE method and return successfully', async () => {
            const request = {
                ...userDeleteEventHandler,
            };
            const expectedResponse: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(mockResponseDeleteUserController),
            };
            const controllerInput: ControllerOptions = {
                header: JSON.stringify(request.headers),
                params: {
                    pathParameter: { id: request.pathParameters?.id ?? '' },
                },
            };
            userController.delete = jest.fn().mockResolvedValue(expectedResponse);
            spyUserControllerDelete = jest.spyOn(userController, 'delete');

            const response = await userHandler.lambdaUserHandler(request);

            expect(spyUserControllerDelete).toHaveBeenCalledTimes(1);
            expect(spyUserControllerDelete).toHaveBeenCalledWith(controllerInput);
            expect(response).toStrictEqual(expectedResponse);
        });
    });
});
