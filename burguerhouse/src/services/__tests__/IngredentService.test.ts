import { describe, it, expect } from '@jest/globals';
import { PrismaIngredientRepository } from '../../repositories/prisma/PrismaIngredientRepository';
import { IngredientService } from '../IngredientService';
import { IngredientCreateModel } from '../../models/ingredient/IngredientCreateModel';
import { Ingredients } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IngredientResponseModel } from '../../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../../models/ingredient/IngredientUpdateModel';

describe('Ingredient Service', () => {
    const prismaIngredientRepository: jest.Mocked<PrismaIngredientRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        getByName: jest.fn(),
    };

    let spyPrismaIngredientRepositoryCreate: jest.SpiedFunction<typeof prismaIngredientRepository.create>;
    let spyPrismaIngredientRepositoryUpdate: jest.SpiedFunction<typeof prismaIngredientRepository.update>;
    let spyPrismaIngredientRepositoryDelete: jest.SpiedFunction<typeof prismaIngredientRepository.delete>;
    let spyPrismaIngredientRepositoryGetAll: jest.SpiedFunction<typeof prismaIngredientRepository.getAll>;
    let spyPrismaIngredientRepositoryGetById: jest.SpiedFunction<typeof prismaIngredientRepository.getById>;
    let spyPrismaIngredientRepositoryGetByName: jest.SpiedFunction<typeof prismaIngredientRepository.getByName>;
    let ingredientService: IngredientService;

    beforeAll(() => {
        ingredientService = new IngredientService(prismaIngredientRepository);
    });

    beforeEach(() => {
        prismaIngredientRepository.create.mockReset();
        prismaIngredientRepository.update.mockReset();
        prismaIngredientRepository.delete.mockReset();
        prismaIngredientRepository.getAll.mockReset();
        prismaIngredientRepository.getById.mockReset();
    });

    describe('createIngredient', () => {
        describe('Error cases', () => {
            it('should return an error when trying to create a new user with an existing email', async () => {
                const newIngredientFromRequest: IngredientCreateModel = {
                    name: 'Cebola',
                    availableAmount: 10,
                    unitMoneyAmount: 1,
                };
                const ingredientFromRepository: Ingredients = {
                    id: '1',
                    name: 'Cebola',
                    availableAmount: 12,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                prismaIngredientRepository.getByName = jest.fn().mockResolvedValue(ingredientFromRepository);
                spyPrismaIngredientRepositoryGetByName = jest.spyOn(prismaIngredientRepository, 'getByName');
                spyPrismaIngredientRepositoryCreate = jest.spyOn(prismaIngredientRepository, 'create');

                expect(async () => {
                    await ingredientService.createIngredient(newIngredientFromRequest);
                }).rejects.toThrow('400 - Existing ingredient name');

                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledWith(newIngredientFromRequest.name);
                expect(spyPrismaIngredientRepositoryCreate).toHaveBeenCalledTimes(0);
            });
        });

        describe('Success cases', () => {
            it('should be able to create a new user when the email is valid', async () => {
                const newIngredientFromRequest: IngredientCreateModel = {
                    name: 'Cenoura',
                    availableAmount: 10,
                    unitMoneyAmount: 1,
                };
                const ingredientFromRepository: Ingredients = {
                    id: '1',
                    name: 'Cenoura',
                    availableAmount: 12,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const expectedIngredient: IngredientResponseModel = {
                    id: '1',
                    name: 'Cenoura',
                    availableAmount: 12,
                    unitMoneyAmount: 3,
                };
                prismaIngredientRepository.create = jest.fn().mockResolvedValue(ingredientFromRepository);
                prismaIngredientRepository.getByName = jest.fn().mockResolvedValue(null);
                spyPrismaIngredientRepositoryCreate = jest.spyOn(prismaIngredientRepository, 'create');
                spyPrismaIngredientRepositoryGetByName = jest.spyOn(prismaIngredientRepository, 'getByName');

                const newUser1 = await ingredientService.createIngredient(newIngredientFromRequest);

                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledWith(newIngredientFromRequest.name);
                expect(spyPrismaIngredientRepositoryCreate).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryCreate).toHaveBeenCalledWith(newIngredientFromRequest);
                expect(newUser1).toEqual(expectedIngredient);
            });
        });
    });

    describe('updateIngredient', () => {
        describe('Error cases', () => {
            it('should throw the error 404 when the ingredient was not found', async () => {
                const ingredientId = '999';
                const newIngredientFromRequest: IngredientUpdateModel = {
                    name: 'Alho',
                };

                prismaIngredientRepository.getById = jest.fn().mockResolvedValue(null);
                spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
                spyPrismaIngredientRepositoryGetByName = jest.spyOn(prismaIngredientRepository, 'getByName');
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                expect(async () => {
                    await ingredientService.updateIngredient(ingredientId, newIngredientFromRequest);
                }).rejects.toThrow('404 - Ingredient not found');

                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId);
                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledTimes(0);
                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(0);
            });

            it('should throw the error 400 when trying to update the ingredient name with an existing name', async () => {
                const ingredientId = '999';
                const newIngredientFromRequest: IngredientUpdateModel = {
                    name: 'Alho',
                };
                const ingredientFromRepository: Ingredients = {
                    id: '1',
                    name: 'Cebola',
                    availableAmount: 12,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const existingIngredientNameFromRepository: Ingredients = {
                    id: '11',
                    name: 'Alho',
                    availableAmount: 2,
                    unitMoneyAmount: 5 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                prismaIngredientRepository.getById = jest.fn().mockResolvedValue(ingredientFromRepository);
                spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
                prismaIngredientRepository.getByName = jest
                    .fn()
                    .mockResolvedValue(existingIngredientNameFromRepository);
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                expect(async () => {
                    await ingredientService.updateIngredient(ingredientId, newIngredientFromRequest);
                }).rejects.toThrow('400 - Existing ingredient name');

                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId);
                expect(spyPrismaIngredientRepositoryUpdate).not.toBeCalled();
            });

            it('should be able to update an ingredient', async () => {
                const ingredientId = '1';
                const updatedIngredientFromRequest: IngredientUpdateModel = {
                    name: 'Couve flor',
                    availableAmount: 3,
                };
                const ingredientFromRepository: Ingredients = {
                    id: '1',
                    name: 'Cebola',
                    availableAmount: 12,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const ingredientFromUpdate: Ingredients = {
                    id: '1',
                    name: 'Couve flor',
                    availableAmount: 3,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const expectedUser: IngredientResponseModel = {
                    id: '1',
                    name: 'Couve flor',
                    availableAmount: 3,
                    unitMoneyAmount: 3,
                };
                prismaIngredientRepository.getById = jest.fn().mockResolvedValue(ingredientFromRepository);
                prismaIngredientRepository.getByName = jest.fn().mockResolvedValue(null);
                prismaIngredientRepository.update = jest.fn().mockResolvedValue(ingredientFromUpdate);
                spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
                spyPrismaIngredientRepositoryGetByName = jest.spyOn(prismaIngredientRepository, 'getByName');
                spyPrismaIngredientRepositoryUpdate = jest.spyOn(prismaIngredientRepository, 'update');

                const newIngredient1 = await ingredientService.updateIngredient(
                    ingredientId,
                    updatedIngredientFromRequest,
                );

                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId);
                expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryGetByName).toHaveBeenCalledWith(updatedIngredientFromRequest.name);
                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledTimes(1);
                expect(spyPrismaIngredientRepositoryUpdate).toHaveBeenCalledWith(
                    ingredientId,
                    updatedIngredientFromRequest,
                );
                expect(newIngredient1).toEqual(expectedUser);
            });
        });
    });

    describe('getAllIngredients', () => {
        it('should return an empty array when there is no data', async () => {
            prismaIngredientRepository.getAll = jest.fn().mockResolvedValue([]);
            spyPrismaIngredientRepositoryGetAll = jest.spyOn(prismaIngredientRepository, 'getAll');

            const ingredientsFromService = await ingredientService.getAllIngredients();

            expect(spyPrismaIngredientRepositoryGetAll).toHaveBeenCalledTimes(1);
            expect(ingredientsFromService).toStrictEqual([]);
        });

        it('should return all ingredients', async () => {
            const ingredientFromRepository: Ingredients[] = [
                {
                    id: '1',
                    name: 'Cebola',
                    availableAmount: 12,
                    unitMoneyAmount: 3 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: '2',
                    name: 'Brocolis',
                    availableAmount: 50,
                    unitMoneyAmount: 12 as unknown as Decimal,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            const expectedIngredient: IngredientResponseModel[] = [
                {
                    id: '1',
                    name: 'Cebola',
                    availableAmount: 12,
                    unitMoneyAmount: 3,
                },
                {
                    id: '2',
                    name: 'Brocolis',
                    availableAmount: 50,
                    unitMoneyAmount: 12,
                },
            ];
            prismaIngredientRepository.getAll = jest.fn().mockResolvedValue(ingredientFromRepository);
            spyPrismaIngredientRepositoryGetAll = jest.spyOn(prismaIngredientRepository, 'getAll');

            const ingredientsFromService = await ingredientService.getAllIngredients();

            expect(spyPrismaIngredientRepositoryGetAll).toHaveBeenCalledTimes(1);
            expect(ingredientsFromService).toStrictEqual(expectedIngredient);
        });
    });

    describe('getIngredientById', () => {
        const queryOptions = { sort: undefined, include: undefined, page: undefined, fields: undefined };
        it('should return an error when the ingredient was not found', async () => {
            const ingredientId = '999';
            prismaIngredientRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');

            const ingredientFromService = await ingredientService.getIngredientById(ingredientId);

            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId, queryOptions);
            expect(ingredientFromService).toStrictEqual({});
        });

        it('should return the ingredient when it was found', async () => {
            const ingredientId = '1';
            const ingredientFromRepository: Ingredients = {
                id: '1',
                name: 'Cebola',
                availableAmount: 12,
                unitMoneyAmount: 3 as unknown as Decimal,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const expectedIngredient: IngredientResponseModel = {
                id: '1',
                name: 'Cebola',
                availableAmount: 12,
                unitMoneyAmount: 3,
            };
            prismaIngredientRepository.getById = jest.fn().mockResolvedValue(ingredientFromRepository);
            spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');

            const ingredientFromService = await ingredientService.getIngredientById(ingredientId);

            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId, queryOptions);
            expect(ingredientFromService).toStrictEqual(expectedIngredient);
        });
    });

    describe('deleteIngredientById', () => {
        it('should throw an error when the ingredient was not found', async () => {
            const ingredientId = '999';
            prismaIngredientRepository.getById = jest.fn().mockResolvedValue(null);
            spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
            spyPrismaIngredientRepositoryDelete = jest.spyOn(prismaIngredientRepository, 'delete');

            expect(async () => {
                await ingredientService.deleteIngredientById(ingredientId);
            }).rejects.toThrow('404 - Ingredient not found');

            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId);
            expect(spyPrismaIngredientRepositoryDelete).not.toBeCalled();
        });

        it('should be able to delete an ingredient', async () => {
            const ingredientId = '1';
            const ingredientFromRepository: Ingredients = {
                id: '1',
                name: 'Cebola',
                availableAmount: 12,
                unitMoneyAmount: 3 as unknown as Decimal,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            prismaIngredientRepository.getById = jest.fn().mockResolvedValue(ingredientFromRepository);
            spyPrismaIngredientRepositoryGetById = jest.spyOn(prismaIngredientRepository, 'getById');
            spyPrismaIngredientRepositoryDelete = jest.spyOn(prismaIngredientRepository, 'delete');

            await ingredientService.deleteIngredientById(ingredientId);

            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledTimes(1);
            expect(spyPrismaIngredientRepositoryGetById).toHaveBeenCalledWith(ingredientId);
            expect(spyPrismaIngredientRepositoryDelete).toHaveBeenCalledTimes(1);
            expect(spyPrismaIngredientRepositoryDelete).toHaveBeenCalledWith(ingredientId);
        });
    });
});
