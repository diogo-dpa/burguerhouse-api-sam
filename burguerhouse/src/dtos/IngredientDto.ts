import { Prisma } from '@prisma/client';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { IngredientPrismaModel } from '../models/ingredient/IngredienPrismaModel';

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

    static convertIngredientsToIngredientsModel(ingredient: IngredientPrismaModel | null): IngredientResponseModel {
        if (!ingredient) return {} as IngredientResponseModel;

        return {
            id: ingredient.id,
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
        };
    }

    static convertIngredientsArrayToIngredientsModelArray(
        ingredients: IngredientPrismaModel[],
    ): IngredientResponseModel[] {
        return ingredients.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            availableAmount: ingredient.availableAmount,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
        }));
    }
}
