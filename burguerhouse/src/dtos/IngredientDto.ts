import { Ingredients, Prisma } from '@prisma/client';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientModel } from '../models/ingredient/IngredientModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';

export class IngredientDto {
    static convertIngredientCreateModelToPrismaModel(ingredient: IngredientCreateModel): Prisma.IngredientsCreateInput {
        return {
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: ingredient.unitMoneyAmount,
        };
    }

    static converIngredientUpdateModelToPrismaModel(ingredient: IngredientUpdateModel): Prisma.IngredientsUpdateInput {
        return {
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: ingredient.unitMoneyAmount,
        };
    }

    static convertIngredientsToIngredientsModel(ingredient: Ingredients | null): IngredientModel {
        if (!ingredient) return {} as IngredientModel;

        return {
            id: ingredient.id,
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
            createdAt: ingredient.createdAt,
            updatedAt: ingredient.updatedAt,
        };
    }

    static convertIngredientsArrayToIngredientsModelArray(ingredients: Ingredients[]): IngredientModel[] {
        return ingredients.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
            createdAt: ingredient.createdAt,
            updatedAt: ingredient.updatedAt,
        }));
    }
}
