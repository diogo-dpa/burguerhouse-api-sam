import { IngredientDto } from '../dtos/IngredientDto';
import { IIngredientService } from '../iservices/IIngredientService';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';

export class IngredientService implements IIngredientService {
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_ingredientRepository: PrismaIngredientRepository) {
        this.ingredientRepository = _ingredientRepository;
    }

    async createIngredient(newIngredient: IngredientCreateModel): Promise<IngredientResponseModel> {
        const formattedIngredient = IngredientDto.convertIngredientCreateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.create(formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async updateIngredient(id: string, newIngredient: IngredientUpdateModel): Promise<IngredientResponseModel> {
        const formattedIngredient = IngredientDto.converIngredientUpdateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.update(id, formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async getAllIngredients(): Promise<IngredientResponseModel[]> {
        const ingredients = await this.ingredientRepository.getAll();
        return IngredientDto.convertIngredientsArrayToIngredientsModelArray(ingredients);
    }

    async getIngredientById(IngredientId: string): Promise<IngredientResponseModel> {
        const ingredient = await this.ingredientRepository.getById(IngredientId);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async deleteIngredientById(IngredientId: string): Promise<void> {
        await this.ingredientRepository.delete(IngredientId);
    }
}
