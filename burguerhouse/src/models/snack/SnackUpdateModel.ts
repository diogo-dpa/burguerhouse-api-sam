import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';

export class SnackUpdateModel {
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItems[];

    constructor(_description: string, _snackItems: SnackItems[], _unitMoneyAmount: number) {
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}

export class SnackItems {
    ingredientAmount: number;
    ingredient?: IngredientResponseModel;

    constructor(_ingredientAmount: number, _ingredient: IngredientResponseModel) {
        this.ingredientAmount = _ingredientAmount;
        this.ingredient = _ingredient;
    }
}
