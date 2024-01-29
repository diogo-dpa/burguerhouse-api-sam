import { IngredientDto } from '../dtos/IngredientDto';
import { IIngredientService } from '../iservices/IIngredientService';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export class IngredientService implements IIngredientService {
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_ingredientRepository: PrismaIngredientRepository) {
        this.ingredientRepository = _ingredientRepository;
    }

    async createIngredient(newIngredient: IngredientCreateModel): Promise<IngredientResponseModel> {
        const existingIngredient = await this.ingredientRepository.getByName(newIngredient.name);
        if (existingIngredient)
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.existingIngredientNameMessage));

        const formattedIngredient = IngredientDto.convertIngredientCreateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.create(formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async updateIngredient(id: string, newIngredient: IngredientUpdateModel): Promise<IngredientResponseModel> {
        const foundIngredient = await this.ingredientRepository.getById(id);
        if (!foundIngredient)
            throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.ingredientNotFoundMessage));

        if (!!newIngredient.name) {
            const existingIngredient = await this.ingredientRepository.getByName(newIngredient.name);
            if (existingIngredient)
                throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.existingIngredientNameMessage));
        }

        const formattedIngredient = IngredientDto.converIngredientUpdateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.update(id, formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async getAllIngredients(queryOptions?: JsonAPIQueryOptions): Promise<IngredientResponseModel[]> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const ingredients = await this.ingredientRepository.getAll({ sort, include, page, fields });
        return IngredientDto.convertIngredientsArrayToIngredientsModelArray(ingredients);
    }

    async getIngredientById(
        IngredientId: string,
        queryOptions?: JsonAPIQueryOptions,
    ): Promise<IngredientResponseModel> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const ingredient = await this.ingredientRepository.getById(IngredientId, { sort, include, page, fields });
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async deleteIngredientById(ingredientId: string): Promise<void> {
        const foundIngredient = await this.ingredientRepository.getById(ingredientId);
        if (!foundIngredient)
            throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.ingredientNotFoundMessage));

        await this.ingredientRepository.delete(ingredientId);
    }
}
