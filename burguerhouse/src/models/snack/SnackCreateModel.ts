import { IngredientModel } from '../ingredient/IngredientModel';

export class SnackCreateModel {
    name: string;
    description: number;
    unitMoneyAmount: number;
    snackItems: SnackItems[];

    constructor(_name: string, _description: number, _snackItems: SnackItems[], _unitMoneyAmount: number) {
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
    }
}

class SnackItems {
    ingredientAmount: number;
    ingredients?: IngredientModel[];

    constructor(_ingredientAmount: number, _ingredients: IngredientModel[]) {
        this.ingredientAmount = _ingredientAmount;
        this.ingredients = _ingredients;
    }
}
