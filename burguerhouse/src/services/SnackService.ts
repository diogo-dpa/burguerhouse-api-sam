import { SnackDto } from '../dtos/SnackDto';
import { ISnackService } from '../iservices/ISnackService';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export class SnackService implements ISnackService {
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_snackRepository: PrismaSnacksRepository, _ingredientRepository: PrismaIngredientRepository) {
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
    }

    async createSnack(newSnack: SnackCreateModel): Promise<SnackResponseModel> {
        const { snackItems } = newSnack;

        if (
            snackItems?.some(
                (item) =>
                    !ErrorHandler.validateStringParameterReturningBool(item.ingredientId) ||
                    !ErrorHandler.validateNumberParameterReturningBool(item.ingredientAmount),
            )
        )
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.invalidParametersMessage));

        const existingSnack = await this.snackRepository.getByName(newSnack.name);
        if (existingSnack) throw new Error(ErrorHandler.returnBadRequestCustomError('Existing snack name'));

        const ingredientIdFromSnackItems = snackItems.map((ingredientSnackItem) => ingredientSnackItem.ingredientId);

        const ingredientPromise = ingredientIdFromSnackItems
            .filter((ingredientId) => !!ingredientId)
            .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

        const ingredients = await Promise.all([...ingredientPromise]);

        if (ingredients.some((ingredient) => !ingredient)) throw new Error(ErrorHandler.ingredientNotFoundMessage);

        const snack = await this.snackRepository.create(newSnack);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async updateSnack(snackId: string, updateSnack: SnackUpdateModel): Promise<SnackResponseModel> {
        const { snackItems } = updateSnack;

        const foundSnack = await this.snackRepository.getById(snackId);

        if (!foundSnack) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.snackNotFoundMessage));

        if (!!snackItems?.length) {
            if (
                snackItems?.some(
                    (item) =>
                        !ErrorHandler.validateStringParameterReturningBool(item.ingredientId) ||
                        !ErrorHandler.validateNumberParameterReturningBool(item.ingredientAmount),
                )
            )
                throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.invalidParametersMessage));

            const ingredientIdFromSnackItems = snackItems.map(
                (ingredientSnackItem) => ingredientSnackItem.ingredientId,
            );

            const ingredientPromise = ingredientIdFromSnackItems
                .filter((ingredientId) => !!ingredientId)
                .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

            const ingredients = await Promise.all([...ingredientPromise]);

            if (ingredients.some((ingredient) => ingredient === null))
                throw new Error(ErrorHandler.ingredientNotFoundMessage);
        }

        const snack = await this.snackRepository.update(snackId, updateSnack);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async getAllSnacks(queryOptions?: JsonAPIQueryOptions): Promise<SnackResponseModel[]> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const snacks = await this.snackRepository.getAll({ sort, include, page, fields });
        return SnackDto.convertPrismaModelArrayToSnackModelArray(snacks);
    }

    async getSnackById(snackId: string, queryOptions?: JsonAPIQueryOptions): Promise<SnackResponseModel> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const snack = await this.snackRepository.getById(snackId, { sort, include, page, fields });
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async deleteSnackById(snackId: string): Promise<void> {
        const foundSnack = await this.snackRepository.getById(snackId);

        if (!foundSnack) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.snackNotFoundMessage));

        await this.snackRepository.delete(snackId);
    }
}
