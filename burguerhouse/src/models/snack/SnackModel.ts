import { IngredientModel } from '../ingredient/IngredientModel';

export class SnackModel {
    id: string;
    name: string;
    description: number;
    unitMoneyAmount: number;
    snackItems: SnackItems[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _name: string,
        _description: number,
        _snackItems: SnackItems[],
        _unitMoneyAmount: number,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
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
