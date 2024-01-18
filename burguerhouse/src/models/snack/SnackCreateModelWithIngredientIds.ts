import { IngredientResponseModel } from '../ingredient/IngredientResponseModel';

export class SnackCreateModelWithIngredientIds {
    name: string;
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItems[];

    constructor(_name: string, _description: string, _snackItems: SnackItems[], _unitMoneyAmount: number) {
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}

class SnackItems {
    ingredientAmount: number;
    ingredient: Pick<IngredientResponseModel, 'id'>;

    constructor(_ingredientAmount: number, _ingredient: IngredientResponseModel) {
        this.ingredientAmount = _ingredientAmount;
        this.ingredient = _ingredient;
    }
}
