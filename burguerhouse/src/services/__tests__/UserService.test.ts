import { expect, describe, it } from '@jest/globals';
import { User } from '@prisma/client';
import { UserService } from '../UserService';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { UserCreateModel } from '../../models/user/UserCreateModel';
import { UserResponseModel } from '../../models/user/UserResponseModel';
import { UserUpdateModel } from '../../models/user/UserUpdateModel';

describe('UserService', () => {
    const prismaUserRepository: jest.Mocked<PrismaUserRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        getByEmail: jest.fn(),
    };

    let spyPrismaUserRepositoryCreate: jest.SpiedFunction<typeof prismaUserRepository.create>;
    let spyPrismaUserRepositoryUpdate: jest.SpiedFunction<typeof prismaUserRepository.update>;
    let spyPrismaUserRepositoryDelete: jest.SpiedFunction<typeof prismaUserRepository.delete>;
    let spyPrismaUserRepositoryGetAll: jest.SpiedFunction<typeof prismaUserRepository.getAll>;
    let spyPrismaUserRepositoryGetById: jest.SpiedFunction<typeof prismaUserRepository.getById>;
    let spyPrismaUserRepositoryGetByEmail: jest.SpiedFunction<typeof prismaUserRepository.getByEmail>;
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService(prismaUserRepository);
    });

    beforeEach(() => {
        prismaUserRepository.create.mockReset();
        prismaUserRepository.update.mockReset();
        prismaUserRepository.delete.mockReset();
        prismaUserRepository.getAll.mockReset();
        prismaUserRepository.getById.mockReset();
        prismaUserRepository.getByEmail.mockReset();
    });

    describe('createUser', () => {
        it('should be able to create a new user when the email is valid', async () => {
            const newUserFromRequest: UserCreateModel = {
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: false,
            };
            const userFromRepository: User = {
                id: '1',
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: false,
                createdAt: new Date(),
            };
            const expectedUser: UserResponseModel = {
                id: '1',
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: false,
                orders: [],
            };
            prismaUserRepository.create = jest.fn().mockResolvedValue(userFromRepository);
            prismaUserRepository.getByEmail = jest.fn().mockResolvedValue(null);
            spyPrismaUserRepositoryCreate = jest.spyOn(prismaUserRepository, 'create');
            spyPrismaUserRepositoryGetByEmail = jest.spyOn(prismaUserRepository, 'getByEmail');

            const newUser1 = await userService.createUser(newUserFromRequest);

            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledWith(newUserFromRequest.email);
            expect(spyPrismaUserRepositoryCreate).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryCreate).toHaveBeenCalledWith(newUserFromRequest);
            expect(newUser1).toEqual(expectedUser);
        });

        it('should return an error when trying to create a new user with an existing email', async () => {
            const newUserFromRequest: UserCreateModel = {
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: false,
            };
            const userFromRepository: User = {
                id: '1',
                name: 'John Doe',
                email: 'johndoe@email.com',
                isEmployee: false,
                createdAt: new Date(),
            };
            prismaUserRepository.getByEmail = jest.fn().mockResolvedValue(userFromRepository);
            spyPrismaUserRepositoryCreate = jest.spyOn(prismaUserRepository, 'create');
            spyPrismaUserRepositoryGetByEmail = jest.spyOn(prismaUserRepository, 'getByEmail');

            expect(async () => {
                await userService.createUser(newUserFromRequest);
            }).rejects.toThrow('400 - Existing user email');

            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledWith(newUserFromRequest.email);
            expect(spyPrismaUserRepositoryCreate).toHaveBeenCalledTimes(0);
        });
    });

    describe('updateUser', () => {
        it('should throw the error 404 when the user was not found', async () => {
            const userId = '999';
            const updatedUserFromRequest: UserUpdateModel = {
                name: 'Jose Doe',
                isEmployee: true,
            };

            prismaUserRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
            spyPrismaUserRepositoryGetByEmail = jest.spyOn(prismaUserRepository, 'getByEmail');
            spyPrismaUserRepositoryUpdate = jest.spyOn(prismaUserRepository, 'update');

            expect(async () => {
                await userService.updateUser(userId, updatedUserFromRequest);
            }).rejects.toThrow('404 - User not found');

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledWith(userId);
            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledTimes(0);
            expect(spyPrismaUserRepositoryUpdate).not.toBeCalled();
        });

        it('should throw the error 400 when trying to update the user email with an existing email', async () => {
            const userId = '1';
            const updatedUserFromRequest: UserUpdateModel = {
                name: 'Jose Doe',
                email: 'anotheremail@email.com',
            };
            const userFromRepository: User = {
                id: '1',
                name: 'Jose Doe',
                email: 'johdoe@email.com',
                isEmployee: true,
                createdAt: new Date('2024-01-01'),
            };
            const existingUserEmailFromRepository: User = {
                id: '11',
                name: 'Other User',
                email: 'anotheremail@email.com',
                isEmployee: true,
                createdAt: new Date('2024-01-01'),
            };

            prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
            spyPrismaUserRepositoryUpdate = jest.spyOn(prismaUserRepository, 'update');
            prismaUserRepository.getByEmail = jest.fn().mockResolvedValue(existingUserEmailFromRepository);

            expect(async () => {
                await userService.updateUser(userId, updatedUserFromRequest);
            }).rejects.toThrow('400 - Existing user email');

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledWith(userId);
            expect(spyPrismaUserRepositoryUpdate).not.toBeCalled();
        });

        it('should be able to update a user', async () => {
            const userId = '1';
            const updatedUserFromRequest: UserUpdateModel = {
                name: 'Jose Doe',
                email: 'doejohn@email.com',
                isEmployee: true,
            };
            const userFromRepository: User = {
                id: '1',
                name: 'Jose Doe',
                email: 'johdoe@email.com',
                isEmployee: true,
                createdAt: new Date(),
            };
            const userFromUpdate: User = {
                id: '1',
                name: 'Jose Doe',
                email: 'doejohn@email.com',
                isEmployee: true,
                createdAt: new Date(),
            };
            const expectedUser: UserResponseModel = {
                id: '1',
                name: 'Jose Doe',
                email: 'doejohn@email.com',
                isEmployee: true,
                orders: [],
            };
            prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
            prismaUserRepository.getByEmail = jest.fn().mockResolvedValue(null);
            prismaUserRepository.update = jest.fn().mockResolvedValue(userFromUpdate);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
            spyPrismaUserRepositoryGetByEmail = jest.spyOn(prismaUserRepository, 'getByEmail');
            spyPrismaUserRepositoryUpdate = jest.spyOn(prismaUserRepository, 'update');

            const newUser1 = await userService.updateUser(userId, updatedUserFromRequest);

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledWith(userId);
            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetByEmail).toHaveBeenCalledWith(updatedUserFromRequest.email);
            expect(spyPrismaUserRepositoryUpdate).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryUpdate).toHaveBeenCalledWith(userId, updatedUserFromRequest);
            expect(newUser1).toEqual(expectedUser);
        });
    });

    describe('getAllUsers', () => {
        it('should return an empty array when there is no data', async () => {
            prismaUserRepository.getAll = jest.fn().mockResolvedValue([]);
            spyPrismaUserRepositoryGetAll = jest.spyOn(prismaUserRepository, 'getAll');

            const usersFromService = await userService.getAllUsers();

            expect(spyPrismaUserRepositoryGetAll).toHaveBeenCalledTimes(1);
            expect(usersFromService).toStrictEqual([]);
        });

        it('should return all users', async () => {
            const userFromRepository: User[] = [
                {
                    id: '1',
                    name: 'Jose Doe',
                    email: 'johdoe@email.com',
                    isEmployee: true,
                    createdAt: new Date(),
                },
                {
                    id: '2',
                    name: 'Joao Maria',
                    email: 'joaomaria@email.com',
                    isEmployee: false,
                    createdAt: new Date(),
                },
            ];
            const expectedUser: UserResponseModel[] = [
                {
                    id: '1',
                    name: 'Jose Doe',
                    email: 'johdoe@email.com',
                    isEmployee: true,
                    orders: [],
                },
                {
                    id: '2',
                    name: 'Joao Maria',
                    email: 'joaomaria@email.com',
                    isEmployee: false,
                    orders: [],
                },
            ];
            prismaUserRepository.getAll = jest.fn().mockResolvedValue(userFromRepository);
            spyPrismaUserRepositoryGetAll = jest.spyOn(prismaUserRepository, 'getAll');

            const usersFromService = await userService.getAllUsers();

            expect(spyPrismaUserRepositoryGetAll).toHaveBeenCalledTimes(1);
            expect(usersFromService).toStrictEqual(expectedUser);
        });
    });

    describe('getUserById', () => {
        it('should return an empty object when it doesn`t find the user', async () => {
            const userId = '999';

            prismaUserRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

            const userFromService = await userService.getUserById(userId);

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(userFromService).toStrictEqual({});
        });

        it('should return the desired user', async () => {
            const userId = '12';
            const userFromRepository: User = {
                id: '12',
                name: 'Jose Doe',
                email: 'johdoe@email.com',
                isEmployee: true,
                createdAt: new Date(),
            };

            const expectedUser: UserResponseModel = {
                id: '12',
                name: 'Jose Doe',
                email: 'johdoe@email.com',
                isEmployee: true,
                orders: [],
            };

            prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');

            const userFromService = await userService.getUserById(userId);

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(userFromService).toStrictEqual(expectedUser);
        });
    });

    describe('deleteUser', () => {
        it('should throw an error when the used was not found', async () => {
            const userId = '999';

            prismaUserRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
            spyPrismaUserRepositoryDelete = jest.spyOn(prismaUserRepository, 'delete');

            expect(async () => {
                await userService.deleteUserById(userId);
            }).rejects.toThrow('404 - User not found');

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledWith(userId);
            expect(spyPrismaUserRepositoryDelete).not.toBeCalled();
        });

        it("shouldn't return a response indicating it is a successful request", async () => {
            const userId = '1';
            const userFromRepository: User = {
                id: '1',
                name: 'Jose Doe',
                email: 'johdoe@email.com',
                isEmployee: true,
                createdAt: new Date(),
            };

            prismaUserRepository.getById = jest.fn().mockResolvedValue(userFromRepository);
            spyPrismaUserRepositoryGetById = jest.spyOn(prismaUserRepository, 'getById');
            spyPrismaUserRepositoryDelete = jest.spyOn(prismaUserRepository, 'delete');

            await userService.deleteUserById(userId);

            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryGetById).toHaveBeenCalledWith(userId);
            expect(spyPrismaUserRepositoryDelete).toHaveBeenCalledTimes(1);
            expect(spyPrismaUserRepositoryDelete).toHaveBeenCalledWith(userId);
        });
    });
});
