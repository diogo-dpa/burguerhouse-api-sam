import { IngredientDto } from '../dtos/IngredientDto';
import { IIngredientService } from '../iservices/IIngredientService';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientModel } from '../models/ingredient/IngredientModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';

export class IngredientService implements IIngredientService {
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_ingredientRepository: PrismaIngredientRepository) {
        this.ingredientRepository = _ingredientRepository;
    }

    async createIngredient(newIngredient: IngredientCreateModel): Promise<IngredientModel> {
        const formattedIngredient = IngredientDto.convertIngredientCreateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.create(formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async updateIngredient(id: string, newIngredient: IngredientUpdateModel): Promise<IngredientModel> {
        const formattedIngredient = IngredientDto.converIngredientUpdateModelToPrismaModel(newIngredient);
        const ingredient = await this.ingredientRepository.update(id, formattedIngredient);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async getAllIngredients(): Promise<IngredientModel[]> {
        const ingredients = await this.ingredientRepository.getAll();
        return IngredientDto.convertIngredientsArrayToIngredientsModelArray(ingredients);
    }

    async getIngredientById(IngredientId: string): Promise<IngredientModel> {
        const ingredient = await this.ingredientRepository.getById(IngredientId);
        return IngredientDto.convertIngredientsToIngredientsModel(ingredient);
    }

    async deleteIngredientById(IngredientId: string): Promise<void> {
        await this.ingredientRepository.delete(IngredientId);
    }
}
