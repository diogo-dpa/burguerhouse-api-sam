import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';

export class SnackItemResponseModel {
    id: string;
    ingredientAmount: number;
    ingredientId?: string;
    ingredient?: IngredientResponseModel;

    constructor(_id: string, _ingredientAmount: number, _ingredientId: string, ingredient: IngredientResponseModel) {
        this.id = _id;
        this.ingredientAmount = _ingredientAmount;
        this.ingredientId = _ingredientId;
        this.ingredient = ingredient;
    }
}
